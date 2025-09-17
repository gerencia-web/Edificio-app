from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta, time, timezone
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class UserRole(str, Enum):
    RESIDENTE = "RESIDENTE"
    ADMINISTRADOR = "ADMINISTRADOR"
    PROVEEDOR = "PROVEEDOR"

class PaymentStatus(str, Enum):
    PENDIENTE = "PENDIENTE"
    PAGADO = "PAGADO"
    VENCIDO = "VENCIDO"

class ReservationStatus(str, Enum):
    CONFIRMADA = "CONFIRMADA"
    PENDIENTE = "PENDIENTE"
    CANCELADA = "CANCELADA"

class VotingStatus(str, Enum):
    ACTIVA = "ACTIVA"
    CERRADA = "CERRADA"
    BORRADOR = "BORRADOR"

class IncidentStatus(str, Enum):
    ABIERTA = "ABIERTA"
    EN_PROCESO = "EN_PROCESO"
    RESUELTA = "RESUELTA"
    CERRADA = "CERRADA"

class Priority(str, Enum):
    BAJA = "BAJA"
    MEDIA = "MEDIA"
    ALTA = "ALTA"
    URGENTE = "URGENTE"

# Pydantic Models
class Building(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    address: str
    total_units: int
    is_demo: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    role: UserRole
    is_active: bool = True
    building_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Resident(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    unit_number: str
    building_id: str

class Property(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    unit_number: str
    floor: int
    area_m2: float
    property_value: float
    building_id: str
    resident_id: Optional[str] = None

class CommonArea(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    capacity: int
    price_per_hour: float
    opening_time: str
    closing_time: str
    building_id: str
    is_active: bool = True

class Reservation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    common_area_id: str
    resident_id: str
    date: str
    start_time: str
    end_time: str
    status: ReservationStatus
    total_cost: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PaymentConcept(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    base_amount: float
    is_variable: bool = False
    frequency: str  # MENSUAL, ANUAL
    is_mandatory: bool = True
    building_id: str

class Payment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    resident_id: str
    concept_id: str
    amount: float
    due_date: str
    status: PaymentStatus
    paid_date: Optional[str] = None
    building_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Voting(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    start_date: str
    end_date: str
    status: VotingStatus
    options: List[str]
    building_id: str
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Vote(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    voting_id: str
    resident_id: str
    option: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Incident(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str
    priority: Priority
    status: IncidentStatus
    reported_by: str
    building_id: str
    images: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Helper function to convert datetime to string for MongoDB
def prepare_for_mongo(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

# Helper function to clean MongoDB documents for JSON serialization
def clean_mongo_doc(doc):
    if isinstance(doc, dict):
        # Remove MongoDB's _id field to avoid ObjectId serialization issues
        if '_id' in doc:
            del doc['_id']
        # Recursively clean nested documents
        for key, value in doc.items():
            if isinstance(value, dict):
                doc[key] = clean_mongo_doc(value)
            elif isinstance(value, list):
                doc[key] = [clean_mongo_doc(item) if isinstance(item, dict) else item for item in value]
    return doc

# Demo data initialization
async def init_demo_data():
    # Check if demo data already exists
    existing_building = await db.buildings.find_one({"is_demo": True})
    if existing_building:
        return  # Demo data already exists
    
    # Create demo building
    demo_building = Building(
        name="Torre Moderna Demo",
        address="Av. Principal 123, Lima",
        total_units=20,
        is_demo=True
    )
    await db.buildings.insert_one(prepare_for_mongo(demo_building.dict()))
    building_id = demo_building.id
    
    # Create demo users
    demo_users = [
        User(username="residente_demo", email="residente@demo.com", role=UserRole.RESIDENTE, building_id=building_id),
        User(username="admin_demo", email="admin@demo.com", role=UserRole.ADMINISTRADOR, building_id=building_id),
        User(username="proveedor_demo", email="proveedor@demo.com", role=UserRole.PROVEEDOR, building_id=building_id)
    ]
    
    for user in demo_users:
        await db.users.insert_one(prepare_for_mongo(user.dict()))
    
    # Create demo resident
    demo_resident = Resident(
        user_id=demo_users[0].id,
        first_name="Juan",
        last_name="Pérez",
        phone="+51 999 888 777",
        unit_number="301",
        building_id=building_id
    )
    await db.residents.insert_one(prepare_for_mongo(demo_resident.dict()))
    
    # Create demo properties
    demo_properties = [
        Property(unit_number="301", floor=3, area_m2=85.5, property_value=350000.0, building_id=building_id, resident_id=demo_resident.id),
        Property(unit_number="405", floor=4, area_m2=92.0, property_value=380000.0, building_id=building_id),
        Property(unit_number="202", floor=2, area_m2=78.25, property_value=320000.0, building_id=building_id),
    ]
    
    for prop in demo_properties:
        await db.properties.insert_one(prepare_for_mongo(prop.dict()))
    
    # Create demo common areas
    demo_areas = [
        CommonArea(name="Gimnasio", description="Gimnasio completamente equipado", capacity=15, price_per_hour=25.0, opening_time="06:00", closing_time="22:00", building_id=building_id),
        CommonArea(name="Piscina", description="Piscina climatizada para adultos", capacity=30, price_per_hour=40.0, opening_time="08:00", closing_time="20:00", building_id=building_id),
        CommonArea(name="Salón Social", description="Salón para eventos y reuniones", capacity=50, price_per_hour=60.0, opening_time="09:00", closing_time="23:00", building_id=building_id),
        CommonArea(name="Co-working", description="Espacio de trabajo compartido", capacity=12, price_per_hour=15.0, opening_time="07:00", closing_time="21:00", building_id=building_id),
    ]
    
    for area in demo_areas:
        await db.common_areas.insert_one(prepare_for_mongo(area.dict()))
    
    # Create demo payment concepts
    demo_concepts = [
        PaymentConcept(name="Mantenimiento", description="Cuota mensual de mantenimiento", base_amount=280.0, frequency="MENSUAL", building_id=building_id),
        PaymentConcept(name="Agua", description="Servicio de agua potable", base_amount=45.0, is_variable=True, frequency="MENSUAL", building_id=building_id),
        PaymentConcept(name="Luz Común", description="Electricidad áreas comunes", base_amount=35.0, is_variable=True, frequency="MENSUAL", building_id=building_id),
        PaymentConcept(name="Seguridad", description="Servicio de seguridad 24/7", base_amount=120.0, frequency="MENSUAL", building_id=building_id),
    ]
    
    for concept in demo_concepts:
        await db.payment_concepts.insert_one(prepare_for_mongo(concept.dict()))
    
    # Create demo payments
    current_date = datetime.now(timezone.utc)
    demo_payments = [
        Payment(resident_id=demo_resident.id, concept_id=demo_concepts[0].id, amount=280.0, due_date=(current_date + timedelta(days=5)).strftime("%Y-%m-%d"), status=PaymentStatus.PENDIENTE, building_id=building_id),
        Payment(resident_id=demo_resident.id, concept_id=demo_concepts[1].id, amount=52.30, due_date=(current_date - timedelta(days=2)).strftime("%Y-%m-%d"), status=PaymentStatus.VENCIDO, building_id=building_id),
        Payment(resident_id=demo_resident.id, concept_id=demo_concepts[2].id, amount=38.50, due_date=(current_date - timedelta(days=30)).strftime("%Y-%m-%d"), status=PaymentStatus.PAGADO, paid_date=(current_date - timedelta(days=25)).strftime("%Y-%m-%d"), building_id=building_id),
    ]
    
    for payment in demo_payments:
        await db.payments.insert_one(prepare_for_mongo(payment.dict()))
    
    # Create demo voting
    demo_voting = Voting(
        title="¿Aprobar nueva área de juegos infantiles?",
        description="Propuesta para implementar un área de juegos para niños en la azotea del edificio. La inversión sería de S/ 15,000 aproximadamente.",
        start_date=current_date.strftime("%Y-%m-%d"),
        end_date=(current_date + timedelta(days=7)).strftime("%Y-%m-%d"),
        status=VotingStatus.ACTIVA,
        options=["A FAVOR", "EN CONTRA", "ABSTENCIÓN"],
        building_id=building_id,
        created_by=demo_users[1].id
    )
    await db.votings.insert_one(prepare_for_mongo(demo_voting.dict()))
    
    # Create demo reservations
    tomorrow = current_date + timedelta(days=1)
    demo_reservations = [
        Reservation(common_area_id=demo_areas[0].id, resident_id=demo_resident.id, date=tomorrow.strftime("%Y-%m-%d"), start_time="19:00", end_time="21:00", status=ReservationStatus.CONFIRMADA, total_cost=50.0),
        Reservation(common_area_id=demo_areas[1].id, resident_id=demo_resident.id, date=(tomorrow + timedelta(days=2)).strftime("%Y-%m-%d"), start_time="15:00", end_time="17:00", status=ReservationStatus.CONFIRMADA, total_cost=80.0),
    ]
    
    for reservation in demo_reservations:
        await db.reservations.insert_one(prepare_for_mongo(reservation.dict()))
    
    # Create demo incidents
    demo_incidents = [
        Incident(title="Fuga de agua en el lobby", description="Se reporta una fuga de agua en el área del lobby principal, cerca de los ascensores.", category="Plomería", priority=Priority.ALTA, status=IncidentStatus.EN_PROCESO, reported_by=demo_resident.id, building_id=building_id),
        Incident(title="Luz del estacionamiento no funciona", description="La luz del sector B del estacionamiento subterráneo no está funcionando desde hace 2 días.", category="Electricidad", priority=Priority.MEDIA, status=IncidentStatus.ABIERTA, reported_by=demo_resident.id, building_id=building_id),
    ]
    
    for incident in demo_incidents:
        await db.incidents.insert_one(prepare_for_mongo(incident.dict()))

# API Routes
@api_router.get("/")
async def root():
    return {"message": "AdminEdificios Pro API"}

@api_router.get("/init-demo")
async def initialize_demo_data():
    await init_demo_data()
    return {"message": "Demo data initialized successfully"}

@api_router.get("/resident/dashboard")
async def get_resident_dashboard():
    # Get demo building
    building = await db.buildings.find_one({"is_demo": True})
    if not building:
        raise HTTPException(status_code=404, detail="Demo building not found")
    
    building_id = building["id"]
    
    # Get demo resident
    resident = await db.residents.find_one({"building_id": building_id})
    if not resident:
        raise HTTPException(status_code=404, detail="Demo resident not found")
    
    resident_id = resident["id"]
    
    # Get payment summary
    payments = await db.payments.find({"resident_id": resident_id}).to_list(100)
    payments = [clean_mongo_doc(p) for p in payments]
    pending_payments = [p for p in payments if p["status"] == "PENDIENTE"]
    overdue_payments = [p for p in payments if p["status"] == "VENCIDO"]
    
    # Get upcoming reservations
    current_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    reservations = await db.reservations.find({
        "resident_id": resident_id,
        "date": {"$gte": current_date},
        "status": "CONFIRMADA"
    }).to_list(10)
    reservations = [clean_mongo_doc(r) for r in reservations]
    
    # Get active votings
    active_votings = await db.votings.find({
        "building_id": building_id,
        "status": "ACTIVA"
    }).to_list(10)
    active_votings = [clean_mongo_doc(v) for v in active_votings]
    
    # Get recent incidents
    recent_incidents = await db.incidents.find({
        "reported_by": resident_id,
        "building_id": building_id
    }).sort("created_at", -1).limit(5).to_list(5)
    recent_incidents = [clean_mongo_doc(i) for i in recent_incidents]
    
    return {
        "resident": clean_mongo_doc(resident),
        "payments_summary": {
            "pending_count": len(pending_payments),
            "pending_total": sum(p["amount"] for p in pending_payments),
            "overdue_count": len(overdue_payments),
            "overdue_total": sum(p["amount"] for p in overdue_payments)
        },
        "upcoming_reservations": reservations,
        "active_votings": active_votings,
        "recent_incidents": recent_incidents
    }

@api_router.get("/common-areas")
async def get_common_areas():
    building = await db.buildings.find_one({"is_demo": True})
    if not building:
        raise HTTPException(status_code=404, detail="Demo building not found")
    
    areas = await db.common_areas.find({"building_id": building["id"], "is_active": True}).to_list(100)
    return areas

@api_router.get("/reservations/{area_id}")
async def get_area_reservations(area_id: str):
    current_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    reservations = await db.reservations.find({
        "common_area_id": area_id,
        "date": {"$gte": current_date},
        "status": {"$in": ["CONFIRMADA", "PENDIENTE"]}
    }).to_list(100)
    return reservations

@api_router.post("/reservations")
async def create_reservation(reservation_data: dict):
    # Get demo resident
    building = await db.buildings.find_one({"is_demo": True})
    resident = await db.residents.find_one({"building_id": building["id"]})
    
    reservation = Reservation(
        common_area_id=reservation_data["common_area_id"],
        resident_id=resident["id"],
        date=reservation_data["date"],
        start_time=reservation_data["start_time"],
        end_time=reservation_data["end_time"],
        status=ReservationStatus.CONFIRMADA,
        total_cost=reservation_data["total_cost"]
    )
    
    await db.reservations.insert_one(prepare_for_mongo(reservation.dict()))
    return {"message": "Reserva creada exitosamente", "reservation": reservation}

@api_router.get("/payments")
async def get_resident_payments():
    building = await db.buildings.find_one({"is_demo": True})
    resident = await db.residents.find_one({"building_id": building["id"]})
    
    payments = await db.payments.find({"resident_id": resident["id"]}).to_list(100)
    
    # Get payment concepts for each payment
    for payment in payments:
        concept = await db.payment_concepts.find_one({"id": payment["concept_id"]})
        payment["concept"] = concept
    
    return payments

@api_router.get("/votings")
async def get_active_votings():
    building = await db.buildings.find_one({"is_demo": True})
    
    votings = await db.votings.find({
        "building_id": building["id"],
        "status": "ACTIVA"
    }).to_list(100)
    
    return votings

@api_router.post("/vote")
async def cast_vote(vote_data: dict):
    building = await db.buildings.find_one({"is_demo": True})
    resident = await db.residents.find_one({"building_id": building["id"]})
    
    # Check if already voted
    existing_vote = await db.votes.find_one({
        "voting_id": vote_data["voting_id"],
        "resident_id": resident["id"]
    })
    
    if existing_vote:
        raise HTTPException(status_code=400, detail="Ya has votado en esta consulta")
    
    vote = Vote(
        voting_id=vote_data["voting_id"],
        resident_id=resident["id"],
        option=vote_data["option"]
    )
    
    await db.votes.insert_one(prepare_for_mongo(vote.dict()))
    return {"message": "Voto registrado exitosamente"}

@api_router.post("/incidents")
async def create_incident(incident_data: dict):
    building = await db.buildings.find_one({"is_demo": True})
    resident = await db.residents.find_one({"building_id": building["id"]})
    
    incident = Incident(
        title=incident_data["title"],
        description=incident_data["description"],
        category=incident_data["category"],
        priority=Priority(incident_data["priority"]),
        status=IncidentStatus.ABIERTA,
        reported_by=resident["id"],
        building_id=building["id"],
        images=incident_data.get("images", [])
    )
    
    await db.incidents.insert_one(prepare_for_mongo(incident.dict()))
    return {"message": "Incidencia reportada exitosamente", "incident": incident}

@api_router.get("/incidents")
async def get_resident_incidents():
    building = await db.buildings.find_one({"is_demo": True})
    resident = await db.residents.find_one({"building_id": building["id"]})
    
    incidents = await db.incidents.find({
        "reported_by": resident["id"],
        "building_id": building["id"]
    }).sort("created_at", -1).to_list(100)
    
    return incidents

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await init_demo_data()
    logger.info("Demo data initialized")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
#!/usr/bin/env python3
"""
AdminEdificios Pro Backend API Test Suite
Tests all backend endpoints for the building management SaaS application
"""

import requests
import json
import sys
from datetime import datetime, timedelta
import uuid

# Configuration
BASE_URL = "https://adminedificios.preview.emergentagent.com/api"
TIMEOUT = 30

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_test_header(test_name):
    print(f"\n{Colors.BLUE}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.BLUE}{Colors.BOLD}Testing: {test_name}{Colors.ENDC}")
    print(f"{Colors.BLUE}{Colors.BOLD}{'='*60}{Colors.ENDC}")

def print_success(message):
    print(f"{Colors.GREEN}✅ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.RED}❌ {message}{Colors.ENDC}")

def print_warning(message):
    print(f"{Colors.YELLOW}⚠️  {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ️  {message}{Colors.ENDC}")

def test_api_health():
    """Test 1: Basic API Health - Test the root endpoint /api/"""
    print_test_header("API Health Check")
    
    try:
        response = requests.get(f"{BASE_URL}/", timeout=TIMEOUT)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "AdminEdificios Pro API":
                print_success("API is running and responding correctly")
                print_info(f"Response: {data}")
                return True
            else:
                print_error(f"Unexpected response message: {data}")
                return False
        else:
            print_error(f"API health check failed with status {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Failed to connect to API: {e}")
        return False

def test_demo_data_initialization():
    """Test 2: Demo Data Initialization - Test /api/init-demo endpoint"""
    print_test_header("Demo Data Initialization")
    
    try:
        response = requests.get(f"{BASE_URL}/init-demo", timeout=TIMEOUT)
        
        if response.status_code == 200:
            data = response.json()
            if "Demo data initialized successfully" in data.get("message", ""):
                print_success("Demo data initialization successful")
                print_info(f"Response: {data}")
                return True
            else:
                print_error(f"Unexpected initialization response: {data}")
                return False
        else:
            print_error(f"Demo data initialization failed with status {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Failed to initialize demo data: {e}")
        return False

def test_resident_dashboard():
    """Test 3: Resident Dashboard - Test /api/resident/dashboard"""
    print_test_header("Resident Dashboard")
    
    try:
        response = requests.get(f"{BASE_URL}/resident/dashboard", timeout=TIMEOUT)
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify required dashboard components
            required_keys = ["resident", "payments_summary", "upcoming_reservations", "active_votings", "recent_incidents"]
            missing_keys = [key for key in required_keys if key not in data]
            
            if missing_keys:
                print_error(f"Missing required dashboard components: {missing_keys}")
                return False
            
            # Verify resident data
            resident = data["resident"]
            if not resident.get("id") or not resident.get("first_name"):
                print_error("Invalid resident data in dashboard")
                return False
            
            # Verify payments summary structure
            payments_summary = data["payments_summary"]
            payment_keys = ["pending_count", "pending_total", "overdue_count", "overdue_total"]
            missing_payment_keys = [key for key in payment_keys if key not in payments_summary]
            
            if missing_payment_keys:
                print_error(f"Missing payment summary keys: {missing_payment_keys}")
                return False
            
            print_success("Resident dashboard loaded successfully")
            print_info(f"Resident: {resident['first_name']} {resident['last_name']} - Unit {resident['unit_number']}")
            print_info(f"Pending payments: {payments_summary['pending_count']} (Total: S/ {payments_summary['pending_total']})")
            print_info(f"Overdue payments: {payments_summary['overdue_count']} (Total: S/ {payments_summary['overdue_total']})")
            print_info(f"Upcoming reservations: {len(data['upcoming_reservations'])}")
            print_info(f"Active votings: {len(data['active_votings'])}")
            print_info(f"Recent incidents: {len(data['recent_incidents'])}")
            
            return True
            
        else:
            print_error(f"Dashboard request failed with status {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Failed to load resident dashboard: {e}")
        return False

def test_common_areas():
    """Test 4: Common Areas - Test /api/common-areas"""
    print_test_header("Common Areas")
    
    try:
        response = requests.get(f"{BASE_URL}/common-areas", timeout=TIMEOUT)
        
        if response.status_code == 200:
            areas = response.json()
            
            if not isinstance(areas, list):
                print_error("Common areas response should be a list")
                return False
            
            if len(areas) == 0:
                print_warning("No common areas found")
                return True
            
            # Verify area structure
            expected_areas = ["Gimnasio", "Piscina", "Salón Social", "Co-working"]
            found_areas = [area["name"] for area in areas]
            
            print_success(f"Found {len(areas)} common areas")
            for area in areas:
                print_info(f"- {area['name']}: S/ {area['price_per_hour']}/hour, Capacity: {area['capacity']}, Hours: {area['opening_time']}-{area['closing_time']}")
            
            # Check if expected demo areas are present
            missing_areas = [area for area in expected_areas if area not in found_areas]
            if missing_areas:
                print_warning(f"Expected demo areas not found: {missing_areas}")
            
            return True
            
        else:
            print_error(f"Common areas request failed with status {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Failed to load common areas: {e}")
        return False

def test_reservations():
    """Test 5: Reservations - Test creating a reservation via POST /api/reservations"""
    print_test_header("Reservations")
    
    # First get common areas to use in reservation
    try:
        areas_response = requests.get(f"{BASE_URL}/common-areas", timeout=TIMEOUT)
        if areas_response.status_code != 200:
            print_error("Cannot test reservations - common areas not available")
            return False
        
        areas = areas_response.json()
        if not areas:
            print_error("Cannot test reservations - no common areas available")
            return False
        
        # Use the first available area (Gimnasio)
        test_area = areas[0]
        
        # Create a reservation for tomorrow
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        
        reservation_data = {
            "common_area_id": test_area["id"],
            "date": tomorrow,
            "start_time": "18:00",
            "end_time": "20:00",
            "total_cost": test_area["price_per_hour"] * 2  # 2 hours
        }
        
        response = requests.post(f"{BASE_URL}/reservations", 
                               json=reservation_data, 
                               timeout=TIMEOUT)
        
        if response.status_code == 200:
            data = response.json()
            
            if "message" in data and "exitosamente" in data["message"]:
                print_success("Reservation created successfully")
                print_info(f"Area: {test_area['name']}")
                print_info(f"Date: {tomorrow}")
                print_info(f"Time: {reservation_data['start_time']} - {reservation_data['end_time']}")
                print_info(f"Total cost: S/ {reservation_data['total_cost']}")
                
                # Verify reservation data structure
                if "reservation" in data:
                    reservation = data["reservation"]
                    required_fields = ["id", "common_area_id", "resident_id", "date", "start_time", "end_time", "status", "total_cost"]
                    missing_fields = [field for field in required_fields if field not in reservation]
                    
                    if missing_fields:
                        print_warning(f"Reservation missing fields: {missing_fields}")
                    else:
                        print_info(f"Reservation ID: {reservation['id']}")
                        print_info(f"Status: {reservation['status']}")
                
                return True
            else:
                print_error(f"Unexpected reservation response: {data}")
                return False
        else:
            print_error(f"Reservation creation failed with status {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Failed to create reservation: {e}")
        return False

def test_payments():
    """Test 6: Payments - Test /api/payments to get resident payment history"""
    print_test_header("Payments")
    
    try:
        response = requests.get(f"{BASE_URL}/payments", timeout=TIMEOUT)
        
        if response.status_code == 200:
            payments = response.json()
            
            if not isinstance(payments, list):
                print_error("Payments response should be a list")
                return False
            
            if len(payments) == 0:
                print_warning("No payments found for resident")
                return True
            
            print_success(f"Found {len(payments)} payments")
            
            # Verify payment structure and concepts
            for payment in payments:
                required_fields = ["id", "resident_id", "concept_id", "amount", "due_date", "status"]
                missing_fields = [field for field in required_fields if field not in payment]
                
                if missing_fields:
                    print_warning(f"Payment missing fields: {missing_fields}")
                    continue
                
                # Check if concept is populated
                if "concept" in payment and payment["concept"]:
                    concept = payment["concept"]
                    print_info(f"- {concept['name']}: S/ {payment['amount']} - {payment['status']} (Due: {payment['due_date']})")
                else:
                    print_warning(f"Payment concept not populated for payment {payment['id']}")
            
            # Check for different payment statuses
            statuses = [payment["status"] for payment in payments]
            unique_statuses = set(statuses)
            print_info(f"Payment statuses found: {list(unique_statuses)}")
            
            return True
            
        else:
            print_error(f"Payments request failed with status {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Failed to load payments: {e}")
        return False

def test_votings():
    """Test 7: Votings - Test /api/votings and POST /api/vote"""
    print_test_header("Votings")
    
    try:
        # First get active votings
        response = requests.get(f"{BASE_URL}/votings", timeout=TIMEOUT)
        
        if response.status_code == 200:
            votings = response.json()
            
            if not isinstance(votings, list):
                print_error("Votings response should be a list")
                return False
            
            if len(votings) == 0:
                print_warning("No active votings found")
                return True
            
            print_success(f"Found {len(votings)} active votings")
            
            # Test voting on the first available voting
            test_voting = votings[0]
            
            required_fields = ["id", "title", "description", "options", "status"]
            missing_fields = [field for field in required_fields if field not in test_voting]
            
            if missing_fields:
                print_error(f"Voting missing required fields: {missing_fields}")
                return False
            
            print_info(f"Voting: {test_voting['title']}")
            print_info(f"Description: {test_voting['description']}")
            print_info(f"Options: {test_voting['options']}")
            print_info(f"Status: {test_voting['status']}")
            
            # Test casting a vote
            if test_voting["options"]:
                vote_data = {
                    "voting_id": test_voting["id"],
                    "option": test_voting["options"][0]  # Vote for first option
                }
                
                vote_response = requests.post(f"{BASE_URL}/vote", 
                                            json=vote_data, 
                                            timeout=TIMEOUT)
                
                if vote_response.status_code == 200:
                    vote_result = vote_response.json()
                    if "exitosamente" in vote_result.get("message", ""):
                        print_success(f"Vote cast successfully for option: {vote_data['option']}")
                    else:
                        print_error(f"Unexpected vote response: {vote_result}")
                        return False
                elif vote_response.status_code == 400:
                    # Already voted - this is expected behavior
                    error_data = vote_response.json()
                    if "Ya has votado" in error_data.get("detail", ""):
                        print_info("Already voted in this consultation (expected behavior)")
                    else:
                        print_error(f"Unexpected voting error: {error_data}")
                        return False
                else:
                    print_error(f"Vote casting failed with status {vote_response.status_code}")
                    print_error(f"Response: {vote_response.text}")
                    return False
            
            return True
            
        else:
            print_error(f"Votings request failed with status {response.status_code}")
            print_error(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Failed to test votings: {e}")
        return False

def test_incidents():
    """Test 8: Incidents - Test creating an incident via POST /api/incidents and getting incidents via GET /api/incidents"""
    print_test_header("Incidents")
    
    try:
        # First create a new incident
        incident_data = {
            "title": "Problema con el ascensor principal",
            "description": "El ascensor principal hace ruidos extraños y se detiene entre pisos. Necesita revisión técnica urgente.",
            "category": "Mantenimiento",
            "priority": "ALTA",
            "images": []
        }
        
        create_response = requests.post(f"{BASE_URL}/incidents", 
                                      json=incident_data, 
                                      timeout=TIMEOUT)
        
        if create_response.status_code == 200:
            create_data = create_response.json()
            
            if "exitosamente" in create_data.get("message", ""):
                print_success("Incident created successfully")
                print_info(f"Title: {incident_data['title']}")
                print_info(f"Category: {incident_data['category']}")
                print_info(f"Priority: {incident_data['priority']}")
                
                # Verify incident structure
                if "incident" in create_data:
                    incident = create_data["incident"]
                    required_fields = ["id", "title", "description", "category", "priority", "status", "reported_by", "building_id"]
                    missing_fields = [field for field in required_fields if field not in incident]
                    
                    if missing_fields:
                        print_warning(f"Created incident missing fields: {missing_fields}")
                    else:
                        print_info(f"Incident ID: {incident['id']}")
                        print_info(f"Status: {incident['status']}")
            else:
                print_error(f"Unexpected incident creation response: {create_data}")
                return False
        else:
            print_error(f"Incident creation failed with status {create_response.status_code}")
            print_error(f"Response: {create_response.text}")
            return False
        
        # Now get all incidents
        get_response = requests.get(f"{BASE_URL}/incidents", timeout=TIMEOUT)
        
        if get_response.status_code == 200:
            incidents = get_response.json()
            
            if not isinstance(incidents, list):
                print_error("Incidents response should be a list")
                return False
            
            print_success(f"Retrieved {len(incidents)} incidents")
            
            # Verify incident structure
            for incident in incidents:
                required_fields = ["id", "title", "description", "category", "priority", "status"]
                missing_fields = [field for field in required_fields if field not in incident]
                
                if missing_fields:
                    print_warning(f"Incident missing fields: {missing_fields}")
                    continue
                
                print_info(f"- {incident['title']}: {incident['category']} - {incident['priority']} ({incident['status']})")
            
            return True
            
        else:
            print_error(f"Get incidents failed with status {get_response.status_code}")
            print_error(f"Response: {get_response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Failed to test incidents: {e}")
        return False

def run_all_tests():
    """Run all backend API tests"""
    print(f"{Colors.BOLD}{Colors.BLUE}")
    print("=" * 80)
    print("AdminEdificios Pro Backend API Test Suite")
    print("=" * 80)
    print(f"{Colors.ENDC}")
    
    print_info(f"Testing API at: {BASE_URL}")
    print_info(f"Timeout: {TIMEOUT} seconds")
    
    tests = [
        ("API Health Check", test_api_health),
        ("Demo Data Initialization", test_demo_data_initialization),
        ("Resident Dashboard", test_resident_dashboard),
        ("Common Areas", test_common_areas),
        ("Reservations", test_reservations),
        ("Payments", test_payments),
        ("Votings", test_votings),
        ("Incidents", test_incidents)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print_error(f"Test '{test_name}' crashed with exception: {e}")
            results[test_name] = False
    
    # Print summary
    print(f"\n{Colors.BOLD}{Colors.BLUE}")
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"{Colors.ENDC}")
    
    passed = 0
    failed = 0
    
    for test_name, result in results.items():
        if result:
            print_success(f"{test_name}: PASSED")
            passed += 1
        else:
            print_error(f"{test_name}: FAILED")
            failed += 1
    
    print(f"\n{Colors.BOLD}")
    print(f"Total Tests: {len(tests)}")
    print(f"{Colors.GREEN}Passed: {passed}{Colors.ENDC}")
    print(f"{Colors.RED}Failed: {failed}{Colors.ENDC}")
    
    if failed == 0:
        print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 All tests passed! Backend API is working correctly.{Colors.ENDC}")
        return True
    else:
        print(f"\n{Colors.RED}{Colors.BOLD}❌ {failed} test(s) failed. Please check the issues above.{Colors.ENDC}")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Portal Selection Landing Page
const PortalSelection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize demo data on app start
    const initDemo = async () => {
      try {
        await axios.get(`${API}/init-demo`);
      } catch (error) {
        console.error("Error initializing demo data:", error);
      }
    };
    initDemo();
  }, []);

  const selectPortal = (portalType) => {
    navigate(`/${portalType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Demo Banner */}
      <div className="bg-yellow-400 text-yellow-900 text-center py-2 px-4 font-semibold">
        🚀 MODO DEMOSTRACIÓN - Explora todas las funcionalidades sin registrarte
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            AdminEdificios <span className="text-indigo-600">Pro</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plataforma integral para la gestión moderna de edificios residenciales. 
            Administra pagos, reservas, votaciones y mantenimiento desde un solo lugar.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Resident Portal */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Portal Residente</h3>
              <p className="text-gray-600 mb-6 text-center">
                Gestiona tus pagos, reserva áreas comunes, participa en votaciones y reporta incidencias.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Estado de pagos y cuotas
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Reservas de áreas comunes
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Votaciones activas
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Reporte de incidencias
                </li>
              </ul>
              <button
                onClick={() => selectPortal('residente')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Explorar como Residente
              </button>
            </div>
          </div>

          {/* Admin Portal */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Portal Administrador</h3>
              <p className="text-gray-600 mb-6 text-center">
                Administra residentes, programa mantenimiento, gestiona finanzas y crea votaciones.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Gestión de residentes
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Reportes financieros
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Programación de mantenimiento
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Creación de votaciones
                </li>
              </ul>
              <button
                onClick={() => selectPortal('administrador')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Explorar como Administrador
              </button>
            </div>
          </div>

          {/* Provider Portal */}
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Portal Proveedor</h3>
              <p className="text-gray-600 mb-6 text-center">
                Gestiona tus tareas asignadas, actualiza el estado de trabajos y mantén tu perfil actualizado.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Tareas asignadas
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Historial de trabajos
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Gestión de especialidades
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Perfil profesional
                </li>
              </ul>
              <button
                onClick={() => selectPortal('proveedor')}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Explorar como Proveedor
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm">
            Esta es una demostración completa de AdminEdificios Pro. 
            Todos los datos son simulados y las acciones no persisten.
          </p>
        </div>
      </div>
    </div>
  );
};

// Resident Portal Layout
const ResidentLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-green-500 text-white text-center py-2 px-4 font-medium">
        🏠 PORTAL RESIDENTE - MODO DEMO | Juan Pérez - Dpto. 301
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">AdminEdificios Pro</h1>
            </div>
            <div className="flex space-x-8">
              <button
                onClick={() => navigate('/residente')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/residente/reservas')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Reservas
              </button>
              <button
                onClick={() => navigate('/residente/finanzas')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Finanzas
              </button>
              <button
                onClick={() => navigate('/residente/votaciones')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Votaciones
              </button>
              <button
                onClick={() => navigate('/residente/incidencias')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Reportes
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-100 text-gray-700 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-200"
              >
                Cambiar Portal
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

// Resident Dashboard
const ResidentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${API}/resident/dashboard`);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="text-center text-red-600">Error cargando el dashboard</div>;
  }

  const { resident, payments_summary, upcoming_reservations, active_votings, recent_incidents } = dashboardData;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenido, {resident.first_name} {resident.last_name}
        </h2>
        <p className="text-gray-600">Departamento {resident.unit_number} - Torre Moderna Demo</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Pagos Pendientes</p>
              <p className="text-2xl font-bold text-red-600">{payments_summary.pending_count}</p>
              <p className="text-xs text-gray-500">S/ {payments_summary.pending_total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Pagos Vencidos</p>
              <p className="text-2xl font-bold text-yellow-600">{payments_summary.overdue_count}</p>
              <p className="text-xs text-gray-500">S/ {payments_summary.overdue_total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Próximas Reservas</p>
              <p className="text-2xl font-bold text-blue-600">{upcoming_reservations.length}</p>
              <p className="text-xs text-gray-500">Confirmadas</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Votaciones Activas</p>
              <p className="text-2xl font-bold text-green-600">{active_votings.length}</p>
              <p className="text-xs text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Reservations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Reservas</h3>
          {upcoming_reservations.length > 0 ? (
            <div className="space-y-4">
              {upcoming_reservations.map((reservation, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-gray-900">Área Común - {reservation.date}</p>
                  <p className="text-sm text-gray-600">
                    {reservation.start_time} - {reservation.end_time}
                  </p>
                  <p className="text-sm text-gray-500">Costo: S/ {reservation.total_cost}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tienes reservas próximas</p>
          )}
        </div>

        {/* Active Votings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Votaciones Activas</h3>
          {active_votings.length > 0 ? (
            <div className="space-y-4">
              {active_votings.map((voting, index) => (
                <div key={index} className="border rounded-lg p-4 border-green-200 bg-green-50">
                  <h4 className="font-medium text-gray-900 mb-2">{voting.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{voting.description}</p>
                  <p className="text-xs text-gray-500">
                    Vence: {voting.end_date}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay votaciones activas</p>
          )}
        </div>

        {/* Recent Incidents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mis Reportes Recientes</h3>
          {recent_incidents.length > 0 ? (
            <div className="space-y-4">
              {recent_incidents.map((incident, index) => (
                <div key={index} className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-gray-900">{incident.title}</p>
                  <p className="text-sm text-gray-600">{incident.category}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    incident.status === 'ABIERTA' ? 'bg-red-100 text-red-800' :
                    incident.status === 'EN_PROCESO' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {incident.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No has reportado incidencias</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Reservations Component
const ResidentReservations = () => {
  const [commonAreas, setCommonAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommonAreas = async () => {
      try {
        const response = await axios.get(`${API}/common-areas`);
        setCommonAreas(response.data);
      } catch (error) {
        console.error("Error fetching common areas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommonAreas();
  }, []);

  const handleReservation = async () => {
    if (!selectedArea || !selectedDate || !selectedTime) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const startTime = selectedTime;
      const endTime = String(parseInt(selectedTime.split(':')[0]) + duration).padStart(2, '0') + ':' + selectedTime.split(':')[1];
      const totalCost = selectedArea.price_per_hour * duration;

      await axios.post(`${API}/reservations`, {
        common_area_id: selectedArea.id,
        date: selectedDate,
        start_time: startTime,
        end_time: endTime,
        total_cost: totalCost
      });

      alert('¡Reserva creada exitosamente!');
      // Reset form
      setSelectedArea(null);
      setSelectedDate('');
      setSelectedTime('');
      setDuration(1);
    } catch (error) {
      console.error("Error creating reservation:", error);
      alert('Error al crear la reserva');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reservas de Áreas Comunes</h2>
        <p className="text-gray-600">Reserva gimnasio, piscina, salón social y más</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Areas List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Áreas Disponibles</h3>
          <div className="space-y-4">
            {commonAreas.map((area) => (
              <div
                key={area.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedArea?.id === area.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedArea(area)}
              >
                <h4 className="font-medium text-gray-900">{area.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{area.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Capacidad: {area.capacity} personas</span>
                  <span className="text-green-600 font-medium">S/ {area.price_per_hour}/hora</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Horario: {area.opening_time} - {area.closing_time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Reservation Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Reserva</h3>
          
          {selectedArea && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">{selectedArea.name}</h4>
              <p className="text-sm text-blue-700">S/ {selectedArea.price_per_hour}/hora</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora de inicio</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar hora</option>
                {Array.from({ length: 15 }, (_, i) => {
                  const hour = 7 + i;
                  const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                  return (
                    <option key={timeStr} value={timeStr}>
                      {timeStr}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración (horas)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6].map(hours => (
                  <option key={hours} value={hours}>{hours} hora{hours > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {selectedArea && selectedDate && selectedTime && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Costo total: S/ {(selectedArea.price_per_hour * duration).toFixed(2)}</strong>
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {duration} hora{duration > 1 ? 's' : ''} × S/ {selectedArea.price_per_hour}
                </p>
              </div>
            )}

            <button
              onClick={handleReservation}
              disabled={!selectedArea || !selectedDate || !selectedTime}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Confirmar Reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Finances Component
const ResidentFinances = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${API}/payments`);
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAGADO': return 'bg-green-100 text-green-800';
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'VENCIDO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Estado Financiero</h2>
        <p className="text-gray-600">Historial de pagos y cuotas del departamento</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Pagos</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concepto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Pago
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.concept?.name || 'Concepto desconocido'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.concept?.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    S/ {payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.due_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.paid_date || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Voting Component
const ResidentVoting = () => {
  const [votings, setVotings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVotings = async () => {
      try {
        const response = await axios.get(`${API}/votings`);
        setVotings(response.data);
      } catch (error) {
        console.error("Error fetching votings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVotings();
  }, []);

  const handleVote = async (votingId, option) => {
    try {
      await axios.post(`${API}/vote`, {
        voting_id: votingId,
        option: option
      });
      alert('¡Voto registrado exitosamente!');
      // Refresh votings
      const response = await axios.get(`${API}/votings`);
      setVotings(response.data);
    } catch (error) {
      if (error.response?.status === 400) {
        alert(error.response.data.detail);
      } else {
        alert('Error al registrar el voto');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Votaciones Activas</h2>
        <p className="text-gray-600">Participa en las decisiones importantes del edificio</p>
      </div>

      {votings.length > 0 ? (
        <div className="space-y-6">
          {votings.map((voting) => (
            <div key={voting.id} className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{voting.title}</h3>
                <p className="text-gray-600 mb-4">{voting.description}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>Inicio: {voting.start_date}</span>
                  <span>Vence: {voting.end_date}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {voting.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Opciones de voto:</h4>
                <div className="space-y-2">
                  {voting.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleVote(voting.id, option)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500">No hay votaciones activas en este momento</p>
        </div>
      )}
    </div>
  );
};

// Incidents Component
const ResidentIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'MEDIA'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await axios.get(`${API}/incidents`);
        setIncidents(response.data);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/incidents`, newIncident);
      alert('¡Incidencia reportada exitosamente!');
      setShowForm(false);
      setNewIncident({ title: '', description: '', category: '', priority: 'MEDIA' });
      // Refresh incidents
      const response = await axios.get(`${API}/incidents`);
      setIncidents(response.data);
    } catch (error) {
      console.error("Error creating incident:", error);
      alert('Error al reportar la incidencia');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ABIERTA': return 'bg-red-100 text-red-800';
      case 'EN_PROCESO': return 'bg-yellow-100 text-yellow-800';
      case 'RESUELTA': return 'bg-green-100 text-green-800';
      case 'CERRADA': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENTE': return 'bg-red-500 text-white';
      case 'ALTA': return 'bg-orange-500 text-white';
      case 'MEDIA': return 'bg-yellow-500 text-white';
      case 'BAJA': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reportes de Incidencias</h2>
          <p className="text-gray-600">Reporta problemas y da seguimiento a tus solicitudes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nueva Incidencia
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportar Nueva Incidencia</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                value={newIncident.title}
                onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={newIncident.category}
                onChange={(e) => setNewIncident({ ...newIncident, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar categoría</option>
                <option value="Plomería">Plomería</option>
                <option value="Electricidad">Electricidad</option>
                <option value="Limpieza">Limpieza</option>
                <option value="Mantenimiento General">Mantenimiento General</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
              <select
                value={newIncident.priority}
                onChange={(e) => setNewIncident({ ...newIncident, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={newIncident.description}
                onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Reportar Incidencia
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Mis Incidencias</h3>
        </div>
        
        {incidents.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {incidents.map((incident, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{incident.title}</h4>
                    <p className="text-gray-600 mb-3">{incident.description}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">Categoría: {incident.category}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(incident.priority)}`}>
                        {incident.priority}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                        {incident.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(incident.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">No has reportado ninguna incidencia</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple placeholder components for other portals
const AdminPortal = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="bg-blue-500 text-white text-center py-2 px-4 font-medium mb-8">
        👨‍💼 PORTAL ADMINISTRADOR - MODO DEMO | María García - Administradora
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Portal Administrador</h1>
      <p className="text-gray-600 mb-8">Próximamente disponible...</p>
      <button 
        onClick={() => window.location.href = '/'}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Volver al Inicio
      </button>
    </div>
  </div>
);

const ProviderPortal = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="bg-orange-500 text-white text-center py-2 px-4 font-medium mb-8">
        🔧 PORTAL PROVEEDOR - MODO DEMO | Carlos Ramos - Plomería
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Portal Proveedor</h1>
      <p className="text-gray-600 mb-8">Próximamente disponible...</p>
      <button 
        onClick={() => window.location.href = '/'}
        className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
      >
        Volver al Inicio
      </button>
    </div>
  </div>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PortalSelection />} />
          <Route path="/residente" element={
            <ResidentLayout>
              <ResidentDashboard />
            </ResidentLayout>
          } />
          <Route path="/residente/reservas" element={
            <ResidentLayout>
              <ResidentReservations />
            </ResidentLayout>
          } />
          <Route path="/residente/finanzas" element={
            <ResidentLayout>
              <ResidentFinances />
            </ResidentLayout>
          } />
          <Route path="/residente/votaciones" element={
            <ResidentLayout>
              <ResidentVoting />
            </ResidentLayout>
          } />
          <Route path="/residente/incidencias" element={
            <ResidentLayout>
              <ResidentIncidents />
            </ResidentLayout>
          } />
          <Route path="/administrador" element={<AdminPortal />} />
          <Route path="/proveedor" element={<ProviderPortal />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
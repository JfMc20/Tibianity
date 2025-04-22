import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, subDays, startOfDay, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ADMIN_API, isAdminEmail } from '../config/constants';
// Importar la API simulada (solo para desarrollo)
import { mockAPI } from '../api/mockData.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

// Determinar si usar la API real o simulada
// Cambia esto a false para usar el backend real
const USE_MOCK_API = false; // true para datos simulados, false para backend real

const AdminDashboard = () => {
  // Estados
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState('all');
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    sessionsToday: 0,
    sessionsLast7Days: 0,
    totalSessions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Obtener datos de autenticación y navegación
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Verificar si el usuario tiene permisos de administrador usando la función centralizada
  const isAdmin = user?.isAdmin || (user?.email && isAdminEmail(user.email));
  
  // Redirigir si no es administrador
  useEffect(() => {
    if (!loading && !isAdmin && isAuthenticated) {
      navigate('/');
    }
  }, [isAdmin, isAuthenticated, navigate, loading]);

  // Función para cargar los datos de usuarios
  const loadUsers = async () => {
    try {
      let userData;
      if (USE_MOCK_API) {
        userData = await mockAPI.getUsers();
      } else {
        const response = await axios.get(ADMIN_API.USERS);
        userData = response.data;
      }
      setUsers(userData);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error('Error al cargar usuarios:', err);
    }
  };

  // Función para cargar los datos de sesiones
  const loadSessions = async () => {
    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      let sessionData;
      if (USE_MOCK_API) {
        sessionData = await mockAPI.getSessions(formattedStartDate, formattedEndDate);
      } else {
        const response = await axios.get(ADMIN_API.SESSIONS, {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            userId: selectedUser !== 'all' ? selectedUser : undefined
          }
        });
        sessionData = response.data;
      }
      
      setSessions(sessionData);
      setFilteredSessions(sessionData);
    } catch (err) {
      setError('Error al cargar las sesiones');
      console.error('Error al cargar sesiones:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      await loadUsers();
      await loadSessions();
    };
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualizar datos cuando cambian los filtros
  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  // Filtrar sesiones por usuario
  useEffect(() => {
    if (selectedUser === 'all') {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(sessions.filter(session => session.userId === selectedUser));
    }
  }, [sessions, selectedUser]);

  // Calcular métricas
  useEffect(() => {
    const today = startOfDay(new Date());
    const last7Days = subDays(today, 6);

    const sessionsToday = sessions.filter(session => {
      const sessionDate = parseISO(session.startTime);
      return isValid(sessionDate) && sessionDate >= today;
    }).length;

    const sessionsLast7Days = sessions.filter(session => {
      const sessionDate = parseISO(session.startTime);
      return isValid(sessionDate) && sessionDate >= last7Days;
    }).length;

    setMetrics({
      totalUsers: users.length,
      sessionsToday,
      sessionsLast7Days,
      totalSessions: sessions.length,
    });
  }, [sessions, users]);

  // Preparar datos para los gráficos
  const prepareChartData = () => {
    const sessionsByDate = {};
    
    filteredSessions.forEach(session => {
      const date = format(parseISO(session.startTime), 'yyyy-MM-dd');
      sessionsByDate[date] = (sessionsByDate[date] || 0) + 1;
    });
    
    return sessionsByDate;
  };

  // Configuración del gráfico de barras
  const chartData = (() => {
    const sessionsByDate = prepareChartData();
    const dates = Object.keys(sessionsByDate).sort();
    
    return {
      labels: dates,
      datasets: [
        {
          label: 'Sesiones por fecha',
          data: dates.map(date => sessionsByDate[date]),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  })();

  // Configuración del gráfico de líneas
  const lineChartData = (() => {
    const sessionsByDate = prepareChartData();
    const dates = Object.keys(sessionsByDate).sort();
    
    return {
      labels: dates,
      datasets: [
        {
          label: 'Tendencia de sesiones',
          data: dates.map(date => sessionsByDate[date]),
          fill: false,
          borderColor: 'rgb(53, 162, 235)',
          tension: 0.1,
        },
      ],
    };
  })();

  // Manejadores de eventos
  const handleStartDateChange = (date) => {
    if (date) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      setEndDate(date);
    }
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mx-auto max-w-7xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Administrativo</h1>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
          <h2 className="text-sm text-gray-500 uppercase">Total Usuarios</h2>
          <p className="text-3xl font-bold text-gray-900">{metrics.totalUsers}</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-green-500">
          <h2 className="text-sm text-gray-500 uppercase">Sesiones Hoy</h2>
          <p className="text-3xl font-bold text-gray-900">{metrics.sessionsToday}</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-yellow-500">
          <h2 className="text-sm text-gray-500 uppercase">Últimos 7 días</h2>
          <p className="text-3xl font-bold text-gray-900">{metrics.sessionsLast7Days}</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-purple-500">
          <h2 className="text-sm text-gray-500 uppercase">Sesiones Totales</h2>
          <p className="text-3xl font-bold text-gray-900">{metrics.totalSessions}</p>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm text-gray-600 mb-1">Fecha inicio</label>
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="p-2 border border-gray-300 rounded"
              dateFormat="dd/MM/yyyy"
              locale={es}
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm text-gray-600 mb-1">Fecha fin</label>
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="p-2 border border-gray-300 rounded"
              dateFormat="dd/MM/yyyy"
              locale={es}
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="userFilter" className="text-sm text-gray-600 mb-1">Usuario</label>
            <select
              id="userFilter"
              value={selectedUser}
              onChange={handleUserChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="all">Todos los usuarios</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Sesiones por Fecha</h2>
          <div className="h-64">
            <Bar 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Número de sesiones por fecha',
                  },
                },
              }}
            />
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Tendencia de Sesiones</h2>
          <div className="h-64">
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Tendencia de sesiones por fecha',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Tabla de usuarios */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Usuarios Registrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sesiones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => {
                const userSessions = sessions.filter(session => session.userId === user._id);
                return (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(parseISO(user.createdAt), 'dd/MM/yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{userSessions.length}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, subDays, startOfDay, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ADMIN_API } from '../config/constants';
import SidePanelMenu from '../components/Admin/SidePanelMenu';

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

// Configurar instancia de Axios para enviar credenciales (cookies)
const apiClient = axios.create({
  // La baseURL ya viene de ADMIN_API.USERS etc.
  withCredentials: true // Asegura que las cookies se envíen con cada solicitud
});

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
  const [actionLoading, setActionLoading] = useState(null); // Para mostrar carga en botón específico
  const [actionError, setActionError] = useState(null); // Para errores de acción
  const [actionSuccess, setActionSuccess] = useState(null); // Para mensajes de éxito
  
  // Obtener datos de autenticación y navegación
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Calcular isAdmin basado en currentUser.isAdmin obtenido del contexto
  const isAdmin = currentUser?.isAdmin === true;
  
  // Redirigir si no es administrador
  useEffect(() => {
    // Esperar a que termine la carga de autenticación antes de redirigir
    if (!authLoading && !isAdmin && isAuthenticated) {
      console.log("Redirigiendo por no ser admin..."); // Log de depuración
      navigate('/');
    }
  }, [isAdmin, isAuthenticated, navigate, authLoading]);

  // Función para cargar los datos de usuarios
  const loadUsers = useCallback(async () => {
    try {
      setActionError(null); // Limpiar errores anteriores
      setActionSuccess(null);
      setLoading(true); // Usar loading general para carga inicial
      let userData;
      if (USE_MOCK_API) {
        // userData = await mockAPI.getUsers(); // Comentado por ahora
        userData = []; // Evitar error si mockAPI no está definida
      } else {
        // Usar apiClient configurado
        const response = await apiClient.get(ADMIN_API.USERS);
        userData = response.data;
      }
      // Asegurarse que cada usuario tenga la propiedad isAdmin (puede ser false si no viene del backend)
      setUsers(userData.map(u => ({ ...u, isAdmin: u.isAdmin || false })));
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error('Error al cargar usuarios:', err);
    } finally {
       setLoading(false); // Termina loading general
    }
  }, []);

  // Función para cargar los datos de sesiones
  const loadSessions = useCallback(async () => {
    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      let sessionData;
      if (USE_MOCK_API) {
        // sessionData = await mockAPI.getSessions(formattedStartDate, formattedEndDate);
        sessionData = [];
      } else {
        // Usar apiClient si es necesario para sesiones también
        const response = await apiClient.get(ADMIN_API.SESSIONS, {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            userId: selectedUser !== 'all' ? selectedUser : undefined
          }
        });
        sessionData = response.data;
      }
      
      setSessions(sessionData);
      setFilteredSessions(sessionData); // Inicialmente mostrar todas las sesiones cargadas
    } catch (err) { 
      // Solo establecer error si no es un error de cancelación de Axios
      if (!axios.isCancel(err)) {
        setError('Error al cargar las sesiones');
        console.error('Error al cargar sesiones:', err);
      }
    }
     // No establecer setLoading(false) aquí si loadUsers ya lo hace
  }, [startDate, endDate, selectedUser]);

  // Cargar datos iniciales
  useEffect(() => {
    loadUsers();
    // loadSessions se llama en el useEffect de abajo cuando cambian las fechas
  }, [loadUsers]); // Usar las funciones memoizadas

  // Actualizar sesiones cuando cambian las fechas o el usuario seleccionado
  useEffect(() => {
    loadSessions();
  }, [loadSessions]); // loadSessions ya tiene sus dependencias

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
      // Añadir validación antes de parsear
      return session.startTime && isValid(parseISO(session.startTime)) && parseISO(session.startTime) >= today;
    }).length;

    const sessionsLast7Days = sessions.filter(session => {
      // Añadir validación antes de parsear
      return session.startTime && isValid(parseISO(session.startTime)) && parseISO(session.startTime) >= last7Days;
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
      // Añadir validación antes de parsear
      if (session.startTime && isValid(parseISO(session.startTime))) {
        const date = format(parseISO(session.startTime), 'yyyy-MM-dd');
        sessionsByDate[date] = (sessionsByDate[date] || 0) + 1;
      }
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

  // --- NUEVA FUNCION: Manejar promoción de usuario ---
  const handlePromoteUser = async (userIdToPromote) => {
    // userIdToPromote aquí es el googleId (que mapeamos a _id en el estado users)
    if (!userIdToPromote) return;

    // Confirmación (recomendado)
    if (!window.confirm('¿Estás seguro de que quieres promover este usuario a administrador? Esta acción no se puede deshacer fácilmente.')) {
      return;
    }

    setActionLoading(userIdToPromote); // Indicar carga para este usuario específico
    setActionError(null);
    setActionSuccess(null);

    try {
      // Llamar a la nueva API usando apiClient
      const response = await apiClient.patch(`${ADMIN_API.USERS}/${userIdToPromote}/promote`);

      if (response.data && response.data.success) {
        // Actualizar el estado local 'users' para reflejar el cambio
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u._id === userIdToPromote ? { ...u, isAdmin: true } : u
          )
        );
        setActionSuccess(`Usuario ${response.data.user?.name || ''} promovido exitosamente.`);
        console.log('Usuario promovido:', response.data.user);
      } else {
        throw new Error(response.data?.message || 'No se pudo promover al usuario.');
      }
    } catch (err) {
      console.error('Error al promover usuario:', err);
      const message = err.response?.data?.message || err.message || 'Error desconocido al promover usuario.';
      setActionError(`Error al promover (${userIdToPromote}): ${message}`);
    } finally {
      setActionLoading(null); // Terminar carga para este usuario
    }
  };

  // --- NUEVA FUNCION: Manejar degradación de usuario ---
  const handleDemoteUser = async (userIdToDemote) => {
    if (!userIdToDemote) return;

    // Confirmación MUY importante
    if (!window.confirm('¡ADVERTENCIA! ¿Estás seguro de que quieres quitar los privilegios de administrador a este usuario?')) {
      return;
    }

    setActionLoading(userIdToDemote); // Usamos el mismo estado de carga, pero para la acción de degradar
    setActionError(null);
    setActionSuccess(null);

    try {
      // Llamar a la nueva API (¡AÚN NO IMPLEMENTADA EN BACKEND!)
      const response = await apiClient.patch(`${ADMIN_API.USERS}/${userIdToDemote}/demote`);

      if (response.data && response.data.success) {
        // Actualizar el estado local 'users' para reflejar el cambio
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u._id === userIdToDemote ? { ...u, isAdmin: false } : u
          )
        );
        setActionSuccess(`Usuario ${response.data.user?.name || ''} degradado exitosamente a usuario normal.`);
        console.log('Usuario degradado:', response.data.user);
      } else {
        throw new Error(response.data?.message || 'No se pudo degradar al usuario.');
      }
    } catch (err) {
      console.error('Error al degradar usuario:', err);
      const message = err.response?.data?.message || err.message || 'Error desconocido al degradar usuario.';
      setActionError(`Error al degradar (${userIdToDemote}): ${message}`);
    } finally {
      setActionLoading(null); // Terminar carga para este usuario
    }
  };

  if (authLoading || loading) {
    // Mantener el spinner de carga con fondo oscuro implícito por el contenedor padre
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Cargando datos...</p> {/* Texto más claro */}
        </div>
      </div>
    );
  }

  if (error) {
    // Ajustar mensaje de error al tema oscuro
    return (
      <div className="p-4 mx-auto max-w-7xl">
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    // Contenedor principal con flex para side panel y contenido
    <div className="flex h-screen bg-[#060919] text-gray-200">
      <SidePanelMenu />

      {/* Contenedor del contenido principal con padding izquierdo y SUPERIOR */}
      <main className="flex-1 overflow-y-auto p-6 pl-72 pt-16"> {/* Añadido pt-16 */}
        <h1 className="text-3xl font-bold text-white mb-6">Dashboard Principal</h1>
        
        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111118] border border-[#2e2e3a] rounded-lg p-4 border-l-4 border-blue-500">
          <h2 className="text-sm text-gray-400 uppercase">Total Usuarios</h2>
          <p className="text-3xl font-bold text-white">{metrics.totalUsers}</p>
        </div>
        
        <div className="bg-[#111118] border border-[#2e2e3a] rounded-lg p-4 border-l-4 border-green-500">
          <h2 className="text-sm text-gray-400 uppercase">Sesiones Hoy</h2>
          <p className="text-3xl font-bold text-white">{metrics.sessionsToday}</p>
        </div>
        
        <div className="bg-[#111118] border border-[#2e2e3a] rounded-lg p-4 border-l-4 border-yellow-500">
          <h2 className="text-sm text-gray-400 uppercase">Últimos 7 días</h2>
          <p className="text-3xl font-bold text-white">{metrics.sessionsLast7Days}</p>
        </div>
        
        <div className="bg-[#111118] border border-[#2e2e3a] rounded-lg p-4 border-l-4 border-purple-500">
          <h2 className="text-sm text-gray-400 uppercase">Sesiones Totales</h2>
          <p className="text-3xl font-bold text-white">{metrics.totalSessions}</p>
        </div>
      </div>
        
        {/* Filtros */}
        <div className="bg-[#111118] border border-[#2e2e3a] rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Filtros</h2>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm text-gray-400 mb-1">Fecha inicio</label>
            {/* TODO: Estilizar DatePicker para tema oscuro si es necesario */}
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="p-2 border border-[#2e2e3a] rounded bg-[#1e2232] text-white focus:border-blue-500 focus:ring-blue-500"
              dateFormat="dd/MM/yyyy"
              locale={es}
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm text-gray-400 mb-1">Fecha fin</label>
             {/* TODO: Estilizar DatePicker para tema oscuro si es necesario */}
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="p-2 border border-[#2e2e3a] rounded bg-[#1e2232] text-white focus:border-blue-500 focus:ring-blue-500"
              dateFormat="dd/MM/yyyy"
              locale={es}
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="userFilter" className="text-sm text-gray-400 mb-1">Usuario</label>
            <select
              id="userFilter"
              value={selectedUser}
              onChange={handleUserChange}
              className="p-2 border border-[#2e2e3a] rounded bg-[#1e2232] text-white focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all" className="bg-[#1e2232] text-white">Todos los usuarios</option>
              {users.map(user => (
                <option key={user._id} value={user._id} className="bg-[#1e2232] text-white">
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
        
        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#111118] border border-[#2e2e3a] rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-white">Sesiones por Fecha</h2>
          <div className="h-64">
            {/* TODO: Ajustar colores de Chart.js para tema oscuro */}
            <Bar 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: { color: '#cbd5e1' } // Color leyenda
                  },
                  title: {
                    display: true,
                    text: 'Número de sesiones por fecha',
                    color: '#e2e8f0' // Color título
                  },
                },
                scales: {
                  x: {
                    ticks: { color: '#94a3b8' }, // Color ticks eje X
                    grid: { color: '#374151' } // Color grid eje X
                  },
                  y: {
                    ticks: { color: '#94a3b8' }, // Color ticks eje Y
                    grid: { color: '#374151' } // Color grid eje Y
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="bg-[#111118] border border-[#2e2e3a] rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-white">Tendencia de Sesiones</h2>
          <div className="h-64">
             {/* TODO: Ajustar colores de Chart.js para tema oscuro */}
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                 plugins: {
                  legend: {
                    position: 'top',
                    labels: { color: '#cbd5e1' } // Color leyenda
                  },
                  title: {
                    display: true,
                    text: 'Tendencia de sesiones por fecha',
                    color: '#e2e8f0' // Color título
                  },
                },
                scales: {
                  x: {
                    ticks: { color: '#94a3b8' }, // Color ticks eje X
                    grid: { color: '#374151' } // Color grid eje X
                  },
                  y: {
                    ticks: { color: '#94a3b8' }, // Color ticks eje Y
                    grid: { color: '#374151' } // Color grid eje Y
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
        
        {/* Mensajes de éxito/error de acciones */}
        {actionSuccess && (
        <div className="mb-4 bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded relative" role="alert">
          {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="mb-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded relative" role="alert">
          {actionError}
        </div>
      )}

        {/* Tabla de usuarios */}
        <div className="bg-[#111118] border border-[#2e2e3a] rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4 text-white">Usuarios Registrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2e2e3a]">
            <thead className="bg-[#1e2232]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha Registro</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sesiones</th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#111118] divide-y divide-[#2e2e3a]">
              {users.map(listedUser => { 
                const isCurrentUser = currentUser?.id === listedUser._id;
                const isListedUserAdmin = listedUser.isAdmin === true;
                const userSessions = sessions.filter(session => session.userId === listedUser._id); // Mover cálculo de sesiones aquí si no se hizo antes

                return (
                  <tr key={listedUser._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{listedUser.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">{listedUser.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {listedUser.createdAt && isValid(parseISO(listedUser.createdAt)) ? format(parseISO(listedUser.createdAt), 'dd/MM/yyyy') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">{userSessions.length}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ 
                        isListedUserAdmin ? 'bg-green-900/50 text-green-300' : 'bg-gray-700/50 text-gray-300'
                      }`}> {/* Badges oscuros */}
                        {isListedUserAdmin ? 'Admin' : 'Usuario'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {/* Botones de acción (colores ya ajustados antes) */}
                      {isListedUserAdmin ? (
                        <button
                          onClick={() => handleDemoteUser(listedUser._id)}
                          disabled={isCurrentUser || actionLoading === listedUser._id}
                          className={`text-red-500 hover:text-red-400 disabled:text-gray-500 disabled:cursor-not-allowed ${
                            actionLoading === listedUser._id ? 'animate-pulse' : ''
                          }`}
                        >
                          {actionLoading === listedUser._id ? 'Degradando...' : (isCurrentUser ? '-' : 'Degradar a Usuario')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePromoteUser(listedUser._id)}
                          disabled={actionLoading === listedUser._id}
                          className={`text-indigo-400 hover:text-indigo-300 disabled:text-gray-500 disabled:cursor-not-allowed ${
                            actionLoading === listedUser._id ? 'animate-pulse' : ''
                          }`}
                        >
                          {actionLoading === listedUser._id ? 'Promoviendo...' : 'Promover a Admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 
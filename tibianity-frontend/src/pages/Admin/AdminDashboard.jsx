import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ADMIN_API } from '../../config/constants';
import MetricCard from '../../components/Admin/MetricCard';
import FilterControls from '../../components/Admin/FilterControls';
import SessionChart from '../../components/Admin/SessionChart';
import UserTable from '../../components/Admin/UserTable';
import { format, subDays, startOfDay, parseISO, isValid } from 'date-fns';

// Registrar ChartJS 
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

// Configurar instancia de Axios 
const apiClient = axios.create({ withCredentials: true });
const USE_MOCK_API = false;

const AdminDashboard = () => {
  // --- Estados --- 
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState('all');
  const [metrics, setMetrics] = useState({ totalUsers: 0, sessionsToday: 0, sessionsLast7Days: 0, totalSessions: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); 
  const [actionError, setActionError] = useState(null); 
  const [actionSuccess, setActionSuccess] = useState(null); 
  
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isAdmin = currentUser?.isAdmin === true;
  
  // --- Lógica de Carga --- 
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setActionError(null); 
    setActionSuccess(null);
    try {
      const usersPromise = apiClient.get(ADMIN_API.USERS);
      const sessionsPromise = apiClient.get(ADMIN_API.SESSIONS, {
        params: {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        }
      });
      const [usersResponse, sessionsResponse] = await Promise.all([usersPromise, sessionsPromise]);
      setUsers(usersResponse.data.map(u => ({ ...u, isAdmin: u.isAdmin || false })));
      setSessions(sessionsResponse.data);
    } catch (err) { 
      if (!axios.isCancel(err)) {
        setError('Error al cargar datos del dashboard');
        console.error('Error al cargar datos:', err);
      }
    } finally {
       setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Cálculos Derivados (Definir ANTES de usarlos) ---
  // Mover filteredSessions aquí
  const filteredSessions = useMemo(() => {
     if (selectedUser === 'all') return sessions;
     return sessions.filter(session => session.userId === selectedUser);
  }, [sessions, selectedUser]);

  // Calcular métricas (Ahora puede usar filteredSessions)
  useEffect(() => {
    const today = startOfDay(new Date());
    const last7Days = subDays(today, 6);
    const sessionsToday = sessions.filter(s => s.startTime && isValid(parseISO(s.startTime)) && parseISO(s.startTime) >= today).length;
    const sessionsLast7Days = sessions.filter(s => s.startTime && isValid(parseISO(s.startTime)) && parseISO(s.startTime) >= last7Days).length;
    setMetrics({ totalUsers: users.length, sessionsToday, sessionsLast7Days, totalSessions: filteredSessions.length }); 
  }, [sessions, users, filteredSessions]); // Dependencia correcta

  // Preparar Datos para Gráficos (Ahora puede usar filteredSessions)
   const chartData = useMemo(() => {
    const sessionsByDate = {};
    filteredSessions.forEach(session => { 
      if (session.startTime && isValid(parseISO(session.startTime))) {
        const date = format(parseISO(session.startTime), 'yyyy-MM-dd');
        sessionsByDate[date] = (sessionsByDate[date] || 0) + 1;
      }
    });
    const dates = Object.keys(sessionsByDate).sort();
    return {
      labels: dates,
      datasets: [{
        label: 'Sesiones',
        data: dates.map(date => sessionsByDate[date]),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
        tension: 0.1
      }],
    };
  }, [filteredSessions]);

  // --- Manejadores (Definir ANTES de usarlos en JSX) ---
  const handlePromoteUser = useCallback(async (userIdToPromote) => {
    if (!userIdToPromote || !window.confirm('Promover usuario a admin?')) return;
    setActionLoading(userIdToPromote); setActionError(null); setActionSuccess(null);
    try {
      const response = await apiClient.patch(`${ADMIN_API.USERS}/${userIdToPromote}/promote`);
      if (!response.data?.success) throw new Error(response.data?.message || 'Error');
      setUsers(prev => prev.map(u => u._id === userIdToPromote ? { ...u, isAdmin: true } : u));
      setActionSuccess(`Usuario ${response.data.user?.name || ''} promovido.`);
    } catch (err) {
      setActionError(`Error al promover: ${err.response?.data?.message || err.message}`);
    } finally { setActionLoading(null); }
  }, []);
  
  const handleDemoteUser = useCallback(async (userIdToDemote) => {
    if (!userIdToDemote || !window.confirm('Degradar admin a usuario?')) return;
    setActionLoading(userIdToDemote); setActionError(null); setActionSuccess(null);
    try {
      const response = await apiClient.patch(`${ADMIN_API.USERS}/${userIdToDemote}/demote`);
      if (!response.data?.success) throw new Error(response.data?.message || 'Error');
      setUsers(prev => prev.map(u => u._id === userIdToDemote ? { ...u, isAdmin: false } : u));
      setActionSuccess(`Usuario ${response.data.user?.name || ''} degradado.`);
    } catch (err) {
       setActionError(`Error al degradar: ${err.response?.data?.message || err.message}`);
    } finally { setActionLoading(null); }
  }, []);
  
  const handleStartDateChange = (date) => { if (date) { setStartDate(date); } };
  const handleEndDateChange = (date) => { if (date) { setEndDate(date); } };
  const handleUserChange = (event) => { setSelectedUser(event.target.value); };

  // --- Redirección --- 
  useEffect(() => {
    if (!authLoading && !isAdmin && isAuthenticated) {
      navigate('/'); 
    }
  }, [isAdmin, isAuthenticated, navigate, authLoading]);

  // --- Renderizado --- 
  if (authLoading || loading) {
    return <div className="text-center p-10 text-white">Cargando dashboard...</div>; 
  }
  if (error) {
    return <div className="p-4 bg-red-900/50 text-red-300 rounded">Error: {error}</div>;
  }

  return (
    <div className="space-y-6"> 
      <h1 className="text-3xl font-bold text-white">Dashboard Principal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> 
        <MetricCard title="Total Usuarios" value={metrics.totalUsers} color="border-blue-500" />
        <MetricCard title="Sesiones Hoy" value={metrics.sessionsToday} color="border-green-500" />
        <MetricCard title="Últimos 7 días" value={metrics.sessionsLast7Days} color="border-yellow-500" />
        <MetricCard title="Total Sesiones (Filtro)" value={metrics.totalSessions} color="border-purple-500" />
      </div>
      <FilterControls 
          startDate={startDate}
          endDate={endDate}
          users={users}
          selectedUser={selectedUser}
          onStartDateChange={handleStartDateChange} 
          onEndDateChange={handleEndDateChange}   
          onUserChange={handleUserChange}         
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> 
        <SessionChart 
          data={chartData} 
          type="bar" 
          title="Sesiones por Fecha" 
        />
        <SessionChart 
          data={chartData} 
          type="line" 
          title="Tendencia de Sesiones" 
        /> 
      </div>
      <UserTable 
          users={users}
          sessions={sessions} 
          currentUser={currentUser}
          handlePromote={handlePromoteUser} 
          handleDemote={handleDemoteUser}   
          actionLoading={actionLoading}
          actionError={actionError}
          actionSuccess={actionSuccess}
      />
    </div>
  );
};

export default AdminDashboard; 
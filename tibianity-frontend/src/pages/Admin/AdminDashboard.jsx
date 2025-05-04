import React, { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
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
import { Field, Label, Input, Button } from '@headlessui/react';
import ValidationAlert from '../../components/common/Alerts/ValidationAlert';

// Registrar ChartJS 
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

// Configurar instancia de Axios localmente para este componente
const apiClient = axios.create({
  withCredentials: true // Importante para rutas admin protegidas por sesión/cookie
});

const USE_MOCK_API = false;

const AdminDashboard = () => {
  // --- Estados --- 
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState('all');
  const [metrics, setMetrics] = useState({ totalUsers: 0, sessionsToday: 0, sessionsLast7Days: 0, totalSessions: 0, activeSessions: 0, pendingSubscribers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); 
  const [actionError, setActionError] = useState(null); 
  const [actionSuccess, setActionSuccess] = useState(null); 
  
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isAdmin = currentUser?.isAdmin === true;
  
  // Estados para la limpieza de suscriptores
  const [emailToDelete, setEmailToDelete] = useState('');
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState('');
  const [cleanupError, setCleanupError] = useState('');
  
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
      setUsers(usersResponse.data.map(u => ({ 
        ...u, 
        isAdmin: u.isAdmin || false, 
        canAccessPublicSite: u.canAccessPublicSite || false
      })));
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
    setMetrics({ totalUsers: users.length, sessionsToday, sessionsLast7Days, totalSessions: filteredSessions.length, activeSessions: sessions.length, pendingSubscribers: '?' }); 
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

  // --- NUEVOS HANDLERS ---
  const handleGrantAccess = useCallback(async (userIdToGrant) => {
    if (!userIdToGrant || !window.confirm('Permitir acceso público a este usuario?')) return;
    setActionLoading(userIdToGrant); setActionError(null); setActionSuccess(null);
    try {
      const response = await apiClient.patch(`${ADMIN_API.USERS}/${userIdToGrant}/grant-access`);
      if (!response.data?.success) throw new Error(response.data?.message || 'Error');
      setUsers(prev => prev.map(u => u._id === userIdToGrant ? { ...u, canAccessPublicSite: true } : u));
      setActionSuccess(`Acceso público permitido para ${response.data.user?.name || ''}.`);
    } catch (err) {
      setActionError(`Error al permitir acceso: ${err.response?.data?.message || err.message}`);
    } finally { setActionLoading(null); }
  }, []);

  const handleRevokeAccess = useCallback(async (userIdToRevoke) => {
    if (!userIdToRevoke || !window.confirm('Denegar acceso público a este usuario?')) return;
    setActionLoading(userIdToRevoke); setActionError(null); setActionSuccess(null);
    try {
      const response = await apiClient.patch(`${ADMIN_API.USERS}/${userIdToRevoke}/revoke-access`);
      if (!response.data?.success) throw new Error(response.data?.message || 'Error');
      setUsers(prev => prev.map(u => u._id === userIdToRevoke ? { ...u, canAccessPublicSite: false } : u));
      setActionSuccess(`Acceso público denegado para ${response.data.user?.name || ''}.`);
    } catch (err) {
      setActionError(`Error al denegar acceso: ${err.response?.data?.message || err.message}`);
    } finally { setActionLoading(null); }
  }, []);

  // --- Handlers para Limpieza de Suscriptores ---
  const handleDeletePending = useCallback(async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar TODOS los suscriptores pendientes de confirmación? Esta acción no se puede deshacer.')) return;
    
    setCleanupLoading(true);
    setCleanupMessage('');
    setCleanupError('');
    try {
      const response = await apiClient.delete(`${ADMIN_API.SUBSCRIBERS}/pending`);
      if (!response.data?.success) throw new Error(response.data?.message || 'Error desconocido');
      setCleanupMessage(response.data.message || 'Suscriptores pendientes eliminados.');
    } catch (err) {
      setCleanupError(`Error al limpiar pendientes: ${err.response?.data?.message || err.message}`);
    } finally {
      setCleanupLoading(false);
    }
  }, []);

  const handleDeleteByEmail = useCallback(async (e) => {
    e.preventDefault(); // Prevenir submit de formulario si se usa
    if (!emailToDelete || !window.confirm(`¿Estás seguro de que quieres eliminar al suscriptor con email ${emailToDelete}?`)) return;

    setCleanupLoading(true);
    setCleanupMessage('');
    setCleanupError('');
    try {
      const encodedEmail = encodeURIComponent(emailToDelete);
      const response = await apiClient.delete(`${ADMIN_API.SUBSCRIBERS}/email/${encodedEmail}`);
      if (!response.data?.success) throw new Error(response.data?.message || 'Error desconocido');
      setCleanupMessage(response.data.message || `Suscriptor ${emailToDelete} eliminado.`);
      setEmailToDelete(''); // Limpiar input
    } catch (err) {
      setCleanupError(`Error al eliminar ${emailToDelete}: ${err.response?.data?.message || err.message}`);
    } finally {
      setCleanupLoading(false);
    }
  }, [emailToDelete]); // Dependencia del email

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
    <div className="space-y-8 p-4 md:p-6">
      <h1 className="text-2xl font-semibold text-white">Panel de Administración</h1>
      
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
      <UserTable 
          users={users}
          sessions={sessions} 
          currentUser={currentUser}
          handlePromote={handlePromoteUser} 
          handleDemote={handleDemoteUser}   
          handleGrantAccess={handleGrantAccess}
          handleRevokeAccess={handleRevokeAccess}
          actionLoading={actionLoading}
          actionError={actionError}
          actionSuccess={actionSuccess}
      />

      {/* --- NUEVA SECCIÓN: Limpieza de Suscriptores --- */}
      <div className="bg-[#16161d] border border-[#2e2e3a] rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4">Limpieza de Suscriptores</h2>
        
        {/* Mensajes de feedback para limpieza */} 
        <div aria-live="polite" className="space-y-2 mb-4">
           {cleanupMessage && <ValidationAlert message={cleanupMessage} type="success" />} 
           {cleanupError && <ValidationAlert message={cleanupError} type="error" />} 
        </div>

        {/* Acción: Limpiar Pendientes */} 
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/80">Eliminar todos los suscriptores que no han confirmado su correo.</p>
          <Button 
            onClick={handleDeletePending}
            disabled={cleanupLoading}
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cleanupLoading ? 'Limpiando...' : 'Limpiar Pendientes'}
          </Button>
        </div>

        <hr className="border-gray-600" />

        {/* Acción: Eliminar por Email */} 
        <form onSubmit={handleDeleteByEmail} className="space-y-3">
          <Field>
            <Label htmlFor="email-to-delete" className="block text-sm font-medium text-white/80">Eliminar suscriptor específico por email:</Label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <Input
                id="email-to-delete"
                type="email"
                value={emailToDelete}
                onChange={(e) => setEmailToDelete(e.target.value)}
                required
                disabled={cleanupLoading}
                placeholder="correo@ejemplo.com"
                className="relative block w-full appearance-none rounded-l-md border border-[#2e2e3a] bg-[#111118]/80 px-3 py-2 text-white placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              />
              <Button 
                type="submit"
                disabled={cleanupLoading || !emailToDelete}
                className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-600 bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                 {cleanupLoading ? 'Eliminando...' : 'Eliminar'} 
              </Button>
            </div>
          </Field>
        </form>
      </div>
      
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
    </div>
  );
};

export default AdminDashboard; 
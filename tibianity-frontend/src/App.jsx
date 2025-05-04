import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importar Layouts
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import GuestLayout from './layouts/GuestLayout';
// PublicLayout no se usa activamente ahora, pero está listo
// import PublicLayout from './layouts/PublicLayout'; 

// Importar Páginas
import AdminDashboard from './pages/Admin/AdminDashboard';
import EmailSenderPage from './pages/Admin/EmailSenderPage';
import UserProfilePage from './pages/UserProfilePage';
import ComingSoonPage from './pages/ComingSoonPage'; // Nombre correcto
import LandingPage from './pages/LandingPage'; // Nueva página real
import AuthCallbackHandler from './components/Auth/AuthCallbackHandler';
// Importar páginas públicas
import NewsPage from './pages/News'; // Asumiendo que News.jsx es la página
import MarketPage from './pages/Market'; // Asumiendo que Market.jsx es la página
import LorePage from './pages/LorePage';
import TeamPage from './pages/TeamPage';
import ChatPage from './pages/ChatPage';
import EventsPage from './pages/EventsPage'; // <-- Importar nueva página
// Importar páginas legales
import TermsOfService from './pages/legal/TermsOfService'; 
import PrivacyPolicy from './pages/legal/PrivacyPolicy'; 
import SubscriptionConfirmationPage from './pages/SubscriptionConfirmationPage'; // Importar la nueva página

// Componente de pantalla de carga simple
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen text-white">
    Cargando aplicación...
  </div>
);

// Placeholder para páginas no encontradas
const NotFoundPage = () => <div className="p-6 text-white text-center min-h-screen flex items-center justify-center bg-[#060919]">404 - Página no encontrada</div>;

/**
 * Contenido principal con la lógica de enrutamiento refactorizada.
 */
const AppContent = () => {
  const { loading, isAuthenticated, user } = useAuth();
  const isAdmin = user?.isAdmin === true;
  const canAccess = user?.canAccessPublicSite === true;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Ruta pública de autenticación */} 
      <Route path="/auth/success" element={<AuthCallbackHandler />} />

      {/* Rutas Legales Públicas - Usan GuestLayout por simplicidad */}
      <Route element={<GuestLayout />}> {/* Envuelve en un layout para consistencia */}
        <Route path="/terminos-de-servicio" element={<TermsOfService />} />
        <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
      </Route>

      {/* Rutas Condicionales por Rol */}
      {isAuthenticated ? (
        isAdmin ? (
          // --- ADMINISTRADOR --- 
          <> {/* Fragmento para agrupar rutas de admin */} 
            {/* Ruta para la raíz (/) - Muestra LandingPage con AdminLayout */}
            <Route path="/" element={<AdminLayout />}> 
              <Route index element={<LandingPage />} /> 
              {/* Permitir acceso al perfil desde la raíz también */}
              <Route path="profile" element={<UserProfilePage />} /> 

              {/* Rutas públicas existentes accesibles por admin */} 
              <Route path="news" element={<NewsPage />} /> 
              <Route path="market" element={<MarketPage />} /> 
              <Route path="lore" element={<LorePage />} /> 
              <Route path="team" element={<TeamPage />} /> 
              <Route path="chat" element={<ChatPage />} /> 
              <Route path="events" element={<EventsPage />} /> {/* <-- Nueva ruta */} 
            </Route>

            {/* Rutas específicas bajo /admin - También usan AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}> 
              {/* /admin y /admin/dashboard muestran el Dashboard */}
              <Route index element={<AdminDashboard />} /> 
              <Route path="dashboard" element={<AdminDashboard />} /> 
              <Route path="email" element={<EmailSenderPage />} /> 
              {/* /admin/profile muestra el perfil */}
              <Route path="profile" element={<UserProfilePage />} /> 
              {/* Catch-all para /admin/* desconocido */}
              <Route path="*" element={<NotFoundPage />} /> 
            </Route>

            {/* Catch-all global para admin si no coincide con / o /admin/* */}
            {/* Redirige a /admin */} 
            <Route path="*" element={<Navigate to="/admin" replace />} /> 
          </>
        ) : (
          // --- USUARIO NORMAL --- 
          // Definir el layout una sola vez
          <Route path="/" element={<UserLayout />}>
            {
              // Condición para determinar qué rutas hijas renderizar
              user && user.canAccessPublicSite ? (
                // *** USUARIO CON ACCESO PÚBLICO ***
                <>
                  <Route index element={<LandingPage />} /> 
                  <Route path="news" element={<NewsPage />} />
                  <Route path="market" element={<MarketPage />} />
                  <Route path="lore" element={<LorePage />} />
                  <Route path="team" element={<TeamPage />} />
                  <Route path="events" element={<EventsPage />} /> 
                  <Route path="chat" element={<ChatPage />} /> 
                  <Route path="profile" element={<UserProfilePage />} />
                  {/* Catch-all para esta sección */}
                  <Route path="*" element={<Navigate to="/" replace />} /> 
                </>
              ) : (
                // *** USUARIO NORMAL SIN ACCESO PÚBLICO ***
                <>
                  <Route index element={<ComingSoonPage />} /> 
                  <Route path="profile" element={<UserProfilePage />} /> 
                  {/* Catch-all para esta sección */}
                  <Route path="*" element={<Navigate to="/" replace />} /> 
                </>
              )
            }
          </Route>
        )
      ) : (
        // --- INVITADO --- 
        // Usa GuestLayout para todas sus rutas
        <Route path="/" element={<GuestLayout />}> 
          {/* Invitado siempre ve ComingSoon en la raíz */}
          <Route index element={<ComingSoonPage />} /> 
          {/* Cualquier otra ruta también muestra ComingSoon */}
          <Route path="*" element={<ComingSoonPage />} /> 
        </Route>
      )}

      {/* Rutas de Confirmación de Suscripción (Públicas) */}
      <Route path="/subscription-confirmed" element={<GuestLayout><SubscriptionConfirmationPage /></GuestLayout>} />
      <Route path="/subscription-invalid" element={<GuestLayout><SubscriptionConfirmationPage /></GuestLayout>} />
      <Route path="/subscription-error" element={<GuestLayout><SubscriptionConfirmationPage /></GuestLayout>} />

      {/* Rutas de Admin - Eliminar ProtectedRoute wrapper */}
      <Route 
        path="/admin/*" 
        element={
          // Quitar ProtectedRoute, la lógica ya está afuera
          // <ProtectedRoute isAuthenticated={isAuthenticated} isAdminRoute={true} userRole={isAdmin ? 'admin' : 'user'}>
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="email" element={<EmailSenderPage />} />
              <Route path="*" element={<NotFoundPage />} /> 
            </Routes>
          </AdminLayout>
          // </ProtectedRoute>
        }
      />

      {/* Rutas de Usuario Autenticado (Normal) - Eliminar ProtectedRoute wrapper */}
      <Route 
        path="/profile"
        element={
          // Quitar ProtectedRoute, la lógica ya está afuera
          // <ProtectedRoute isAuthenticated={isAuthenticated} userRole={isAdmin ? 'admin' : 'user'}>
            <UserLayout>
              <UserProfilePage />
            </UserLayout>
          // </ProtectedRoute>
        }
      />
      
      {/* Rutas Públicas (o restringidas según acceso) */}
      <Route 
        path="/news" 
        element={isAuthenticated && (isAdmin || canAccess) ? <UserLayout><NewsPage /></UserLayout> : <GuestLayout><ComingSoonPage /></GuestLayout>}
      />
      <Route 
        path="/market" 
        element={isAuthenticated && (isAdmin || canAccess) ? <UserLayout><MarketPage /></UserLayout> : <GuestLayout><ComingSoonPage /></GuestLayout>}
      />
       <Route 
        path="/lore" 
        element={isAuthenticated && (isAdmin || canAccess) ? <UserLayout><LorePage /></UserLayout> : <GuestLayout><ComingSoonPage /></GuestLayout>}
      />
       <Route 
        path="/team" 
        element={isAuthenticated && (isAdmin || canAccess) ? <UserLayout><TeamPage /></UserLayout> : <GuestLayout><ComingSoonPage /></GuestLayout>}
      />
      <Route 
        path="/events" 
        element={isAuthenticated && (isAdmin || canAccess) ? <UserLayout><EventsPage /></UserLayout> : <GuestLayout><ComingSoonPage /></GuestLayout>}
      />
     
      {/* Ruta Raíz (/) */}
      <Route 
        path="/" 
        element={
          isAuthenticated 
            ? isAdmin ? <AdminLayout><LandingPage /></AdminLayout> : <GuestLayout><ComingSoonPage /></GuestLayout> 
            : <GuestLayout><ComingSoonPage /></GuestLayout>
        }
      />
      
      {/* Ruta Catch-all para 404 (Usar NotFoundPage) */}
      <Route 
        path="*" 
        element={
           isAuthenticated 
            // Usar NotFoundPage también para admin aquí
            ? isAdmin ? <AdminLayout><NotFoundPage /></AdminLayout> : <GuestLayout><ComingSoonPage /></GuestLayout> 
            : <GuestLayout><ComingSoonPage /></GuestLayout>
        }
       />
    </Routes>
  );
};

/**
 * Componente Raíz de la Aplicación
 */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App; 
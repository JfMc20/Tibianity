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

// Componente de pantalla de carga simple
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#060919] text-white">
    Cargando aplicación...
  </div>
);

// Placeholder para páginas no encontradas
const NotFound = () => <div className="p-6 text-white text-center min-h-screen flex items-center justify-center bg-[#060919]">404 - Página no encontrada</div>;

/**
 * Contenido principal con la lógica de enrutamiento refactorizada.
 */
const AppContent = () => {
  const { loading, isAuthenticated, user } = useAuth();
  const isAdmin = user?.isAdmin === true;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Ruta pública de autenticación */} 
      <Route path="/auth/success" element={<AuthCallbackHandler />} />

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
              <Route path="*" element={<NotFound />} /> 
            </Route>

            {/* Catch-all global para admin si no coincide con / o /admin/* */}
            {/* Redirige a /admin */} 
            <Route path="*" element={<Navigate to="/admin" replace />} /> 
          </>
        ) : (
          // --- USUARIO NORMAL --- 
          // Usa UserLayout para todas sus rutas
          <Route path="/" element={<UserLayout />}> 
            {/* En la raíz (/), el usuario normal ve ComingSoon */}
            <Route index element={<ComingSoonPage />} /> 
            {/* La única otra ruta accesible es /profile */}
            <Route path="profile" element={<UserProfilePage />} /> 
            {/* Cualquier otra ruta redirige a la raíz (donde verá ComingSoon) */}
            <Route path="*" element={<Navigate to="/" replace />} /> 
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

      {/* Un 404 global final, por si acaso */}
       <Route path="*" element={<NotFound />} /> 
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
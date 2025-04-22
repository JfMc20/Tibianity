import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Lore from './components/Lore';
import Team from './components/Team';
import Footer from './components/Footer';

// Importar páginas
import News from './pages/News';
import Market from './pages/Market';
import LorePage from './pages/LorePage';
import TeamPage from './pages/TeamPage';
import AdminDashboard from './pages/AdminDashboard';
import ComingSoon from './components/ComingSoon/ComingSoon.jsx';
import { ADMIN_EMAIL } from './config/constants';

// Componente para verificar la conexión con el backend
const ConnectionStatus = () => {
  const { backendStatus, checkBackendStatus, error } = useAuth();
  
  useEffect(() => {
    // Verificar la conexión cada minuto
    const interval = setInterval(() => {
      if (!backendStatus.online) {
        checkBackendStatus();
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [backendStatus.online, checkBackendStatus]);
  
  if (!backendStatus.checked || backendStatus.online) {
    return null;
  }
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-1 px-4 z-50">
      <p className="text-sm">
        {error || 'No se pudo conectar al servidor. Verifica que el backend esté en ejecución.'}
        <button 
          onClick={checkBackendStatus}
          className="ml-2 underline"
        >
          Reintentar
        </button>
      </p>
    </div>
  );
};

/**
 * Main App component
 */
const AppContent = () => {
  const { user, isAuthenticated, loading, error } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Objeto User desde AuthContext:', JSON.stringify(user, null, 2));
      console.log('Comparando user.email con ADMIN_EMAIL:', user.email, '===', ADMIN_EMAIL);
    }
  }, [isAuthenticated, user]);
  
  // Acceder al email desde el array, usando optional chaining por seguridad
  const isAdmin = isAuthenticated && user && user.emails && user.emails[0]?.value === ADMIN_EMAIL;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Cargando...
      </div>
    );
  }

  return (
    <>
      {isAdmin ? (
        <div className="min-h-screen flex flex-col bg-[#060919]">
          <ConnectionStatus />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Ruta principal - Página de inicio */}
              <Route path="/" element={
                <>
                  {/* Hero Section */}
                  <Hero />
                  
                  {/* Services Section con margen negativo */}
                  <div className="-mt-4 md:-mt-8">
                    <Services />
                  </div>
                  
                  {/* Lore Section - Introducción al mundo */}
                  <Lore />
                  
                  {/* Team Section - Equipo y patrocinadores */}
                  <Team />
                </>
              } />
              
              {/* Rutas para cada sección */}
              <Route path="/news" element={<News />} />
              <Route path="/market" element={<Market />} />
              <Route path="/lore" element={<LorePage />} />
              <Route path="/team" element={<TeamPage />} />
              
              {/* Ruta para el dashboard administrativo */}
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      ) : (
        <ComingSoon isAuthenticated={isAuthenticated} error={error} />
      )}
    </>
  );
};

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
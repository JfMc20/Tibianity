import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Lore from './components/Lore';
import Team from './components/Team';
import Footer from './components/Footer';

// Import Pages
import News from './pages/News';
import Market from './pages/Market';
import LorePage from './pages/LorePage';
import TeamPage from './pages/TeamPage';
import AdminDashboard from './pages/AdminDashboard';
import ComingSoon from './components/ComingSoon/ComingSoon.jsx';
import ChatPage from './pages/ChatPage';
import EmailSenderPage from './pages/EmailSenderPage';

// Componnet to check backend status
const ConnectionStatus = () => {
  const { backendStatus, checkBackendStatus, error } = useAuth();
  
  useEffect(() => {
    // Check connection every minute
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
        {error || 'Could not connect to the server. Check if the backend is running.'}
        <button 
          onClick={checkBackendStatus}
          className="ml-2 underline"
        >
          Try again
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
  
  // Determine if it is admin based on the isAdmin field of the user object in the context
  const isAdmin = user?.isAdmin === true;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
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
              {/* First Route - Home Page */}
              <Route path="/" element={
                <>
                  {/* Hero Section */}
                  <Hero />
                  
                  {/* Services Section con margen negativo */}
                  <div className="-mt-4 md:-mt-8">
                    <Services />
                  </div>
                  
                  {/* Lore Section - Introduction to the world */}
                  <Lore />
                  
                  {/* Team Section - Team and sponsors */}
                  <Team />
                </>
              } />
              
              {/* Routes for each section */}
              <Route path="/news" element={<News />} />
              <Route path="/market" element={<Market />} />
              <Route path="/lore" element={<LorePage />} />
              <Route path="/team" element={<TeamPage />} />
              
              {/* Route for the admin dashboard */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/email" element={<EmailSenderPage />} />
              
              {/* Route for the Chat with LLM page */}
              <Route path="/chat" element={<ChatPage />} />
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
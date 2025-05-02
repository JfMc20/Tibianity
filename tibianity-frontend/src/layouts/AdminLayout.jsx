import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // No se usa aquí
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Iconos para toggle

import SidePanelMenu from '../components/Admin/SidePanelMenu';
import ConnectionStatus from '../components/ConnectionStatus';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Importar Páginas de Admin
// import AdminDashboard from '../pages/Admin/AdminDashboard'; // Asumiendo que moveremos AdminDashboard.jsx a pages/Admin
// import AdminEmailPage from '../pages/Admin/EmailSenderPage'; // Ruta corregida después de mover
// import UserProfilePage from '../pages/UserProfilePage';

// Importar Páginas/Componentes Comunes (si Admin necesita acceso a ellas)
// import News from '../pages/News';
// import ChatPage from '../pages/ChatPage';

// Placeholder para páginas no encontradas dentro del admin
// const AdminNotFound = () => <div className="p-6 text-white">404 - Sección de Admin no encontrada</div>;

const AdminLayout = () => {
  // Estado panel - ahora default a true, toggle funciona siempre
  const [isPanelOpen, setIsPanelOpen] = useState(() => {
    const savedState = localStorage.getItem('adminPanelOpen');
    return savedState !== null ? JSON.parse(savedState) : true; // Default a true ahora
  });

  // Guardar estado siempre
  useEffect(() => {
    localStorage.setItem('adminPanelOpen', JSON.stringify(isPanelOpen));
  }, [isPanelOpen]);

  // Toggle funciona en todas las resoluciones
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    // Quitar h-screen de aquí, añadir min-h-screen para asegurar que ocupe al menos la pantalla
    <div className="relative flex min-h-screen text-gray-200">
      {/* Backdrop para móvil */}
      {isPanelOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={togglePanel} // Cerrar al hacer clic fuera
          aria-hidden="true"
        ></div>
      )}

      {/* SidePanelMenu - Aumentar z-index */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out w-64 
                  ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}
                  // Quitar lg:translate-x-0 si queremos que el toggle lo controle siempre
                  // Lo dejamos por ahora, el toggle izq se oculta en movil
      >
         <SidePanelMenu /> 
      </div>

      {/* Contenedor Derecho - Asegurar que es flex-col y que puede crecer */}
      <div 
        className={`relative flex-1 flex flex-col transition-all duration-300 ease-in-out 
                  ${isPanelOpen ? 'lg:pl-64' : 'pl-0'}`}
                  // Añadir min-h-0 para evitar problemas de flexbox en algunos navegadores
                  // style={{ minHeight: '0' }} // O usar clase `min-h-0` si está en tu Tailwind
      >
        
        {/* Navbar Principal - Props siguen igual */}
        {/* El toggle izquierdo se manejará dentro de Navbar ahora */}
        <Navbar togglePanel={togglePanel} isPanelOpen={isPanelOpen} isAdminLayout={true} />

        {/* Área de contenido principal - Mantiene flex-1 y overflow-y-auto */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet /> 
        </main>
        
        {/* Footer y ConnectionStatus - Deberían quedar al final, fuera del área de scroll */}
        <Footer /> 
        <ConnectionStatus /> 
        
      </div>
    </div>
  );
};

export default AdminLayout; 
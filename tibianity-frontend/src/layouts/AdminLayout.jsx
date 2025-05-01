import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // No se usa aquí
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Iconos para toggle

import SidePanelMenu from '../components/Admin/SidePanelMenu';
import ConnectionStatus from '../components/ConnectionStatus';

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
  // Estado para controlar si el panel está abierto, lee de localStorage o default a true
  const [isPanelOpen, setIsPanelOpen] = useState(() => {
    const savedState = localStorage.getItem('adminPanelOpen');
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('adminPanelOpen', JSON.stringify(isPanelOpen));
  }, [isPanelOpen]);

  // Función para cambiar el estado
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="flex h-screen bg-[#060919] text-gray-200 overflow-hidden">
      {/* SidePanelMenu con clases condicionales para mostrar/ocultar */}
      <div className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'} w-64`}>
         <SidePanelMenu /> 
      </div>

      {/* Contenedor principal con padding izquierdo condicional */} 
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isPanelOpen ? 'pl-64' : 'pl-0'}`}>

        {/* Barra superior mínima para el botón de toggle */} 
        <div className="sticky top-0 z-20 bg-[#111118]/80 backdrop-blur-sm border-b border-[#2e2e3a] px-4 py-2 flex items-center">
            <button 
                onClick={togglePanel}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-label={isPanelOpen ? "Cerrar panel lateral" : "Abrir panel lateral"}
            >
               {isPanelOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
             {/* Aquí se podrían añadir otros elementos de cabecera si fuera necesario */} 
        </div>

        {/* Área de contenido principal */} 
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#060919] p-6"> 
          <Outlet /> 
        </main>
        
        {/* ConnectionStatus al final */} 
        <ConnectionStatus /> 
        
      </div>
    </div>
  );
};

export default AdminLayout; 
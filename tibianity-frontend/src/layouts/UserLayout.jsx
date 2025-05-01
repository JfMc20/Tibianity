import React from 'react';
// Quitar Routes, Route, Navigate. Añadir Outlet.
import { Outlet } from 'react-router-dom'; 
// Ya no se importan páginas específicas aquí
// import UserProfilePage from '../pages/UserProfilePage';
// import AuthCallbackHandler from '../components/Auth/AuthCallbackHandler';

// Importar Navbar y Footer si este layout debe tenerlos
import Navbar from '../components/Navbar'; // Asumiendo que los usuarios normales ven Navbar
import Footer from '../components/Footer'; // Asumiendo que los usuarios normales ven Footer

const UserLayout = () => {
  return (
    // Estructura típica con Navbar, contenido (Outlet) y Footer
    <div className="flex flex-col min-h-screen bg-[#060919]"> 
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8"> {/* Añadir padding y centrado si se desea */}
        {/* Aquí se renderizarán las rutas hijas de usuario (ej: /profile) */}
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout; 
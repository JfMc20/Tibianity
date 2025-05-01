import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * Layout para las páginas públicas principales (ej. Landing Page).
 * Incluye Navbar y Footer comunes.
 */
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#060919]">
      <Navbar />
      {/* El contenido principal se renderiza aquí */}
      <main className="flex-grow">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout; 
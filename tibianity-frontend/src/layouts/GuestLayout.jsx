import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GuestLayout = () => {
  // Quitar el estilo en línea del fondo
  // const layoutStyle = { ... };

  return (
    // Volver a la versión sin style
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout; 
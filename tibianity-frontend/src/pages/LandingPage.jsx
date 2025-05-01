import React from 'react';

// Importar los componentes de la Landing Page
import Hero from '../components/LandingPage/Hero';
import Lore from '../components/LandingPage/Lore';
import Services from '../components/LandingPage/Services';
import Team from '../components/LandingPage/Team';

// Página principal que ensambla las secciones de la landing
const LandingPage = () => {
  return (
    <div>
      {/* Renderizar las secciones en orden */}
      <Hero />
      <Services /> 
      <Lore />
      <Team />
      {/* Añadir más secciones aquí si es necesario */}
    </div>
  );
};

export default LandingPage; 
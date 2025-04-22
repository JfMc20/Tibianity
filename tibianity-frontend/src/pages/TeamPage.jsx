import React from 'react';
import Team from '../components/Team';

/**
 * Página TeamPage - Página del equipo de Tibianity
 */
const TeamPage = () => {
  return (
    <section className="py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-[#60c8ff] rounded-full filter blur-[150px] opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#bd4fff] rounded-full filter blur-[150px] opacity-10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white inline-block relative">
            Nuestro Team Completo
            <div className="absolute -bottom-2 left-0 h-[3px] w-1/2 bg-gradient-to-r from-[#60c8ff] to-transparent rounded-full"></div>
            <div className="absolute -bottom-2 right-0 h-[3px] w-1/2 bg-gradient-to-l from-[#bd4fff] to-transparent rounded-full"></div>
          </h2>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto">
            Conoce a todos los creadores de contenido que forman parte de Tibianity.
          </p>
        </div>
        
        {/* Componente Team existente */}
        <Team />
      </div>
    </section>
  );
};

export default TeamPage; 
import React from 'react';
// Quitar importación de AdminLayout, ya no se necesita aquí
// import AdminLayout from '../layouts/AdminLayout'; 

const EventsPage = () => {
  // Devolver directamente el contenido de la página, sin el layout
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-orbitron mb-6 text-white">Eventos</h1>
      
      {/* Contenido de la página de eventos */}
      <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg">
        <p className="text-neutral-300">
          ¡Próximamente encontrarás aquí información sobre los eventos especiales de Tibianity!
          Mantente atento a las actualizaciones.
        </p>
        {/* Aquí puedes añadir más contenido, como una lista de eventos pasados/futuros, etc. */}
      </div>

    </div>
    // Quitar cierre de AdminLayout
  );
};

export default EventsPage; 
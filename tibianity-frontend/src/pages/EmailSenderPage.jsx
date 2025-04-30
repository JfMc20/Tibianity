import React from 'react';
import SidePanelMenu from '../components/Admin/SidePanelMenu'; // Reutilizar el menú
import EmailSubscribers from '../components/Admin/EmailSubscribers'; // Importar el componente de envío

const EmailSenderPage = () => {
  return (
    <div className="flex h-screen bg-[#060919] text-gray-200">
      <SidePanelMenu />

      {/* Contenido principal con padding izquierdo y SUPERIOR */}
      <main className="flex-1 overflow-y-auto p-6 pl-72 pt-16">
        <h1 className="text-3xl font-bold text-white mb-6">Enviar Correos a Suscriptores</h1>

        {/* Aquí va el componente del formulario */}
        <EmailSubscribers />
        
        {/* Puedes añadir más contenido específico de esta página aquí si es necesario */}

      </main>
    </div>
  );
};

export default EmailSenderPage; 
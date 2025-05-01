import React from 'react';
// import SidePanelMenu from '../../components/Admin/SidePanelMenu'; // QUITAR: El Layout ya lo incluye
import EmailSubscribers from '../../components/Admin/EmailSubscribers'; // Importar el componente de envío

const EmailSenderPage = () => {
  return (
    // Quitar el div flex y SidePanelMenu de aquí
    // <div className="flex h-screen bg-[#060919] text-gray-200">
    //   <SidePanelMenu />
    //   <main className="flex-1 overflow-y-auto p-6 pl-72 pt-16">
    
    // Renderizar directamente el contenido de la página
    <div> 
      <h1 className="text-3xl font-bold text-white mb-6">Enviar Correos a Suscriptores</h1>
      <EmailSubscribers />
    </div>

    //   </main>
    // </div>
  );
};

export default EmailSenderPage; 
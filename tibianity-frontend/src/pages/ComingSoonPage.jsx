import React from 'react';
// Asegúrate de que la ruta al componente ComingSoon sea correcta
import ComingSoonComponent from '../components/ComingSoon/ComingSoon'; 
import WhatsAppFloatingButton from '../components/ComingSoon/WhatsAppFloatingButton'; // Importar el nuevo botón

const ComingSoonPage = () => {
  const whatsappNumber = "+58 412-0971841";

  return (
    <>
      <ComingSoonComponent isAuthenticated={false} />
      <WhatsAppFloatingButton phoneNumber={whatsappNumber} />
    </>
  );
};

export default ComingSoonPage; 
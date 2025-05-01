import React from 'react';
// Asegúrate de que la ruta al componente ComingSoon sea correcta
import ComingSoonComponent from '../components/ComingSoon/ComingSoon'; 

const ComingSoonPage = () => {
  // Puedes pasar props si el componente los necesita, como `isAuthenticated`
  // Aquí asumimos que para la página, si se muestra, es porque no está autenticado.
  return <ComingSoonComponent isAuthenticated={false} />;
};

export default ComingSoonPage; 
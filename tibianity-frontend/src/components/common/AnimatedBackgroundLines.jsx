import React from 'react';

/**
 * Componente para renderizar líneas de fondo animadas decorativas.
 * Asegúrate de que el contenedor padre tenga 'position: relative' y 'overflow: hidden'.
 * Requiere que los estilos CSS asociados (.animated-line, .line-*, @keyframes moveLine) 
 * estén definidos globalmente o importados.
 */
const AnimatedBackgroundLines = () => {
  return (
    <>
      {/* Elementos para las líneas animadas */}
      {/* Añadir 'hidden lg:block' o similar si se quieren ocultar en móvil */}
      <div className="animated-line line-1"></div> 
      <div className="animated-line line-2"></div>
      <div className="animated-line line-3"></div>
      {/* Puedes añadir más líneas si quieres, ajustando sus clases CSS */}
      {/* <div className="animated-line line-4 hidden md:block"></div> */}
      {/* <div className="animated-line line-5 hidden lg:block"></div> */}
    </>
  );
};

export default AnimatedBackgroundLines; 
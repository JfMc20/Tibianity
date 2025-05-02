import React from 'react'; // REMOVED useState, useEffect
import { useAuth } from '../../context/AuthContext'; // Solo necesitamos isAuthenticated y authError
// import { API_URL } from '../../config/constants'; // Probablemente ya no se necesite aquí
// import SocialIcon from '../common/SocialIcon'; // Ya no se usa
import SubscriptionForm from './SubscriptionForm'; // <-- Importar el nuevo componente
import AnimatedBackgroundLines from '../common/AnimatedBackgroundLines'; // <-- Importar el nuevo componente

const ComingSoon = () => {
  // Solo necesitamos isAuthenticated y authError del contexto
  const { isAuthenticated, error: authError } = useAuth(); 

  // Estados y lógica de suscripción movidos a SubscriptionForm

  return (
    // Main container - Asegurar que NO tenga bg-[#060919]
    <div className="relative flex items-center justify-center min-h-screen text-white p-4 overflow-hidden">
      {/* Renderizar las líneas animadas de fondo */}
      <AnimatedBackgroundLines />

      {/* Nuevo Contenedor Central (z-index: 5 para estar sobre líneas, debajo del grid si es pseudo) */}
      {/* Añadimos la clase 'content-grid-background' que definiremos en CSS */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-3xl text-center p-4 content-grid-background">
          
        {/* (Opcional) Info Superior - Similar a "Built on top of" */}
        {/* <div className="flex items-center gap-4 text-xs text-neutral-400 mb-8">
          <span>Icono1</span>
          <span>Icono2</span>
        </div> */} 

        {/* Título Grande - Aplicar font-orbitron */}
        <h1 className="relative z-10 font-orbitron text-5xl sm:text-6xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-300 title-decoration">
          Mantente al Día
        </h1>

        {/* Subtítulo */}
        <p className="relative z-10 text-neutral-300 mb-10 text-base sm:text-lg max-w-xl">
          ¡Prepárate para la aventura! Únete a nuestra lista de correo para recibir las últimas noticias y actualizaciones importantes.
        </p>

        {/* Formulario de Suscripción - Ancho ajustado */}
        {!isAuthenticated && (
          <div className="relative z-10 w-full max-w-lg"> {/* Contenedor para controlar ancho */} 
             <SubscriptionForm />
          </div>
        )}
        
        {/* Error de Autenticación */}
        {authError && (
          <div className="relative z-10 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded mt-6 w-full max-w-lg" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">
              {typeof authError === 'string' ? authError : 'Ha ocurrido un problema al contactar el servidor.'}
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

export default ComingSoon; 
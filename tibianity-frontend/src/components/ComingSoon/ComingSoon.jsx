import React from 'react';
import { AUTH_API } from '../../config/constants'; // Ajusta la ruta si es necesario

// Aceptar props isAuthenticated y error
const ComingSoon = ({ isAuthenticated, error }) => {
  const handleLogin = () => {
    // Redirigir al endpoint de autenticación de Google en el backend
    window.location.href = AUTH_API.LOGIN; // Usa /api/auth/google implicitamente
  };

  return (
    // Contenedor principal con fondo oscuro y posicionamiento relativo
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#060919] text-white p-8 overflow-hidden">
      
      {/* Logo posicionado en la esquina superior izquierda */}
      <img
        src="/images/Logo (1).png"
        alt="Tibianity Logo"
        className="absolute top-6 left-8 w-32 h-auto filter drop-shadow-lg z-20" // Ajustar top y width
        style={{ filter: 'brightness(1.3) drop-shadow(0 0 5px rgba(96, 200, 255, 0.2))' }}
      />

      {/* Contenedor del contenido principal (texto y botón) */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl w-full mt-16 md:mt-0"> {/* Añadir margen superior para compensar logo */}
        
        {/* Mensaje "Próximamente" más grande y llamativo */}
        {!isAuthenticated && !error && (
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6 animate-pulse">
            ¡Próximamente!
          </h1>
        )}
        
        {/* Mensaje de error (si existe) */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded relative mb-6 max-w-md w-full" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">
              {typeof error === 'string' ? error : 'Ha ocurrido un problema al contactar el servidor.'}
            </span>
          </div>
        )}

        {/* Texto descriptivo */}
        <p className="text-gray-400 mb-10 text-base md:text-lg max-w-md">
          {isAuthenticated 
            ? 'Tu cuenta está autenticada, pero el acceso completo aún está restringido. Por favor, contacta al administrador si crees que esto es un error.'
            : 'Estamos preparando algo increíble. Vuelve pronto para explorar el mundo de Tibianity como nunca antes.'
          }
        </p>

        {/* Botón de Login (solo si no está autenticado) */}
        {!isAuthenticated && (
          <div className="relative group">
            <div 
              className="absolute -inset-1 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300"
              style={{
                background: 'linear-gradient(to right, #60c8ff, #bd4fff)'
              }}
            />
            <button
              onClick={handleLogin}
              className="relative font-medium text-sm py-2 px-6 rounded-md border border-[#2e2e3a] bg-[#111118]/80 hover:bg-[#111118] transition-all duration-300"
              aria-label="Login con Google"
            >
              <span className="text-white/90 group-hover:text-white transition-colors duration-300">
                Iniciar sesión con Google
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Ilustración en la esquina inferior derecha */}
      <div className="absolute bottom-0 right-0 w-1/2 md:w-1/3 max-w-sm p-4 z-0 opacity-50 pointer-events-none">
         <img 
           src="https://i.imgur.com/Iovx0N9.png" 
           alt="Ilustración decorativa Tibia" 
           className="w-full h-auto object-contain"
         />
      </div>

    </div>
  );
};

export default ComingSoon; 
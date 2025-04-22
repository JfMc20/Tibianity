import React from 'react';
import { AUTH_API } from '../../config/constants'; // Ajusta la ruta si es necesario

// Aceptar props isAuthenticated y error
const ComingSoon = ({ isAuthenticated, error }) => {
  const handleLogin = () => {
    // Redirigir al endpoint de autenticación de Google en el backend
    window.location.href = AUTH_API.LOGIN; // Usa /api/auth/google implicitamente
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      {/* Logo con ruta corregida */}
      <img
        src="/images/Logo (1).png" // Ruta actualizada
        alt="Tibianity Logo"
        className="w-40 h-40 mb-6" // Ajusta tamaño según necesites
      />
      <h1 className="text-5xl font-bold mb-4 text-center">Tibianity</h1>

      {/* Mostrar Error si existe */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-md w-full text-center" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{typeof error === 'string' ? error : 'Ha ocurrido un problema.'}</span>
          {/* Podrías añadir un botón para reintentar checkAuthStatus si el error es de conexión */}
        </div>
      )}

      {/* Mensaje Principal */}
      {!isAuthenticated && !error && (
         <p className="text-2xl text-purple-400 mb-8">¡Próximamente!</p>
      )}

      <p className="text-gray-300 mb-8 text-center px-4 max-w-md">
        {isAuthenticated 
          ? 'Tu cuenta está autenticada, pero aún no tienes acceso completo. Por favor, contacta al administrador.' // Mensaje si está logueado pero no es admin
          : 'Estamos preparando algo increíble. Vuelve pronto para explorar el mundo de Tibianity como nunca antes.' // Mensaje si no está logueado
        }
      </p>

      {/* Botón de Login (solo si no está autenticado y no hay error grave de conexión?) */}
      {!isAuthenticated && (
        <button
          onClick={handleLogin}
          className="group font-medium text-sm py-1.5 px-4 rounded-md border border-[#2e2e3a] bg-[#111118]/40 hover:bg-[#111118]/80 transition-all duration-300 relative" // Clases del Navbar
          aria-label="Login con Google"
        >
          <span className="transition-colors duration-300 text-white/90 group-hover:text-white"> {/* Clases del texto del Navbar */}
            Iniciar sesión con Google
          </span>
        </button>
      )}
      
    </div>
  );
};

export default ComingSoon; 
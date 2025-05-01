import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Componente para mostrar el estado de la conexión con el backend
const ConnectionStatus = () => {
  const { backendStatus, checkBackendStatus, error } = useAuth();

  useEffect(() => {
    // Reintentar conexión cada minuto si está offline
    const interval = setInterval(() => {
      if (!backendStatus.online) {
        checkBackendStatus();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [backendStatus.online, checkBackendStatus]);

  // No mostrar nada si la conexión está ok o aún no se ha chequeado
  if (!backendStatus.checked || backendStatus.online) {
    return null;
  }

  // Mostrar barra de error si está offline
  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-1 px-4 z-50">
      <p className="text-sm">
        {error || 'Could not connect to the server. Check if the backend is running.'}
        <button 
          onClick={checkBackendStatus}
          className="ml-2 underline"
        >
          Try again
        </button>
      </p>
    </div>
  );
};

export default ConnectionStatus; 
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Si no está autenticado y ya no está cargando, redirigir (seguridad extra)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) {
    // Muestra carga o nada mientras se verifica o si no está autenticado
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#060919] text-white">
        Cargando perfil...
      </div>
    );
  }

  // Si está autenticado, mostrar perfil
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
      <div className="bg-[#1a1d2e] p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Tu Perfil</h1>
        {user ? (
          <div className="space-y-4">
            {user.photos && user.photos.length > 0 && (
              <img 
                src={user.photos[0].value} 
                alt="Foto de perfil" 
                className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-purple-500"
              />
            )}
            <p><span className="font-semibold text-gray-400">Nombre:</span> {user.displayName}</p>
            <p><span className="font-semibold text-gray-400">Email:</span> {user.emails && user.emails.length > 0 ? user.emails[0].value : 'No disponible'}</p>
            <p><span className="font-semibold text-gray-400">Rol:</span> {user.isAdmin ? 'Administrador' : 'Usuario'}</p>
            {/* Aquí puedes añadir más información si la tienes en el objeto user */}
          </div>
        ) : (
          <p>No se pudo cargar la información del perfil.</p>
        )}
        <button
          onClick={logout}
          className="mt-8 w-full font-medium text-sm py-2.5 px-6 rounded-md border border-red-700 hover:bg-red-900/50 bg-[#111118]/60 text-red-300 hover:text-red-200 transition-all duration-300"
          aria-label="Cerrar Sesión"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage; 
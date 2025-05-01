import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthCallbackHandler = () => {
  const { checkAuthStatus, loading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Al montar este componente, verifica el estado de autenticación.
    // Esto debería recoger la sesión establecida por el callback de Google.
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ejecutar solo una vez al montar

  useEffect(() => {
    // Este efecto se ejecuta cuando cambian loading, isAuthenticated o user
    if (!loading) {
      if (isAuthenticated && user) {
        // Redirección inteligente basada en el rol
        if (user.isAdmin) {
          console.log('[AuthCallback] Usuario es admin, redirigiendo a /admin...');
          navigate('/admin', { replace: true });
        } else {
          console.log('[AuthCallback] Usuario normal, redirigiendo a /profile...');
          navigate('/profile', { replace: true });
        }
      } else {
        // Si no está autenticado después de la verificación (error o fallo),
        // redirigir a la página principal o a una página de error de login
        console.warn('[AuthCallback] No autenticado después de la verificación, redirigiendo a /...');
        navigate('/', { replace: true });
      }
    }
  }, [loading, isAuthenticated, user, navigate]);

  // Mostrar un mensaje de carga mientras se verifica la sesión
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#060919] text-white">
        <p className="text-xl">Verificando sesión...</p>
        {/* Aquí podrías añadir un spinner o indicador visual de carga */}
      </div>
    );
  }

  // En teoría, el usuario no debería ver este estado porque será redirigido antes
  // Pero es bueno tener un fallback
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#060919] text-white">
      <p className="text-xl text-red-500">Redireccionando...</p>
    </div>
  );
};

export default AuthCallbackHandler; 
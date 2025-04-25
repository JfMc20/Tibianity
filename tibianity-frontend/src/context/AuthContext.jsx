import React, { createContext, useState, useEffect, useContext } from 'react';
import { AUTH_API } from '../config/constants';
import { testBackendConnection } from '../utils/testConnection';

// Crear el contexto de autenticación
const 
AuthContext = createContext(null);

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState({ checked: false, online: false });

  // Función para verificar si el backend está disponible
  const checkBackendStatus = async () => {
    try {
      const result = await testBackendConnection();
      setBackendStatus({ 
        checked: true, 
        online: result.success 
      });
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result.success;
    } catch (error) {
      setBackendStatus({ checked: true, online: false });
      setError('Error al verificar conexión con el backend');
      return false;
    }
  };

  // Función para verificar el estado de autenticación
  const checkAuthStatus = async () => {
    setLoading(true);
    setError(null);

    // Verificar primero si el backend está disponible
    if (!backendStatus.checked) {
      const isOnline = await checkBackendStatus();
      if (!isOnline) {
        setLoading(false);
        return;
      }
    } else if (!backendStatus.online) {
      setLoading(false);
      return;
    }

    // Usar fetch con AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

    try {
      const response = await fetch(AUTH_API.PROFILE, {
        method: 'GET',
        credentials: 'include', // Importante para enviar cookies
        signal: controller.signal // Asociar el AbortController
      });

      clearTimeout(timeoutId); // Limpiar el timeout si la respuesta llega a tiempo

      if (!response.ok) {
        // Manejar respuestas no exitosas (ej. 401, 500)
        setUser(null);
        setIsAuthenticated(false);
        if (response.status !== 401) { // Solo mostrar error si no es un simple "No autenticado"
          console.error(`[AuthContext] Error de autenticación: ${response.status} ${response.statusText}`);
          setError(`Error de autenticación: ${response.status}`);
        }
        // Si es 401, simplemente se queda no autenticado sin mostrar error explícito.
        return; // Salir temprano si la respuesta no fue ok
      }

      // Intentar parsear la respuesta JSON
      try {
        const data = await response.json();
        if (data && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          // La respuesta fue ok, pero no tiene el formato esperado
           console.error('[AuthContext] Respuesta OK pero formato inesperado:', data);
           setError('Respuesta inesperada del servidor.');
           setUser(null);
           setIsAuthenticated(false);
        }
      } catch (parseError) {
        // Error al parsear JSON
        console.error('[AuthContext] Error al parsear respuesta JSON:', parseError);
        setError('Error al procesar la respuesta del servidor.');
        setUser(null);
        setIsAuthenticated(false);
      }

    } catch (error) {
      // Manejar errores de red, timeout, etc.
      setUser(null);
      setIsAuthenticated(false);
      if (error.name === 'AbortError') {
        console.error('[AuthContext] Error verificando autenticación: Timeout');
        setError('El servidor tardó demasiado en responder.');
        setBackendStatus({ checked: true, online: false }); // Marcar como offline si hay timeout
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
         console.error('[AuthContext] Error verificando autenticación: Error de red', error);
         setError('No se pudo conectar al servidor.');
         setBackendStatus({ checked: true, online: false }); // Marcar como offline si hay error de red
      } 
      else {
        console.error('[AuthContext] Error inesperado verificando autenticación:', error);
        setError(`Error inesperado: ${error.message}`);
      }
    } finally {
      // Asegurarse de que el estado de carga se desactive siempre
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async () => {
    const isOnline = await checkBackendStatus();
    if (!isOnline) {
      return;
    }
    window.location.href = AUTH_API.LOGIN;
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      const isOnline = await checkBackendStatus();
      if (!isOnline) {
        // Si el backend no está disponible, cerramos sesión localmente
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      
      // Usar XMLHttpRequest para cerrar sesión
      const xhr = new XMLHttpRequest();
      xhr.open('GET', AUTH_API.LOGOUT, true);
      xhr.withCredentials = true;
      
      xhr.onload = function() {
        setUser(null);
        setIsAuthenticated(false);
      };
      
      xhr.onerror = function() {
        console.error('Error al cerrar sesión');
        setError('Error al cerrar sesión');
      };
      
      xhr.send();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setError('Error al cerrar sesión');
    }
  };

  // Verificar el estado de autenticación al cargar la aplicación
  useEffect(() => {
    // Primero verificar si el backend está disponible
    checkBackendStatus().then(isOnline => {
      if (isOnline) {
        checkAuthStatus();
      }
    });
  }, []);

  // Valor que se proporcionará a través del contexto
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuthStatus,
    backendStatus,
    checkBackendStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 
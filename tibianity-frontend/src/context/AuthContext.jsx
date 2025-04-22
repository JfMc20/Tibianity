import React, { createContext, useState, useEffect, useContext } from 'react';
import { AUTH_API } from '../config/constants';
import { testBackendConnection } from '../utils/testConnection';

// Crear el contexto de autenticación
const AuthContext = createContext(null);

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
    try {
      setLoading(true);
      setError(null);
      
      // En desarrollo, podemos usar un mock para pruebas
      if (process.env.NODE_ENV === 'development' && window.location.pathname.includes('/admin')) {
        console.log('Modo desarrollo: autenticación simulada para administrador');
        setUser({
          id: 'dev-user',
          name: 'Usuario Desarrollo',
          email: 'admin@tibianity.com',
          picture: 'https://via.placeholder.com/150',
          isAdmin: true
        });
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }
      
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
      
      // Usar XMLHttpRequest en vez de fetch para evitar problemas de CORS con credenciales
      const xhr = new XMLHttpRequest();
      xhr.open('GET', AUTH_API.PROFILE, true);
      xhr.withCredentials = true; // Importante para enviar cookies
      xhr.timeout = 10000; // 10 segundos de timeout
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            setUser(data.user);
            setIsAuthenticated(true);
          } catch (e) {
            console.error('Error al parsear respuesta:', e);
            setError('Error al procesar la respuesta del servidor');
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          if (xhr.status === 401) {
            // Usuario no autenticado - esto es normal
            console.log('Usuario no autenticado');
          } else {
            // Otros errores
            setError(`Error de autenticación: ${xhr.status} ${xhr.statusText}`);
          }
        }
        setLoading(false);
      };
      
      xhr.onerror = function() {
        console.error('Error verificando autenticación: No se pudo conectar al servidor');
        setUser(null);
        setIsAuthenticated(false);
        setError('No se pudo conectar al servidor. Verifica que el backend esté en ejecución.');
        setBackendStatus({ checked: true, online: false });
        setLoading(false);
      };
      
      xhr.ontimeout = function() {
        console.error('Error verificando autenticación: Timeout');
        setUser(null);
        setIsAuthenticated(false);
        setError('El servidor tardó demasiado en responder. Verifica la conexión.');
        setBackendStatus({ checked: true, online: false });
        setLoading(false);
      };
      
      xhr.send();
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setUser(null);
      setIsAuthenticated(false);
      setError(`Error: ${error.message}`);
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
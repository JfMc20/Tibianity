import React, { createContext, useState, useEffect, useContext } from 'react';
import { AUTH_API } from '../config/constants';
import { testBackendConnection } from '../utils/testConnection';

// Create the authentication context
const AuthContext = createContext(null);

// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState({ checked: false, online: false });

  // Function to check if the backend is available
  const checkBackendStatus = async () => {
    try {
      const result = await testBackendConnection();
      setBackendStatus({ 
        checked: true, 
        online: result.success 
      });
      
      if (!result.success) {
        setError(result.message); // Keep the message from testConnection (already translated)
      }
      
      return result.success;
    } catch (error) {
      setBackendStatus({ checked: true, online: false });
      setError('Error checking backend connection');
      return false;
    }
  };

  // Function to check authentication status
  const checkAuthStatus = async () => {
    setLoading(true);
    setError(null);

    // First, check if the backend is available
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

    // Use fetch with AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    try {
      const response = await fetch(AUTH_API.PROFILE, {
        method: 'GET',
        credentials: 'include', // Important for sending cookies
        signal: controller.signal // Associate the AbortController
      });

      clearTimeout(timeoutId); // Clear the timeout if the response arrives in time

      if (!response.ok) {
        // Handle non-successful responses (e.g., 401, 500)
        setUser(null);
        setIsAuthenticated(false);
        if (response.status !== 401) { // Only show error if it's not a simple "Not authenticated"
          console.error(`[AuthContext] Authentication error: ${response.status} ${response.statusText}`);
          setError(`Authentication error: ${response.status}`);
        }
        // If it's 401, simply remain unauthenticated without showing an explicit error.
        return; // Exit early if the response was not ok
      }

      // Try to parse the JSON response
      try {
        const data = await response.json();
        if (data && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          // The response was ok, but doesn't have the expected format
           console.error('[AuthContext] OK response but unexpected format:', data);
           setError('Unexpected response from the server.');
           setUser(null);
           setIsAuthenticated(false);
        }
      } catch (parseError) {
        // Error parsing JSON
        console.error('[AuthContext] Error parsing JSON response:', parseError);
        setError('Error processing server response.');
        setUser(null);
        setIsAuthenticated(false);
      }

    } catch (error) {
      // Handle network errors, timeout, etc.
      setUser(null);
      setIsAuthenticated(false);
      if (error.name === 'AbortError') {
        console.error('[AuthContext] Error checking authentication: Timeout');
        setError('The server took too long to respond.');
        setBackendStatus({ checked: true, online: false }); // Mark as offline if there's a timeout
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
         console.error('[AuthContext] Error checking authentication: Network error', error);
         setError('Could not connect to the server.');
         setBackendStatus({ checked: true, online: false }); // Mark as offline if there's a network error
      } 
      else {
        console.error('[AuthContext] Unexpected error checking authentication:', error);
        setError(`Unexpected error: ${error.message}`);
      }
    } finally {
      // Ensure the loading state is always turned off
      setLoading(false);
    }
  };

  // Function to initiate login
  const login = async () => {
    setLoading(true); // Start loading indication
    setError(null);   // Clear previous errors

    const isOnline = await checkBackendStatus();
    
    if (!isOnline) {
       // checkBackendStatus already sets the error message
       setLoading(false); // Stop loading
       return; // Do nothing if backend is offline
    }
    
    // If backend was online, proceed with redirection
    // The page will navigate away, so no need to setLoading(false) here
    window.location.href = AUTH_API.LOGIN;
  };

  // Function to handle logout
  const logout = async () => {
    try {
      const isOnline = await checkBackendStatus();
      if (!isOnline) {
        // If the backend is unavailable, log out locally
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      
      // Use XMLHttpRequest for logout (consider fetch if compatible)
      const xhr = new XMLHttpRequest();
      xhr.open('GET', AUTH_API.LOGOUT, true);
      xhr.withCredentials = true;
      
      xhr.onload = function() {
        setUser(null);
        setIsAuthenticated(false);
      };
      
      xhr.onerror = function() {
        console.error('Error logging out');
        setError('Error logging out');
      };
      
      xhr.send();
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Error during logout');
    }
  };

  // Check authentication status when the application loads
  useEffect(() => {
    // First check if the backend is available
    checkBackendStatus().then(isOnline => {
      if (isOnline) {
        checkAuthStatus();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  // Value provided through the context
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
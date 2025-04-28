import { API_URL } from '../config/constants';

/**
 * Function to check the connection with the backend
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const testBackendConnection = async () => {
  try {
    // Intentar hacer una petición simple al backend
    const response = await fetch(`${API_URL}/`, {
      signal: AbortSignal.timeout(5000) // 5 seconds timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Successful connection with the backend'
      };
    } else {
      return {
        success: false,
        message: `Connection error: ${response.status} ${response.statusText}`
      };
    }
  } catch (error) {
    console.error('Error testing backend connection:', error);
    
    // Get a more descriptive message based on the error
    let errorMessage = 'Unknown error';
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      errorMessage = 'Could not connect to the server. Verify that the backend is running.';
    } else if (error.name === 'AbortError') {
      errorMessage = 'The connection timed out. Check the network or if the server is overloaded.';
    } else {
      errorMessage = `Error: ${error.message}`;
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
}; 
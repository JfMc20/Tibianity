import { API_URL } from '../config/constants';

/**
 * Función para verificar la conexión con el backend
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const testBackendConnection = async () => {
  try {
    // Intentar hacer una petición simple al backend
    const response = await fetch(`${API_URL}/`, {
      signal: AbortSignal.timeout(5000) // 5 segundos de timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Conexión exitosa con el backend'
      };
    } else {
      return {
        success: false,
        message: `Error de conexión: ${response.status} ${response.statusText}`
      };
    }
  } catch (error) {
    console.error('Error al probar conexión con backend:', error);
    
    // Obtener un mensaje más descriptivo según el error
    let errorMessage = 'Error desconocido';
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      errorMessage = 'No se pudo conectar al servidor. Verifica que el backend esté en ejecución.';
    } else if (error.name === 'AbortError') {
      errorMessage = 'La conexión tardó demasiado tiempo. Verifica la red o si el servidor está sobrecargado.';
    } else {
      errorMessage = `Error: ${error.message}`;
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
}; 
// Aquí irá la lógica para comunicarse con el endpoint de N8N

// const N8N_WEBHOOK_URL = process.env.REACT_APP_N8N_WEBHOOK_URL; // Leer desde variables de entorno
const N8N_WEBHOOK_URL = 'https://nodea-n8n.vej9mk.easypanel.host/webhook/5b5e9734-8f0b-4ac5-9045-91d1c6283b15'; // URL de producción actualizada

/**
 * Envía un mensaje al LLM a través del webhook de N8N.
 * @param {string} message El mensaje del usuario.
 * @param {string} sessionId Un ID opcional para mantener el contexto de la conversación.
 * @returns {Promise<object>} La respuesta del LLM (ajustar según la estructura real).
 */
export const sendMessageToLLM = async (message, sessionId = null) => {
  if (!N8N_WEBHOOK_URL) {
    console.error('La URL del webhook de N8N no está configurada.');
    return Promise.reject(new Error('N8N webhook URL no configurada'));
  }

  try {
    const payload = {
      chatInput: message,
      // sessionId: sessionId, // Incluir si N8N lo necesita para contexto
      // userId: 'some_user_id', // Opcional: identificar al usuario
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Añadir cabeceras de autenticación si N8N las requiere
        // 'Authorization': `Bearer TU_TOKEN_SI_ES_NECESARIO`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error en la respuesta de N8N: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    let data;
    let responseText = '';
    try {
      // Protección extra para respuestas que no son JSON válido
      responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error('Respuesta vacía del servidor de N8N');
      }
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error al parsear la respuesta JSON:', parseError);
      console.log('Texto de respuesta recibido:', responseText || 'vacío');
      throw new Error('La respuesta del servidor no es un JSON válido');
    }
    
    console.log('Respuesta recibida de N8N (cruda):', JSON.stringify(data, null, 2));

    // N8N a menudo devuelve un array, incluso con un solo resultado.
    // Tomamos el primer elemento si es un array no vacío.
    const resultObject = Array.isArray(data) && data.length > 0 ? data[0] : data;

    console.log('Objeto resultado a procesar:', JSON.stringify(resultObject, null, 2));
    
    // Validación de estructura estándar 
    if (!resultObject || typeof resultObject !== 'object') {
      console.error('La respuesta de N8N no es un objeto válido:', resultObject);
      throw new Error('Respuesta inesperada del LLM: no es un objeto.');
    }
    
    // Verificamos si tiene la estructura estándar que esperamos
    if (typeof resultObject.success !== 'boolean') {
      console.error('La respuesta no contiene el campo success:', resultObject);
      throw new Error('Respuesta inesperada: falta campo success.');
    }
    
    if (typeof resultObject.answer !== 'string' || resultObject.answer.trim() === '') {
      console.error('La respuesta no contiene un texto válido en answer:', resultObject);
      throw new Error('Respuesta inesperada: falta respuesta textual.');
    }
    
    if (!resultObject.success) {
      console.warn('La consulta fue procesada pero reportó un error:', resultObject.error);
      // Aún así continuamos, para mostrar el mensaje de error amigable en answer
    }
    
    // Si todo está bien o es un error controlado, devolvemos el objeto estandarizado
    return resultObject;

  } catch (error) {
    console.error('Error al enviar mensaje a N8N:', error);
    // Podrías relanzar el error para manejarlo en el componente
    // o devolver un objeto de error estándar
    throw error; 
  }
}; 
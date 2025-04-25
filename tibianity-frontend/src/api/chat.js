// const N8N_WEBHOOK_URL = process.env.REACT_APP_N8N_WEBHOOK_URL; // Read from environment variables
const N8N_WEBHOOK_URL = 'https://nodea-n8n.vej9mk.easypanel.host/webhook/5b5e9734-8f0b-4ac5-9045-91d1c6283b15'; // URL de producción actualizada

/**
 * Send a message to the LLM through the N8N webhook.
 * @param {string} message The user's message.
 * @param {string} sessionId An optional ID to maintain the conversation context.
 * @returns {Promise<object>} The LLM's response (adjust according to the actual structure).
 */
export const sendMessageToLLM = async (message, sessionId = null) => {
  if (!N8N_WEBHOOK_URL) {
    console.error('The N8N webhook URL is not configured.');
    return Promise.reject(new Error('N8N webhook URL not configured'));
  }

  try {
    const payload = {
      chatInput: message,
      // sessionId: sessionId, // Include if N8N needs it for context
      // userId: 'some_user_id', // Optional: identify the user
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if N8N requires them
        // 'Authorization': `Bearer TU_TOKEN_SI_ES_NECESARIO`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error in the N8N response: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    let data;
    let responseText = '';
    try {
      // Extra protection for responses that are not valid JSON
      responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from N8N server');
      }
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing the JSON response:', parseError);
      console.log('Received response text:', responseText || 'empty');
      throw new Error('The server response is not a valid JSON');
    }
    
    console.log('Received response from N8N (raw):', JSON.stringify(data, null, 2));

    // N8N often returns an array, even with a single result.
    // We take the first element if it is a non-empty array.
    const resultObject = Array.isArray(data) && data.length > 0 ? data[0] : data;

    console.log('Result object to process:', JSON.stringify(resultObject, null, 2));
    
    // Standard structure validation
    if (!resultObject || typeof resultObject !== 'object') {
      console.error('The N8N response is not a valid object:', resultObject);
      throw new Error('Unexpected LLM response: not an object.');
    }
    
    // Verify if it has the standard structure we expect
    if (typeof resultObject.success !== 'boolean') {
      console.error('The response does not contain the success field:', resultObject);
      throw new Error('Unexpected response: missing success field.');
    }
    
    if (typeof resultObject.answer !== 'string' || resultObject.answer.trim() === '') {
      console.error('The response does not contain a valid text in answer:', resultObject);
      throw new Error('Unexpected response: missing text answer.');
    }
    
    if (!resultObject.success) {
      console.warn('The query was processed but reported an error:', resultObject.error);
      // We still continue, to show the friendly error message in answer
    }
    
    // If everything is fine or is a controlled error, we return the standardized object
    return resultObject;

  } catch (error) {
    console.error('Error sending message to N8N:', error);
    // You could rethrow the error to handle it in the component
    // or return a standard error object
    throw error; 
  }
}; 
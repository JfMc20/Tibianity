import React, { useState } from 'react';
import { API_URL } from '../../config/constants'; // Necesitaremos la URL base
import axios from 'axios'; // Usaremos axios como en AdminDashboard para consistencia

// Configurar instancia de Axios (similar a AdminDashboard, para withCredentials si es necesario)
// Aunque para enviar correos quizás no se necesite cookie, es buena práctica ser consistente.
const apiClient = axios.create({
  withCredentials: true 
});

const EmailSubscribers = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    if (!subject || !body) {
      setError('El asunto y el cuerpo del correo son obligatorios.');
      setIsLoading(false);
      return;
    }

    try {
      // CORREGIDO: Construir el endpoint sin duplicar /api
      const endpoint = `${API_URL}/admin/send-newsletter`; 
      
      const response = await apiClient.post(endpoint, {
        subject,
        body,
      });

      setMessage(response.data.message || 'Proceso de envío iniciado con éxito.');
      setSubject(''); // Limpiar campos tras éxito
      setBody('');

    } catch (err) {
      console.error("Error al enviar newsletter:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Ocurrió un error al intentar enviar los correos.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#111118] border border-[#2e2e3a] rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Enviar Correo a Suscriptores</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-1">Asunto</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border border-[#2e2e3a] rounded bg-[#1e2232] text-white focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-400 mb-1">Cuerpo del Mensaje (HTML permitido)</label>
          <textarea
            id="body"
            rows="6"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border border-[#2e2e3a] rounded bg-[#1e2232] text-white focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={isLoading}
            placeholder='Escribe aquí el contenido del correo... Puedes usar etiquetas HTML básicas como <p>, <a>, <strong>, <em>.'
          />
        </div>
        
        {/* Mensajes de feedback */} 
        <div className="h-6">
          {message && <p className="text-sm text-green-400">{message}</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 ease-in-out 
              ${isLoading 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-[#111118]'}
            `}
          >
            {isLoading ? 'Enviando...' : 'Enviar Correo a Suscriptores'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailSubscribers; 
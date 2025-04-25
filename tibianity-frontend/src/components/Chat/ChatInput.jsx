import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText(''); // Limpiar input después de enviar
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center bg-[#060919] p-2 rounded-b-lg">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Escribe tu mensaje aquí..."
        className="flex-grow p-3 rounded-l-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        disabled={isLoading}
        aria-label="Mensaje"
      />
      <button
        type="submit"
        className="p-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
        disabled={isLoading || !inputText.trim()}
        aria-label="Enviar mensaje"
      >
        {isLoading ? (
          // Icono simple de carga (puedes reemplazarlo por uno SVG o de una librería)
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          // Icono de enviar (puedes reemplazarlo)
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 16.171V11.42a1 1 0 01.894-.995l7-1A1 1 0 0018 8.421l-7.106-5.868z" />
          </svg>
        )}
      </button>
    </form>
  );
};

export default ChatInput; 
import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Desplazarse hacia abajo cada vez que lleguen nuevos mensajes

  if (!messages || messages.length === 0) {
    return <p className="text-center text-gray-400">Inicia la conversación...</p>;
  }

  return (
    <div className="space-y-3 p-1">
      {messages.map((msg, index) => (
        <div 
          key={index} 
          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`p-3 rounded-lg max-w-xl lg:max-w-2xl break-words ${ 
              msg.sender === 'user' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-white'
            }`}
          >
            {/* Aquí podrías añadir formato Markdown si el LLM lo soporta */} 
            {msg.text}
          </div>
        </div>
      ))}
      {/* Elemento invisible para ayudar a hacer scroll al final */} 
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 
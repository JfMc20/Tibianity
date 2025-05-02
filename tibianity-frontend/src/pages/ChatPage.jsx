import React, { useState } from 'react';
import MessageList from '../components/Chat/MessageList';
import ChatInput from '../components/Chat/ChatInput';
import { sendMessageToLLM } from '../api/chat';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   // Cargar historial inicial o mensaje de bienvenida si es necesario
  // }, []);

  const handleSendMessage = async (inputText) => {
    if (!inputText.trim()) return;

    const userMessage = { sender: 'user', text: inputText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Llamada real a la API
      const response = await sendMessageToLLM(inputText);
      const botMessage = { sender: 'bot', text: response.answer };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage = err.message || 'Error al comunicar con el asistente. Intenta de nuevo.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--navbar-height,0px)-var(--footer-height,0px))] text-white">
      <h1 className="text-2xl font-bold p-4 text-center bg-[#060919] shadow-md">Asistente Tibianity</h1>
      
      <div className="flex-grow overflow-y-auto p-4 md:p-6">
        <MessageList messages={messages} />
        {isLoading && <p className="text-center text-gray-400 mt-2">Pensando...</p>}
        {error && <p className="text-center text-red-500 mt-2">{error}</p>}
      </div>

      <div className="mt-auto border-t border-gray-700">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatPage; 
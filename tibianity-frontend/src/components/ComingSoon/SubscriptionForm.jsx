import React, { useState } from 'react';
import { API_URL } from '../../config/constants';
import GradientButton from '../common/GradientButton';

const SubscriptionForm = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeError, setSubscribeError] = useState('');

  const handleSubscribe = async (event) => {
    event.preventDefault();
    setIsSubscribing(true);
    setSubscribeMessage('');
    setSubscribeError('');

    try {
      const response = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }

      setSubscribeMessage(data.message);
      setEmail('');

    } catch (err) {
      console.error("Error en suscripción:", err);
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
      setSubscribeError(errorMessage);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="w-full max-w-sm mb-8 mx-auto">
      <label htmlFor="email-subscribe" className="block text-white/80 text-sm font-medium mb-2">
        Sé el primero en enterarte de nuestro lanzamiento:
      </label>
      <div className="flex items-center border border-[#2e2e3a] rounded-md bg-[#111118]/50 focus-within:ring-2 focus-within:ring-[#60c8ff]/50">
        <input
          id="email-subscribe"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu correo electrónico"
          required
          className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1.5 px-4 leading-tight focus:outline-none placeholder-white/30"
          disabled={isSubscribing}
        />
        <GradientButton 
          type="submit"
          text={isSubscribing ? 'Suscribiendo...' : 'Suscribirse'}
          disabled={isSubscribing}
        />
      </div>
      {subscribeMessage && <p className="text-green-400 text-xs mt-2">{subscribeMessage}</p>}
      {subscribeError && <p className="text-red-400 text-xs mt-2">{subscribeError}</p>}
    </form>
  );
};

export default SubscriptionForm; 
import React, { useState, useEffect } from 'react';
import { Field, Label, Input } from '@headlessui/react';
import { API_URL } from '../../config/constants';
import GradientButton from '../common/GradientButton';
import ValidationAlert from '../common/Alerts/ValidationAlert';

const SubscriptionForm = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeError, setSubscribeError] = useState('');

  useEffect(() => {
    if (subscribeError) {
      setSubscribeError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

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
    <Field as="form" onSubmit={handleSubscribe} className="w-full max-w-sm mb-8 mx-auto" disabled={isSubscribing}>
      <Label className="block text-white/80 text-sm font-medium mb-2 data-disabled:opacity-50">
        Sé el primero en enterarte de nuestro lanzamiento:
      </Label>
      <div 
        className={`flex items-center border border-[#2e2e3a] rounded-md bg-[#111118]/50 relative overflow-hidden 
                     focus-within:border-[#2e2e3a]
                     focus-within:shadow-[0_0_0_2px_#60c8ff,0_0_0_3px_#bd4fff]
                     transition-all duration-300 ${isSubscribing ? 'opacity-70' : ''}`}
      >
        <div className="flex items-center w-full bg-transparent rounded-[5px] p-1">
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (subscribeMessage) setSubscribeMessage('');
            }}
            placeholder="Tu correo electrónico"
            required
            className="relative appearance-none bg-transparent border-none w-full text-white py-1 px-2 mr-1 leading-tight focus:outline-none placeholder-white/30 
                       data-disabled:cursor-not-allowed"
          />
          <GradientButton 
            type="submit"
            ariaLabel={isSubscribing ? 'Suscribiendo correo' : 'Suscribir correo'}
            className="flex-shrink-0"
          >
            {isSubscribing ? 'Suscribiendo...' : 'Suscribirse'}
          </GradientButton>
        </div>
      </div>
      <div aria-live="polite">
        {subscribeMessage && ( 
          <ValidationAlert 
            message={subscribeMessage} 
            type="success" 
            className="mt-2" 
          /> 
        )}
        {subscribeError && ( 
          <ValidationAlert 
            message={subscribeError} 
            type="error" 
            className="mt-2" 
          /> 
        )}
      </div>
    </Field>
  );
};

export default SubscriptionForm; 
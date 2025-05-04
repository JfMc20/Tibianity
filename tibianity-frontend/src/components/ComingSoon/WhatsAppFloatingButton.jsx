import React from 'react';
import PropTypes from 'prop-types';

// Icono SVG de WhatsApp (puedes reemplazarlo si usas una librería de iconos)
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
    className="w-6 h-6 md:w-8 md:h-8"
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.8 0-67.6-9.5-97.2-27.2l-4.6-2.7-72.3 19 19.3-70.5-3-4.9c-18.9-31.6-29.1-68.1-29.1-105.4 0-102.3 83.2-185.5 185.5-185.5 49.9 0 96.9 19.5 132.3 54.9 35.4 35.4 54.9 82.4 54.9 132.3 0 102.3-83.2 185.5-185.6 185.5zm101.8-137.6c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

/**
 * Botón flotante para iniciar un chat de WhatsApp.
 */
const WhatsAppFloatingButton = ({ phoneNumber }) => {
  if (!phoneNumber) {
    console.warn('WhatsAppFloatingButton: phoneNumber prop is required.');
    return null; // No renderizar si no hay número
  }

  // Asegúrate de que el número esté en formato internacional sin +, espacios o guiones
  const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${formattedPhoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 md:p-4 shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center group origin-bottom-right animate-scaleIn animate-pulseGlow"
    >
      <WhatsAppIcon />
    </a>
  );
};

WhatsAppFloatingButton.propTypes = {
  /**
   * Número de teléfono en formato internacional (ej. 54911...).
   * Se recomienda quitar +, espacios o guiones antes de pasarlo.
   */
  phoneNumber: PropTypes.string.isRequired,
};

export default WhatsAppFloatingButton; 
import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const SubscriptionConfirmationPage = () => {
  // Usaremos la ruta para determinar el estado, ej. /subscription-confirmed
  const location = useLocation();
  let status = 'info'; // Default
  if (location.pathname.includes('confirmed')) {
    status = 'success';
  } else if (location.pathname.includes('error')) {
    status = 'error';
  } else if (location.pathname.includes('invalid')) {
    status = 'invalid';
  }

  let title = 'Confirmación de Suscripción';
  let message = 'Procesando tu confirmación...';
  let IconComponent = ExclamationTriangleIcon;
  let iconColor = 'text-yellow-500';

  switch (status) {
    case 'success':
      title = '¡Suscripción Confirmada!';
      message = 'Gracias por confirmar tu correo electrónico. Ya estás listo para recibir nuestras noticias.';
      IconComponent = CheckCircleIcon;
      iconColor = 'text-green-500';
      break;
    case 'error':
      title = 'Error en la Confirmación';
      message = 'Lo sentimos, ocurrió un error inesperado al procesar tu confirmación. Por favor, intenta de nuevo más tarde o contacta con soporte.';
      IconComponent = XCircleIcon;
      iconColor = 'text-red-500';
      break;
    case 'invalid':
      title = 'Enlace Inválido o Expirado';
      message = 'Este enlace de confirmación no es válido o ya ha expirado. Por favor, intenta suscribirte de nuevo.';
      IconComponent = ExclamationTriangleIcon;
      iconColor = 'text-yellow-500';
      break;
    default:
      // Mantener valores por defecto o mostrar un mensaje genérico
      break;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#111118] to-[#16161d] text-white px-4 py-12">
      <div className="bg-[#16161d] border border-[#2e2e3a] rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <IconComponent className={`h-16 w-16 ${iconColor} mx-auto mb-4`} />
        <h1 className="font-orbitron text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-500">
          {title}
        </h1>
        <p className="text-white/80 mb-6">
          {message}
        </p>
        <Link 
          to="/" 
          className="inline-block px-6 py-2 rounded-md bg-gradient-to-r from-[#60c8ff] to-[#bd4fff] hover:from-[#70d0ff] hover:to-[#c560ff] text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionConfirmationPage; 
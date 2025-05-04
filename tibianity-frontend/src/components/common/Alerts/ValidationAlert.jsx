import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

// Mapeo de tipos a estilos e iconos
const alertStyles = {
  error: {
    bgColor: 'bg-red-100',
    borderColor: 'border-red-400',
    textColor: 'text-red-700',
    iconColor: 'text-red-500',
    icon: XCircleIcon,
  },
  warning: {
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-700',
    iconColor: 'text-yellow-500', // Similar al naranja de la imagen
    icon: ExclamationTriangleIcon,
  },
  success: {
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400',
    textColor: 'text-green-700',
    iconColor: 'text-green-500',
    icon: CheckCircleIcon,
  },
  info: {
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-500',
    icon: InformationCircleIcon,
  },
};

/**
 * Componente reutilizable para mostrar mensajes de alerta/feedback.
 * @param {Object} props - Props del componente.
 * @param {string} props.message - El mensaje a mostrar.
 * @param {'error' | 'warning' | 'success' | 'info'} [props.type='warning'] - Tipo de alerta para estilo.
 * @param {string} [props.className] - Clases CSS adicionales.
 */
const ValidationAlert = ({ message, type = 'warning', className = '' }) => {
  if (!message) return null; // No renderizar si no hay mensaje

  const styles = alertStyles[type] || alertStyles.warning;
  const IconComponent = styles.icon;

  return (
    <div 
      className={`border-l-4 p-3 rounded-md shadow-sm flex items-center space-x-2 ${styles.borderColor} ${styles.bgColor} ${className}`} 
      role="alert"
    >
      <IconComponent className={`h-5 w-5 ${styles.iconColor}`} aria-hidden="true" />
      <p className={`text-sm font-medium ${styles.textColor}`}>
        {message}
      </p>
    </div>
  );
};

ValidationAlert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['error', 'warning', 'success', 'info']),
  className: PropTypes.string,
};

export default ValidationAlert; 
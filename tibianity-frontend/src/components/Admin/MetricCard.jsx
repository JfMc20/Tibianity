import React from 'react';

// Componente reutilizable para mostrar una métrica clave en el dashboard
const MetricCard = ({ title, value, color }) => {
  // Define el color del borde izquierdo, usando gris como fallback
  const borderColorClass = color || 'border-gray-500';

  return (
    <div 
      className={`bg-[#111118] border border-[#2e2e3a] rounded-lg p-4 border-l-4 ${borderColorClass}`}
    >
      <h2 className="text-sm text-gray-400 uppercase truncate" title={title}>
        {title}
      </h2>
      <p className="text-3xl font-bold text-white mt-1">
        {value !== undefined && value !== null ? value : '-'}
      </p>
    </div>
  );
};

// Opcional: Añadir PropTypes para validación
// import PropTypes from 'prop-types';
// MetricCard.propTypes = {
//   title: PropTypes.string.isRequired,
//   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//   color: PropTypes.string, // ej. 'border-blue-500'
// };

export default MetricCard; 
import React from 'react';

/**
 * Botón reutilizable con borde gradiente siempre visible (si no está deshabilitado).
 * @param {Object} props - Props del componente.
 * @param {() => void} props.onClick - La función que se ejecuta al hacer clic.
 * @param {string} props.text - El texto que se mostrará en el botón.
 * @param {React.ReactNode} [props.icon] - Icono opcional (componente React) a mostrar antes del texto.
 * @param {string} [props.type="button"] - El tipo de botón (button, submit, reset).
 * @param {boolean} [props.disabled=false] - Si el botón está deshabilitado.
 * @param {string} [props.className] - Clases CSS adicionales para personalizar el botón interno.
 * @param {string} [props.ariaLabel] - Etiqueta ARIA (opcional, se deriva del texto si no se proporciona).
 */
const GradientButton = ({ 
  onClick, 
  text,
  icon,
  type = "button",
  disabled = false,
  className = '', 
  ariaLabel
 }) => {
  // const [isHovered, setIsHovered] = useState(false);

  // Generar un aria-label por defecto si no se proporciona
  const defaultAriaLabel = ariaLabel || text;

  return (
    <div 
      className={`relative group inline-block ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Borde gradiente siempre visible si no está deshabilitado */}
      <div 
        className={`absolute -inset-[1px] rounded-md transition-opacity duration-300 ${!disabled ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'linear-gradient(to right, #60c8ff, #bd4fff)',
          borderRadius: '6px', // Asegúrate que coincida con el borderRadius del botón
        }}
      />
      {/* Botón interno */}
      <button 
        type={type}
        className={`relative flex items-center gap-2 font-medium text-sm py-1.5 px-4 rounded-md border border-[#2e2e3a] bg-[#111118]/60 hover:bg-[#111118]/90 transition-all duration-300 text-white/90 hover:text-white whitespace-nowrap ${className} ${disabled ? 'hover:bg-[#111118]/60' : ''}`}
        onClick={onClick} 
        aria-label={defaultAriaLabel}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        {/* Renderizar icono si existe */}
        {icon && <span className="inline-flex items-center">{icon}</span>} 
        {text}
      </button>
    </div>
  );
};

export default GradientButton; 
import React from 'react';

/**
 * Botón reutilizable con borde gradiente siempre visible (si no está deshabilitado).
 * @param {Object} props - Props del componente.
 * @param {() => void} props.onClick - La función que se ejecuta al hacer clic.
 * @param {React.ReactNode} props.children - El contenido a mostrar dentro del botón.
 * @param {string} [props.type="button"] - El tipo de botón (button, submit, reset).
 * @param {boolean} [props.disabled=false] - Si el botón está deshabilitado.
 * @param {string} [props.className] - Clases CSS adicionales para personalizar el botón interno.
 * @param {string} [props.ariaLabel] - Etiqueta ARIA (requerida si el contenido no es descriptivo).
 */
const GradientButton = ({ 
  onClick, 
  children,
  type = "button",
  disabled = false,
  className = '', 
  ariaLabel
 }) => {
  // const [isHovered, setIsHovered] = useState(false);

  // Asegúrate de que siempre haya un aria-label
  const defaultAriaLabel = ariaLabel || "Gradient Button";

  return (
    <div 
      className={`relative group inline-block ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* Borde gradiente: Ocultar en estado activo del grupo (botón presionado) */}
      <div 
        className={`absolute -inset-[1px] rounded-md transition-opacity duration-300 ${!disabled ? 'opacity-100 group-active:opacity-0' : 'opacity-0'}`}
        style={{
          background: 'linear-gradient(to right, #60c8ff, #bd4fff)',
          borderRadius: '6px', // Asegúrate que coincida con el borderRadius del botón
        }}
        aria-hidden="true" // Es decorativo
      />
      {/* Botón interno: Añadir efecto de escala en activo */}
      <button 
        type={type}
        className={`relative flex items-center gap-2 font-medium text-sm py-1.5 px-4 rounded-md border border-transparent bg-[#111118]/60 hover:bg-[#111118]/90 
                   active:scale-[0.98] transition-all duration-150 text-white/90 hover:text-white whitespace-nowrap ${className} 
                   ${disabled ? 'hover:bg-[#111118]/60' : ''}`}
        onClick={onClick} 
        aria-label={defaultAriaLabel}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        {/* Renderizar children directamente */} 
        {children} 
      </button>
    </div>
  );
};

export default GradientButton; 
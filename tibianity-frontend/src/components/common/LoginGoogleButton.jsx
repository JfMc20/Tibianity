import React, { useState } from 'react';

/**
 * Botón reutilizable para iniciar sesión con Google.
 * @param {Object} props - Props del componente.
 * @param {() => void} props.onClick - La función que se ejecuta al hacer clic.
 * @param {boolean} [props.withGradientEffect=false] - Si se debe mostrar el borde gradiente en hover.
 * @param {string} [props.className] - Clases CSS adicionales para personalizar el botón interno.
 * @param {string} [props.ariaLabel="Login con Google"] - Etiqueta ARIA.
 */
const LoginGoogleButton = ({ 
  onClick, 
  withGradientEffect = false,
  className = '', 
  ariaLabel = "Login con Google"
 }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (withGradientEffect) {
    return (
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`absolute -inset-[1px] rounded-md transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'linear-gradient(to right, #60c8ff, #bd4fff)',
            borderRadius: '6px',
          }}
        />
        <button 
          className={`relative font-medium text-sm py-1.5 px-4 rounded-md border border-[#2e2e3a] bg-[#111118]/60 hover:bg-[#111118]/90 transition-all duration-300 text-white/90 hover:text-white ${className}`}
          onClick={onClick} 
          aria-label={ariaLabel}
          tabIndex="0"
        >
          Login con Google
        </button>
      </div>
    );
  }

  return (
    <button 
      className={`font-medium text-sm py-1.5 px-4 rounded-md border border-[#2e2e3a] bg-[#111118]/60 hover:bg-[#111118]/90 transition-all duration-300 text-white/90 hover:text-white ${className}`}
      onClick={onClick} 
      aria-label={ariaLabel}
      tabIndex="0"
    >
      Login con Google
    </button>
  );
};

export default LoginGoogleButton; 
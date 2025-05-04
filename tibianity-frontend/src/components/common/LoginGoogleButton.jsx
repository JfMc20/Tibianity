import React, { useState } from 'react';
import PropTypes from 'prop-types';
import GradientButton from './GradientButton'; // Asumiendo que GradientButton está aquí

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
  ariaLabel = "Login con Google",
  iconOnly = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Clases base del botón
  let buttonClasses = "font-medium text-sm rounded-md border border-[#2e2e3a] bg-[#111118]/60 hover:bg-[#111118]/90 transition-all duration-300 relative text-white/90 hover:text-white flex items-center justify-center gap-x-2 whitespace-nowrap";

  // Ajustar padding si es solo icono
  if (iconOnly) {
    buttonClasses += " p-2"; // Padding más cuadrado para icono solo
  } else {
    buttonClasses += " py-1.5 px-4"; // Padding normal para texto + icono
  }
  
  // Contenido del botón
  const buttonContent = iconOnly ? (
    <GoogleIcon />
  ) : (
    <>
      <GoogleIcon />
      Login con Google
    </>
  );

  if (withGradientEffect) {
    return (
      <GradientButton 
        onClick={onClick} 
        aria-label={iconOnly ? "Iniciar sesión con Google" : undefined}
        className={iconOnly ? "p-0" : undefined} // Quitar padding extra de GradientButton
      >
        {/* Span ahora maneja el layout y padding. Añadido text-white */}
        <span className={`flex items-center justify-center ${iconOnly ? 'p-2' : 'gap-x-2'} text-white`}>
          {buttonContent}
        </span>
      </GradientButton>
    );
  }
  
  return (
    <button 
      className={buttonClasses} 
      onClick={onClick}
      aria-label={iconOnly ? "Iniciar sesión con Google" : "Login con Google"}
    >
      {buttonContent}
    </button>
  );
};

// Icono SVG de Google
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
    <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003-.002l6.19 5.238C39.702 35.596 44 30.121 44 24c0-1.341-.138-2.65-.389-3.917z"/>
  </svg>
);

LoginGoogleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  withGradientEffect: PropTypes.bool,
  /** Si es true, muestra solo el icono de Google */
  iconOnly: PropTypes.bool,
};

export default LoginGoogleButton; 
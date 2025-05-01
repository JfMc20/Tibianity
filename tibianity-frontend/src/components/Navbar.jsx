import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import LoginGoogleButton from './common/LoginGoogleButton';

/**
 * @typedef {Object} NavLinkProps
 * @property {string} to - The URL the link points to
 * @property {string} label - The text displayed for the link
 * @property {string} activeLink - Currently active link identifier
 * @property {(linkId: string) => void} onSelect - Callback function when link is selected
 * @property {(element: HTMLElement) => void} registerRef - Function to register the element reference
 */

/**
 * Logo Component - Brand logo with subtle neon effect
 * Exported for use in other components like Footer.
 */
export const Logo = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link
      to="/"
      className="relative flex items-center h-full overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Tibianity Home"
    >
      {/* REMOVED Logo Image */}
      {/* 
      <img
        src="/images/Logo Escudo (1).webp" // --- CHANGED IMAGE SOURCE ---
        alt="Tibianity Logo"
        className="relative z-10 transition-all duration-300 ease-out"
        style={{
          height: '56px', // --- INCREASED HEIGHT AGAIN ---
          width: 'auto',
          filter: `brightness(${isHovered ? 1.2 : 1}) drop-shadow(0 1px 2px rgba(0,0,0,0.3))`,
          transform: `scale(${isHovered ? 1.05 : 1})` 
        }}
      />
      */}
      {/* Text "Tibianity" - Always visible, now the main logo element */}
      <span
        className="text-xl font-bold text-white whitespace-nowrap transition-colors duration-300 
                   group-hover:bg-gradient-to-r group-hover:from-[#60c8ff] group-hover:to-[#bd4fff] group-hover:bg-clip-text group-hover:text-transparent"
        style={{
          filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))'
        }}
      >
        Tibianity
      </span>
    </Link>
  );
};

/**
 * LoginButton Component - Clean login button with Google OAuth
 */
const LoginButton = () => {
  const { user, isAuthenticated, login, logout, error } = useAuth();
  
  const isAdmin = user?.isAdmin === true;
  
  return (
    <div className="relative group">
      {error && (
        <div className="absolute -bottom-8 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded">
          {error}
        </div>
      )}
      {isAuthenticated ? (
        <div className="flex items-center space-x-2 relative border border-transparent p-1 rounded-md">
          {user?.photos && user.photos.length > 0 && (
            <img 
              src={user.photos[0].value} 
              alt="User Profile" 
              className="w-8 h-8 rounded-full border border-[#2e2e3a]"
            />
          )}
          <div className="hidden sm:flex sm:flex-col">
            <span className="text-xs text-white/70">Bienvenido</span>
            <span className="text-sm text-white truncate max-w-[100px]">{user?.displayName}</span>
          </div>
          {isAdmin && (
            <RouterNavLink 
              to="/admin"
              className="font-medium text-sm py-1.5 px-3 rounded-md border border-[#2e2e3a] bg-[#111118]/60 hover:bg-[#111118]/90 transition-all duration-300 relative text-white/90 hover:text-white whitespace-nowrap"
              aria-label="Admin Dashboard"
            >
              Admin
            </RouterNavLink>
          )}
          <button 
            className="font-medium text-sm py-1.5 px-3 rounded-md border border-[#2e2e3a] bg-[#111118]/60 hover:bg-[#111118]/90 transition-all duration-300 relative text-white/90 hover:text-white whitespace-nowrap"
            onClick={logout}
            aria-label="Logout"
            tabIndex="0"
          >
            Logout
          </button>
        </div>
      ) : (
        <LoginGoogleButton onClick={login} withGradientEffect={true} />
      )}
    </div>
  );
};

/**
 * ProjectButton Component - Highlighted button for registration
 */
const ProjectButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated, login } = useAuth();
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  // No mostrar el botón si el usuario ya está autenticado
  if (isAuthenticated) {
    return null;
  }
  
  return (
    <div className="relative group ml-2">
      <div 
        className={`absolute -inset-[1px] rounded-md transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'linear-gradient(to right, #60c8ff, #bd4fff)',
          borderRadius: '6px',
        }}
      />
      <button 
        className="font-medium text-sm py-1.5 px-4 rounded-md border border-[#2e2e3a] bg-[#111118]/60 hover:bg-[#111118]/90 transition-all duration-300 relative text-white/90 hover:text-white"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={login}
        aria-label="Register account"
        tabIndex="0"
      >
        Register
      </button>
    </div>
  );
};

/**
 * Navbar Component - Refactorizado
 */
const Navbar = () => {
  // Estado para menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Links de navegación
  const navLinks = [
    { id: 'news', to: '/news', label: 'News' },
    { id: 'market', to: '/market', label: 'Market' },
    { id: 'lore', to: '/lore', label: 'Lore' },
    { id: 'team', to: '/team', label: 'Team' }
  ];
  
  // Función para activar/desactivar menú móvil
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Función para cerrar menú móvil al hacer clic en un enlace
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    // Cabecera con estilos base
    <header className="bg-[#111118] border-b border-[#2e2e3a] shadow-sm sticky top-0 z-40" 
            style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(189, 79, 255, 0.1)'}}>
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-20 px-3">
          
          {/* Izquierda: Logo */} 
          <div className="flex-shrink-0">
            <Logo />
          </div>
          
          {/* Centro: Nav Links (Desktop) */} 
          <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6"> 
            {navLinks.map((link) => (
              <RouterNavLink
                key={link.id}
                to={link.to}
                // Clase base y activa usando la función de NavLink
                className={({ isActive }) => 
                  `text-sm py-2 px-1.5 transition-colors duration-300 border-b-2 
                  ${isActive 
                    ? 'text-sky-300 border-sky-400' 
                    : 'text-white/80 border-transparent hover:text-white hover:border-white/50'}`
                }
                aria-label={`Navegar a ${link.label}`}
              >
                {link.label}
              </RouterNavLink>
            ))}
          </div>
          
          {/* Derecha: Botones (Login/Register) */} 
          <div className="hidden md:flex md:items-center space-x-2 pr-1"> 
            <LoginButton />
            <ProjectButton />
          </div>

          {/* Botón Menú Móvil (Solo visible en pantallas pequeñas) */} 
          <div className="md:hidden flex items-center"> 
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label="Abrir menú principal"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Panel Menú Móvil */} 
      {/* Usar clases de transición para animación suave */} 
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-[#111118] border-b border-[#2e2e3a] shadow-lg transition-all duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <RouterNavLink
              key={link.id}
              to={link.to}
              onClick={closeMobileMenu} // Cerrar menú al hacer clic
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600/30 to-purple-700/30 text-white' 
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'}`
              }
              aria-label={`Navegar a ${link.label}`}
            >
              {link.label}
            </RouterNavLink>
          ))}
        </div>
         {/* Botones en menú móvil */}
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="px-2 space-y-2">
             {/* Reutilizar LoginButton y ProjectButton o crear versiones específicas para móvil si es necesario */} 
            <div className="px-1"><LoginButton /></div>
            <div className="px-1"><ProjectButton /></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 
import React, { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bars3Icon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Popover, Transition } from '@headlessui/react';
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
        className="font-orbitron text-xl font-bold text-white whitespace-nowrap transition-colors duration-300 
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
 * @param {Object} props
 * @param {boolean} [props.iconOnly] - Si es true, muestra solo el icono de Google.
 */
const LoginButton = ({ iconOnly = false }) => {
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
        <LoginGoogleButton onClick={login} withGradientEffect={true} iconOnly={iconOnly} />
      )}
    </div>
  );
};

/**
 * Navbar Component - Refactorizado
 * Acepta props opcionales para integrar el toggle del Admin Panel.
 * @param {Object} props
 * @param {() => void} [props.togglePanel] - Función para abrir/cerrar panel admin.
 * @param {boolean} [props.isPanelOpen] - Estado actual del panel admin.
 * @param {boolean} [props.isAdminLayout] - Indica si está en el layout de admin (para mostrar toggle).
 */
const Navbar = ({ togglePanel, isPanelOpen, isAdminLayout = false }) => {
  const navLinks = [
    { id: 'news', to: '/news', label: 'News' },
    { id: 'market', to: '/market', label: 'Market' },
    { id: 'lore', to: '/lore', label: 'Lore' },
    { id: 'team', to: '/team', label: 'Team' },
    { id: 'events', to: '/events', label: 'Events' }
  ];
  
  // Función combinada para el botón del panel admin en menú móvil
  const handleAdminPanelToggleFromMobile = (closeMenu) => {
    if (togglePanel) {
      togglePanel(); // Llama a la función del layout
    }
    closeMenu(); // Cierra el popover
  };
  
  return (
    <header className="bg-[#111118] border-b border-[#2e2e3a] shadow-sm sticky top-0 z-40" 
            style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(189, 79, 255, 0.1)'}}>
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-20 px-3">
          
          {/* Izquierda: Toggle Admin (Desktop) + Logo */}
          <div className="flex items-center gap-x-3">
            {/* Botón Toggle Admin Panel - Oculto por defecto, visible en lg+ */}
            {isAdminLayout && (
              <button 
                onClick={togglePanel}
                // Añadir hidden lg:inline-flex
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white hidden lg:inline-flex"
                aria-label={isPanelOpen ? "Cerrar panel lateral" : "Abrir panel lateral"}
              >
                 {isPanelOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />} 
              </button>
            )}
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
          
          {/* Derecha: Botones (Login) */} 
          <div className="hidden md:flex md:items-center space-x-2 pr-1"> 
            <LoginButton />
          </div>

          {/* --- INICIO SECCIÓN MENÚ MÓVIL REFACTORIZADA CON HEADLESS UI --- */}
          <div className="md:hidden flex items-center"> 
            <Popover className="relative">
              {({ open, close }) => (
                <>
                  <Popover.Button
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    aria-controls="mobile-menu-panel"
                    aria-expanded={open}
                    aria-label="Abrir menú principal"
                  >
                    <span className="sr-only">Abrir menú principal</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Popover.Button>

                  <Transition
                    as={Fragment} // Usa Fragment para evitar divs extra
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel 
                      id="mobile-menu-panel"
                      className="absolute top-full right-0 mt-2 w-64 origin-top-right rounded-md bg-[#16161d] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-[#2e2e3a] z-50"
                    >
                      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                          <RouterNavLink
                            key={link.id}
                            to={link.to}
                            onClick={close} // Cierra el popover al hacer clic
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
                        {/* Opción para abrir/cerrar Admin Panel (Solo si isAdminLayout) */}
                        {isAdminLayout && (
                          <button
                            onClick={() => handleAdminPanelToggleFromMobile(close)} // Pasa la función close
                            className="w-full text-left flex items-center gap-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors duration-200"
                          >
                            <Cog6ToothIcon className="h-5 w-5" aria-hidden="true" /> 
                            Admin Panel
                          </button>
                        )}
                      </div>
                      {/* Botones en menú móvil */}
                      <div className="pt-4 border-gray-700">
                        {/* Línea con gradiente */}
                        <div className="h-px w-full mb-4" style={{
                          background: 'linear-gradient(to right, #60c8ff, #bd4fff, #60c8ff)',
                          boxShadow: '0 0 8px rgba(96, 200, 255, 0.4), 0 0 12px rgba(189, 79, 255, 0.3)'
                        }}></div>
                        {/* Contenedor de botones con padding */}
                        <div className="px-3 pb-3 flex items-center space-x-2">
                          <LoginButton iconOnly={true} />
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
          {/* --- FIN SECCIÓN MENÚ MÓVIL REFACTORIZADA --- */}

        </div>
      </div>
    </header>
  );
};

export default Navbar; 
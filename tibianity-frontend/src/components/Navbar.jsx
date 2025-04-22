import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdminEmail } from '../config/constants';

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
 */
const Logo = () => {
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
      className="relative block w-full h-full overflow-visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Contenedor principal para el logo */}
      <div className="relative transition-transform duration-300 flex items-center justify-center w-full h-full overflow-visible" 
        style={{
          transform: isHovered ? 'scale(1.03)' : 'scale(1)'
        }}>
        {/* Efecto de brillo suave con degradado - reducido */}
        <div className="absolute inset-0 scale-105 opacity-25" style={{
          background: 'radial-gradient(circle, rgba(96, 200, 255, 0.15) 0%, rgba(189, 79, 255, 0.1) 50%, transparent 90%)',
          filter: 'blur(4px)',
          zIndex: 0
        }} />
        
        {/* Sombras de color múltiples para el logo - más sutiles */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <img 
            src="/images/Logo (1).png" 
            alt="" 
            style={{
              filter: `
                drop-shadow(0 0 1px rgba(96, 200, 255, 0.3))
                drop-shadow(0 0 2px rgba(189, 79, 255, 0.2))
                brightness(1.1)
              `,
              width: '120px',
              height: 'auto',
              objectFit: 'contain',
              transform: 'scale(1.2)'
            }}
          />
        </div>
        
        {/* Logo original con brillo moderado */}
        <img 
          src="/images/Logo (1).png" 
          alt="Tibianity Logo" 
          className="relative z-20"
          style={{
            filter: `brightness(${isHovered ? 1.5 : 1.3})`,
            transition: 'filter 0.3s ease',
            width: '120px',
            height: 'auto',
            objectFit: 'contain',
            transform: 'scale(1.2)'
          }}
        />
        
        {/* Texto de respaldo en caso de que la imagen no cargue */}
        <span className="absolute top-0 left-0 opacity-0 font-bold text-lg text-white">
          Tibianity
        </span>
      </div>
    </Link>
  );
};

/**
 * LoginButton Component - Clean login button with Google OAuth
 */
const LoginButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { user, isAuthenticated, login, logout, error } = useAuth();
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  // Comprobar si el usuario es administrador utilizando la función centralizada
  const isAdmin = user?.isAdmin || (user?.email && isAdminEmail(user.email));
  
  return (
    <div className="relative group">
      <div 
        className={`absolute -inset-[1px] rounded-md transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'linear-gradient(to right, #60c8ff, #bd4fff)',
          borderRadius: '6px',
        }}
      />
      {error && (
        <div className="absolute -bottom-8 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded">
          {error}
        </div>
      )}
      {isAuthenticated ? (
        <div className="flex items-center space-x-2">
          {user?.photos && user.photos.length > 0 && (
            <img 
              src={user.photos[0].value} 
              alt="User Profile" 
              className="w-8 h-8 rounded-full border border-[#2e2e3a]"
            />
          )}
          <div className="flex flex-col">
            <span className="text-xs text-white/70">Bienvenido</span>
            <span className="text-sm text-white">{user?.displayName}</span>
          </div>
          {isAdmin && (
            <Link 
              to="/admin"
              className="font-medium text-sm py-1.5 px-4 rounded-md border border-[#2e2e3a] bg-[#111118]/40 hover:bg-[#111118]/80 transition-all duration-300 relative ml-2"
              aria-label="Admin Dashboard"
            >
              <span className="text-white/90 hover:text-white transition-colors duration-300">Admin</span>
            </Link>
          )}
          <button 
            className="font-medium text-sm py-1.5 px-4 rounded-md border border-[#2e2e3a] bg-[#111118]/40 hover:bg-[#111118]/80 transition-all duration-300 relative ml-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={logout}
            aria-label="Logout"
            tabIndex="0"
          >
            <span className={`transition-colors duration-300 ${isHovered ? 'text-white' : 'text-white/90'}`}>Logout</span>
          </button>
        </div>
      ) : (
        <button 
          className="font-medium text-sm py-1.5 px-4 rounded-md border border-[#2e2e3a] bg-[#111118]/40 hover:bg-[#111118]/80 transition-all duration-300 relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={login}
          aria-label="Login"
          tabIndex="0"
        >
          <span className={`transition-colors duration-300 ${isHovered ? 'text-white' : 'text-white/90'}`}>
            Login con Google
          </span>
        </button>
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
        className="font-medium text-sm py-1.5 px-4 rounded-md border border-[#2e2e3a] bg-[#111118]/40 hover:bg-[#111118]/80 transition-all duration-300 relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={login}
        aria-label="Register account"
        tabIndex="0"
      >
        <span className={`transition-colors duration-300 ${isHovered ? 'text-white' : 'text-white/90'}`}>Register</span>
      </button>
    </div>
  );
};

/**
 * NavLink Component - Individual navigation item
 * @param {NavLinkProps} props - Component props
 */
const NavLink = ({ to, label, activeLink, onSelect, registerRef }) => {
  const isActive = activeLink === to.replace('/', '');
  const linkRef = useRef(null);
  const linkId = to.replace('/', '');
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (linkRef.current) {
      registerRef({ id: linkId || 'home', element: linkRef.current });
    }
  }, [linkId, registerRef]);
  
  const handleClick = (e) => {
    // No prevenimos el evento por defecto para permitir la navegación
    onSelect(linkId || 'home');
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(linkId || 'home');
    }
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  return (
    <div ref={linkRef} className="relative px-1">
      <Link 
        to={to}
        className={`text-sm py-2 px-1.5 transition-all duration-300 ${
          isActive 
            ? 'text-white' 
            : 'text-white/80 hover:text-white'
        }`}
        style={{
          textShadow: isActive ? '0 0 3px rgba(96, 200, 255, 0.4)' : (isHovered ? '0 0 3px rgba(189, 79, 255, 0.3)' : 'none'),
          letterSpacing: '0.02em'
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        tabIndex="0"
        aria-current={isActive ? 'page' : undefined}
        aria-label={`Navegar a ${label}`}
      >
        {label}
      </Link>
    </div>
  );
};

/**
 * Navbar Component - Clean, modern navigation bar
 */
const Navbar = () => {
  const [activeLink, setActiveLink] = useState('');
  const [linkRefs, setLinkRefs] = useState({});
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
    transition: 'none'
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  
  // Detectar la URL actual para activar el enlace correspondiente
  useEffect(() => {
    const path = location.pathname;
    
    // Si estamos en la página principal, no activar ningún enlace
    if (path === '/') {
      setActiveLink('');
      return;
    }
    
    // Extraer la ruta sin la barra inicial
    const routePath = path.replace('/', '');
    
    // Activar el enlace según la ruta actual
    setActiveLink(routePath);
  }, [location]);
  
  /**
   * Navigation links data
   * @type {Array<{id: string, to: string, label: string}>}
   */
  const navLinks = [
    { id: 'news', to: '/news', label: 'News' },
    { id: 'market', to: '/market', label: 'Market' },
    { id: 'lore', to: '/lore', label: 'Lore' },
    { id: 'team', to: '/team', label: 'Team' }
  ];
  
  // Usar useCallback para evitar recrear esta función en cada renderizado
  const registerLinkRef = useCallback((linkData) => {
    setLinkRefs(prev => {
      // Solo actualizar si realmente hay un cambio
      if (prev[linkData.id] === linkData.element) {
        return prev;
      }
      return { ...prev, [linkData.id]: linkData.element };
    });
  }, []);
  
  useEffect(() => {
    // Solo actualizar la posición del indicador cuando tenemos referencias a los enlaces
    if (linkRefs[activeLink] && activeLink !== '') {
      const activeElement = linkRefs[activeLink];
      const { offsetLeft, offsetWidth } = activeElement;
      const targetLeft = offsetLeft + 8;
      const targetWidth = offsetWidth - 16;
      
      // Si no es la primera vez (opacity > 0), ejecutar la animación de transición
      if (indicatorStyle.opacity > 0) {
        // Fase 1: Contraer la línea desde la derecha
        setIsTransitioning(true);
        setIndicatorStyle(prev => ({
          ...prev,
          width: 0,
          // La posición left se mantiene igual (no va al centro)
          transition: 'width 0.2s ease-in-out'
        }));
        
        // Fase 2: Mover la línea (punto) a la nueva posición
        setTimeout(() => {
          setIndicatorStyle(prev => ({
            ...prev,
            left: targetLeft,
            transition: 'left 0.2s ease-in-out'
          }));
          
          // Fase 3: Expandir la línea hacia la derecha
          setTimeout(() => {
            setIndicatorStyle({
              left: targetLeft,
              width: targetWidth,
              opacity: 1,
              transition: 'width 0.2s ease-in-out'
            });
            
            // Finalizar transición
            setTimeout(() => {
              setIsTransitioning(false);
            }, 200);
          }, 200);
        }, 200);
      } else {
        // Primera vez - simplemente mostrar
        setIndicatorStyle({
          left: targetLeft,
          width: targetWidth,
          opacity: 1,
          transition: 'none'
        });
      }
    } else if (activeLink === '') {
      // Si no hay enlace activo, ocultar el indicador
      setIndicatorStyle({
        left: 0,
        width: 0,
        opacity: 0,
        transition: 'opacity 0.3s ease-in-out'
      });
    }
  }, [activeLink, linkRefs, indicatorStyle.opacity]);
  
  const handleLinkSelect = useCallback((linkId) => {
    if (!linkId || isTransitioning) return;
    setActiveLink(linkId);
  }, [isTransitioning]);
  
  return (
    <header className="bg-[#111118] border-b border-[#2e2e3a] shadow-sm" style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(189, 79, 255, 0.1)'}}>
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-20 px-3">
          {/* Contenedor izquierdo - Logo y enlaces */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="flex items-center justify-center w-32 h-full overflow-visible mr-2">
              <Logo />
            </div>
            
            {/* Nav Links */}
            <div className="hidden md:block relative">
              <nav className="flex items-center space-x-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.id}
                    to={link.to}
                    label={link.label}
                    activeLink={activeLink}
                    onSelect={handleLinkSelect}
                    registerRef={registerLinkRef}
                  />
                ))}
              </nav>
              
              {/* Indicador deslizante */}
              <div 
                className="absolute bottom-0 h-[1px] rounded-full"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.opacity,
                  transition: indicatorStyle.transition,
                  background: 'linear-gradient(to right, #60c8ff, #bd4fff)',
                  boxShadow: '0 0 4px rgba(96, 200, 255, 0.4), 0 0 6px rgba(189, 79, 255, 0.3)'
                }}
              />
            </div>
          </div>
          
          {/* Contenedor derecho - Botones */}
          <div className="flex items-center space-x-2 pr-1">
            <LoginButton />
            <ProjectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 
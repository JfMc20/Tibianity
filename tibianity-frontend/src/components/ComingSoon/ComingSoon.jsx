import React, { useState, useEffect, useMemo, useCallback } from 'react'; // Add useMemo and useCallback
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import Particles, { initParticlesEngine } from "@tsparticles/react"; // Revert to the correct import
import { loadFull } from "tsparticles"; // Import the full bundle
import { API_URL } from '../../config/constants'; // CORREGIDO: Importar API_URL en lugar de API_BASE_URL

// --- Particle Background Component ---
const ParticleBackground = React.memo(({ options, onLoaded }) => {
  const [init, setInit] = useState(false);

  // Initialize particles engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []); // Empty dependency array ensures this runs only once

  if (!init) {
    return null; // Don't render anything until initialized
  }

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={onLoaded}
      options={options}
      // Apply styles directly for absolute positioning and z-index
      // Make sure it covers the entire container and stays behind
      className="absolute inset-0 z-0" 
    />
  );
});

// Social Icon component (similar to Footer.jsx)
const SocialIcon = ({ platform, href, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = {
    Discord: '#5865F2',
    Twitter: '#1DA1F2',
    Instagram: '#E1306C',
    Facebook: '#1877F2'
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative block"
      aria-label={platform}
    >
      <div
        className={`p-2 rounded-full transition-all duration-300 ${isHovered ? 'bg-white/10' : 'bg-white/5'}`}
        style={{
          // Slightly less prominent shadow for this context
          boxShadow: isHovered ? `0 0 6px ${colors[platform]}40` : 'none', 
          color: isHovered ? colors[platform] : 'rgba(255, 255, 255, 0.7)'
        }}
      >
        {children}
      </div>
    </a>
  );
};

// Remove isAuthenticated and error from props, as we'll get them from the context
const ComingSoon = () => {
  // Get state and functions from context
  const { isAuthenticated, error: authError, login, logout } = useAuth();

  // Estados para el formulario de suscripción
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeError, setSubscribeError] = useState('');

  // Keep the memoized callbacks/options here as they are passed down
  const particlesLoaded = useCallback((container) => {
    console.log("Particles container loaded", container);
  }, []);

  const particleOptions = useMemo(() => ({
    background: {
      color: {
        value: 'transparent', // Use the main div's background
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: false, // Disable hover effects
        },
        onClick: {
          enable: false, // Disable click effects
        },
      },
    },
    particles: {
      color: {
        value: ['#ffffff', '#60c8ff'], // White and light blue particles
      },
      links: {
        enable: false, // Disable links between particles
      },
      move: {
        direction: 'bottom',
        enable: true,
        outModes: {
          default: 'out', // Particles disappear when they go off screen
        },
        random: true, // Add slight randomness to direction
        speed: 0.8, // Slow speed
        straight: false, // Not perfectly straight lines
      },
      number: {
        density: {
          enable: true,
        },
        value: 180, // Increased number of particles from 100 to 180
      },
      opacity: {
        value: { min: 0.1, max: 0.4 }, // Low opacity
        animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.1,
            sync: false
        }
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 }, // Small size
      },
    },
    detectRetina: true,
    fullScreen: { // Ensure particles are behind everything
        enable: true,
        zIndex: 0
    }
  }), []);

  // Función para manejar el envío del formulario de suscripción
  const handleSubscribe = async (event) => {
    event.preventDefault(); // Prevenir recarga de página
    setIsSubscribing(true);
    setSubscribeMessage('');
    setSubscribeError('');

    try {
      const response = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si la respuesta no es OK (4xx, 5xx), lanzar un error con el mensaje del backend
        throw new Error(data.message || `Error: ${response.status}`);
      }

      // Éxito (200 o 201)
      setSubscribeMessage(data.message); // Mensaje de éxito o "Ya estás suscrito."
      setEmail(''); // Limpiar input

    } catch (err) {
      console.error("Error en suscripción:", err);
      // Asegurarse de que err.message sea un string
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
      setSubscribeError(errorMessage);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    // Main container to center the box vertically and horizontally - added relative positioning
    <div className="relative flex items-center justify-center min-h-screen bg-[#060919] text-white p-4 overflow-hidden">
      {/* Particle Background - Render the new component */}
      <ParticleBackground options={particleOptions} onLoaded={particlesLoaded} />

      {/* Wrapper for gradient border effect */}
      <div className="relative max-w-lg md:max-w-xl lg:max-w-2xl w-full z-10"> {/* Added responsive max-width */}
          {/* Subtle gradient border (always visible but slightly more intense on hover) - Added group here and changed group-hover to hover */}
          <div 
            className="group absolute -inset-[1px] rounded-lg opacity-60 hover:opacity-80 transition-opacity duration-300 blur-[1px]"
            style={{
              background: 'linear-gradient(to right, #60c8ff, #bd4fff)',
              borderRadius: '0.75rem', // Match outer rounding if different
            }}
          />

          {/* Centered content box - Now uses relative z-10 to sit above the border */}
          <div className="relative z-10 bg-[#1a1d2e] rounded-lg shadow-xl p-6 sm:p-8 md:p-12 w-full flex flex-col items-center text-center">

            {/* Logo Centered Above Title - REMOVED */}
            {/* 
            <img
              src="/images/Logo Escudo (1).webp" // Updated logo source
              alt="Tibianity Logo"
              // Centered, adjusted size, added bottom margin
              className="w-20 md:w-40 filter drop-shadow-lg mb-2" 
              style={{ filter: 'brightness(1.3) drop-shadow(0 0 8px rgba(96, 200, 255, 0.4))' }} 
              loading="lazy" 
            />
            */}
            
            {/* Website Name (Centered below logo) - REVERTED to original structure */}
            <span 
              className="text-5xl font-semibold text-white font-sans mb-6 drop-shadow-md" // Increased size to 5xl
            >
              Tibianity
            </span>

            {/* Show styled "¡Próximamente!" only if NOT authenticated */}
            {/* Hide H1 entirely if authenticated */} 
            {!isAuthenticated && (
              <div className="relative inline-block mb-8"> 
                <h1 className="text-4xl md:text-5xl font-bold mb-1"> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60c8ff] to-[#bd4fff]">
                    ¡Próximamente!
                  </span>
                </h1>
                {/* Added decorative lines */}
                <div className="absolute -bottom-1 left-0 h-[2px] w-1/3 bg-gradient-to-r from-[#60c8ff] to-transparent" />
                <div className="absolute -bottom-1 right-0 h-[2px] w-1/3 bg-gradient-to-l from-[#bd4fff] to-transparent" />
              </div>
            )}
            
            {/* Error message (if it exists) */}
            {authError && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded relative mb-4 w-full" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">
                  {typeof authError === 'string' ? authError : 'Ha ocurrido un problema al contactar el servidor.'}
                </span>
              </div>
            )}

            {/* Descriptive text */}
            <p className="text-gray-400 mb-6 text-sm md:text-base font-semibold">
              {isAuthenticated
                ? 'Tu cuenta está autenticada. El acceso completo se habilitará pronto.'
                : 'Estamos preparando algo increíble. Sumérgete en una nueva aventura en el mundo de Tibianity. Vuelve pronto para explorar como nunca antes.'
              }
            </p>

            {/* Subscription Section (Only if not authenticated) */}
            {!isAuthenticated && (
              <>
                <p className="text-gray-300 mb-4 text-sm md:text-base font-semibold">
                  Sé el primero en enterarte de nuestro lanzamiento:
                </p>
                {/* Formulario de suscripción actualizado */}
                <form className="w-full max-w-sm flex flex-col gap-3 mb-2" onSubmit={handleSubscribe}> {/* Reducido mb y añadido onSubmit */}
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    className={`flex-grow px-4 py-2 rounded-md bg-gray-800/30 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 ${isSubscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label="Correo electrónico para suscripción"
                    value={email} // Conectar al estado
                    onChange={(e) => setEmail(e.target.value)} // Actualizar estado
                    disabled={isSubscribing} // Deshabilitar mientras carga
                    required // Añadir validación HTML básica
                  />
                  <button
                    type="submit"
                    className={`text-white font-medium py-2 px-6 rounded-md transition-all duration-300 whitespace-nowrap bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/30 ${isSubscribing ? 'opacity-50 cursor-not-allowed hover:from-blue-500 hover:to-purple-600 hover:shadow-none' : 'opacity-75 hover:opacity-100'}`}
                    disabled={isSubscribing} // Deshabilitar mientras carga
                  >
                    {isSubscribing ? 'Suscribiendo...' : 'Suscribirse'}
                  </button>
                </form>

                {/* Mensajes de feedback del formulario de suscripción */} 
                <div className="h-6 mb-4 w-full max-w-sm text-center"> {/* Contenedor para mensajes con altura fija */}
                    {subscribeMessage && (
                        <p className="text-sm text-green-400">{subscribeMessage}</p>
                    )}
                    {subscribeError && (
                        <p className="text-sm text-red-400">{subscribeError}</p>
                    )}
                </div>
              </>
            )}

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <SocialIcon platform="Facebook" href="https://www.facebook.com/Josemitibiacoins"> {/* Updated Facebook link */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </SocialIcon>
              <SocialIcon platform="Twitter" href="https://twitter.com/tibianity">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                   <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                 </svg>
              </SocialIcon>
               <SocialIcon platform="Instagram" href="https://www.instagram.com/josecabezass/"> {/* Updated Instagram link */}
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                   <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                 </svg>
              </SocialIcon>
              <SocialIcon platform="Discord" href="https://discord.gg/ZctNxqJg"> {/* Updated Discord invite link */}
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                   <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.885-.608 1.28a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.28.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.49a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.3 13.3 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
                 </svg>
              </SocialIcon>
            </div>

            {/* Login/Logout button at the bottom */}
            {isAuthenticated ? (
              // Logout Button - Apply same style structure as Login Button
              <div className="relative group w-full max-w-sm"> 
                 {/* Copied subtle glow effect from Login Button */}
                 <div 
                   className="absolute -inset-0.5 rounded-lg blur opacity-0 group-hover:opacity-40 transition duration-300"
                   style={{
                     background: 'linear-gradient(to right, #60c8ff, #bd4fff)'
                   }}
                 />
                 <button
                  onClick={logout} // Use the logout function from context
                  // Apply same classes as Login button
                  className="relative w-full font-medium text-sm py-2.5 px-6 rounded-md border border-gray-600 hover:border-gray-500 bg-[#111118]/60 hover:bg-[#111118]/80 transition-all duration-300"
                  aria-label="Cerrar Sesión"
                 >
                  {/* Apply same text classes as Login button */}
                  <span className="text-white/80 group-hover:text-white transition-colors duration-300">
                    Cerrar Sesión
                  </span>
                </button>
              </div>
            ) : (
              // Login Button (less prominent now) - Hover effect now self-contained due to its own group class
               <div className="relative group w-full max-w-sm"> 
                {/* Optional subtle glow on hover for login */}
                <div 
                  className="absolute -inset-0.5 rounded-lg blur opacity-0 group-hover:opacity-40 transition duration-300"
                  style={{
                    background: 'linear-gradient(to right, #60c8ff, #bd4fff)'
                  }}
                />
                <button
                  onClick={login} // Use the login function from context
                  className="relative w-full font-medium text-sm py-2.5 px-6 rounded-md border border-gray-600 hover:border-gray-500 bg-[#111118]/60 hover:bg-[#111118]/80 transition-all duration-300"
                  aria-label="Login con Google"
                >
                  <span className="text-white/80 group-hover:text-white transition-colors duration-300">
                    Iniciar sesión con Google
                  </span>
                </button>
              </div>
            )}
             
          </div> {/* End of centered content box */}
      </div> {/* End of wrapper for border */}

    </div> // End of main container
  );
};

export default ComingSoon; 
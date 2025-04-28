import React, { useState, useEffect } from 'react'; // Removed unused useCallback
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import Particles, { initParticlesEngine } from "@tsparticles/react"; // Revert to the correct import
import { loadFull } from "tsparticles"; // Import the full bundle

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
        className={`p-2 rounded-full transition-all duration-300 ${
          isHovered ? 'bg-white/10' : 'bg-white/5'
        }`}
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
  const { isAuthenticated, error, login, logout } = useAuth();
  const [init, setInit] = useState(false);

  // Initialize particles engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log("Particles container loaded", container);
  };

  // Particle configuration options for subtle falling effect
  const particleOptions = {
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
        value: 100, // Increased number of particles from 60
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
  };

  return (
    // Main container to center the box vertically and horizontally - added relative positioning
    <div className="relative flex items-center justify-center min-h-screen bg-[#060919] text-white p-4 overflow-hidden">
      {/* Particle Background - Renders only after init */}
      {init && (
         <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={particleOptions}
         />
       )}

      {/* Wrapper for gradient border effect - Removed top-level group */}
      <div className="relative max-w-lg w-full z-10"> {/* Ensure this is above particles */}
          {/* Subtle gradient border (always visible but slightly more intense on hover) - Added group here and changed group-hover to hover */}
          <div 
            className="group absolute -inset-[1px] rounded-lg opacity-60 hover:opacity-80 transition-opacity duration-300 blur-[1px]"
            style={{
              background: 'linear-gradient(to right, #60c8ff, #bd4fff)',
              borderRadius: '0.75rem', // Match outer rounding if different
            }}
          />

          {/* Centered content box - Now uses relative z-10 to sit above the border */}
          <div className="relative z-10 bg-[#1a1d2e] rounded-lg shadow-xl p-8 md:p-12 w-full flex flex-col items-center text-center">

            {/* Logo Centered Above Title */}
            <img
              src="/images/Logo Escudo (1).webp" // Updated logo source
              alt="Tibianity Logo"
              // Centered, adjusted size, added bottom margin
              className="w-20 md:w-40 filter drop-shadow-lg mb-2" 
              style={{ filter: 'brightness(1.3) drop-shadow(0 0 8px rgba(96, 200, 255, 0.4))' }} 
              loading="lazy" 
            />
            
            {/* Website Name (Centered below logo) */}
            <span 
              className="text-4xl font-bold text-white font-sans mb-6" // Kept size, added bottom margin
              style={{ textShadow: '0 0 8px rgba(96, 200, 255, 0.4)' }} 
            >
              Tibianity
            </span>

            {/* "Coming Soon" Title or Tibianity if logged in */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
               {isAuthenticated ? 'Tibianity' : (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse">
                    ¡Próximamente!
                  </span>
               )}
            </h1>
            
            {/* Error message (if it exists) */}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded relative mb-4 w-full" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">
                  {typeof error === 'string' ? error : 'Ha ocurrido un problema al contactar el servidor.'}
                </span>
              </div>
            )}

            {/* Descriptive text */}
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              {isAuthenticated
                ? 'Tu cuenta está autenticada. El acceso completo se habilitará pronto.'
                : 'Estamos preparando algo increíble. Sumérgete en una nueva aventura en el mundo de Tibianity. Vuelve pronto para explorar como nunca antes.'
              }
            </p>

            {/* Subscription Section (Only if not authenticated) */}
            {!isAuthenticated && (
              <>
                <p className="text-gray-300 mb-4 text-sm md:text-base">
                  Sé el primero en enterarte de nuestro lanzamiento:
                </p>
                {/* Simple Form - no actual submission logic */}
                <form className="w-full max-w-sm flex flex-col sm:flex-row gap-3 mb-6">
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    className="flex-grow px-4 py-2 rounded-md bg-gray-700/50 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    aria-label="Correo electrónico para suscripción"
                  />
                  {/* Updated Subscribe Button Style */}
                  <button
                    type="submit"
                    className="text-white font-medium py-2 px-6 rounded-md transition-all duration-300 whitespace-nowrap bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/30 opacity-75 hover:opacity-100"
                  >
                    Suscribirse
                  </button>
                </form>
              </>
            )}

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <SocialIcon platform="Facebook" href="https://facebook.com/tibianity">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </SocialIcon>
              <SocialIcon platform="Twitter" href="https://twitter.com/tibianity">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                   <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                 </svg>
              </SocialIcon>
               <SocialIcon platform="Instagram" href="https://instagram.com/tibianity">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                   <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                 </svg>
              </SocialIcon>
              <SocialIcon platform="Discord" href="https://discord.gg/yourinvitecode"> {/* Update Discord invite link */}
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                   <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.885-.608 1.28a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.28.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.49a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.3 13.3 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
                 </svg>
              </SocialIcon>
            </div>

            {/* Login/Logout button at the bottom */}
            {isAuthenticated ? (
              // Logout Button
              <div className="relative group w-full max-w-sm"> 
                 <div 
                  className="absolute -inset-1 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300 bg-gradient-to-r from-red-500 to-orange-500" // Different gradient for logout
                 />
                 <button
                  onClick={logout} // Use the logout function from context
                  className="relative w-full font-medium text-sm py-2.5 px-6 rounded-md border border-gray-600 hover:border-gray-500 bg-[#111118]/80 hover:bg-[#111118]/90 transition-all duration-300"
                  aria-label="Cerrar Sesión"
                 >
                  <span className="text-white/90 group-hover:text-white transition-colors duration-300">
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

      {/* Re-added Illustration - Positioned behind content box */}
      <div className="absolute bottom-0 right-0 w-1/2 md:w-1/3 max-w-[350px] p-4 z-0 opacity-50 pointer-events-none filter drop-shadow-lg"> {/* Increased opacity, added drop-shadow */}
         <img
           src="/images/JosemiYSancocho.webp" // Illustration source
           alt="" // Decorative, alt text can be empty
           className="w-full h-auto object-contain"
           loading="lazy"
         />
      </div>

    </div> // End of main container
  );
};

export default ComingSoon; 
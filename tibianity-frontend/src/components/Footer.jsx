import React, { useState } from 'react';

/**
 * Footer Component - Diseño moderno que coincide con el navbar
 */
const Footer = () => {
  return (
    <footer className="bg-[#111118] border-t border-[#2e2e3a] mt-auto" style={{boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.5), 0 -1px 3px rgba(189, 79, 255, 0.1)'}}>
      {/* Contenido principal del footer */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Logo e información */}
          <div className="col-span-1 md:col-span-1">
            <FooterLogo />
            <p className="text-white/60 text-sm mt-4">
              Tu aventura comienza aquí. Explora el mundo de Tibianity y descubre todo lo que tenemos para ofrecer.
            </p>
          </div>
          
          {/* Columna 2: Enlaces rápidos */}
          <div className="col-span-1">
            <h4 className="text-white font-medium mb-4 text-lg">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              {['Inicio', 'Noticias', 'Tienda', 'Registro', 'Login'].map((item) => (
                <FooterLink key={item} href={`/${item.toLowerCase()}`} label={item} />
              ))}
            </ul>
          </div>
          
          {/* Columna 3: Recursos */}
          <div className="col-span-1">
            <h4 className="text-white font-medium mb-4 text-lg">Recursos</h4>
            <ul className="space-y-2">
              {['Guías', 'Foro', 'Soporte', 'Eventos', 'Calendario'].map((item) => (
                <FooterLink key={item} href={`/${item.toLowerCase()}`} label={item} />
              ))}
            </ul>
          </div>
          
          {/* Columna 4: Contáctanos */}
          <div className="col-span-1">
            <h4 className="text-white font-medium mb-4 text-lg">Contáctanos</h4>
            <div className="space-y-2">
              <p className="text-white/60 text-sm">info@tibianity.com</p>
              <div className="flex space-x-3 mt-4">
                {['Discord', 'Twitter', 'Instagram', 'Facebook'].map((platform) => (
                  <SocialIcon key={platform} platform={platform} />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Línea divisoria con gradiente */}
        <div className="h-px w-full mt-8 mb-6" style={{
          background: 'linear-gradient(to right, #60c8ff, #bd4fff, #60c8ff)',
          boxShadow: '0 0 8px rgba(96, 200, 255, 0.4), 0 0 12px rgba(189, 79, 255, 0.3)'
        }}></div>
        
        {/* Copyright y enlaces legales */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Tibianity. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {['Términos de Servicio', 'Política de Privacidad'].map((item) => (
              <a key={item} href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-white/50 text-xs hover:text-white/80 transition-colors duration-300">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

/**
 * Logo del Footer - Versión más simple del logo principal
 */
const FooterLogo = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <a 
      href="/"
      className="inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative transition-transform duration-300" 
        style={{
          transform: isHovered ? 'scale(1.03)' : 'scale(1)'
        }}>
        {/* Efecto de brillo sutil */}
        <div className="absolute inset-0 scale-105 opacity-25" style={{
          background: 'radial-gradient(circle, rgba(96, 200, 255, 0.15) 0%, rgba(189, 79, 255, 0.1) 50%, transparent 90%)',
          filter: 'blur(4px)',
          zIndex: 0
        }} />
        
        {/* Logo con brillo moderado */}
        <img 
          src="/images/Logo (1).png" 
          alt="Tibianity Logo" 
          className="relative z-20 w-24"
          style={{
            filter: `brightness(${isHovered ? 1.5 : 1.2})`,
            transition: 'filter 0.3s ease'
          }}
        />
      </div>
    </a>
  );
};

/**
 * FooterLink - Enlaces del footer con efecto hover
 */
const FooterLink = ({ href, label }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <li>
      <a 
        href={href}
        className="text-white/70 text-sm hover:text-white transition-colors duration-300"
        style={{
          textShadow: isHovered ? '0 0 3px rgba(96, 200, 255, 0.4)' : 'none'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {label}
      </a>
    </li>
  );
};

/**
 * SocialIcon - Iconos de redes sociales con efectos hover
 */
const SocialIcon = ({ platform }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Mapeo de plataformas a SVGs
  const iconMap = {
    Discord: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.885-.608 1.28a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.28.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.49a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.3 13.3 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
      </svg>
    ),
    Twitter: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    Instagram: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    Facebook: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  };
  
  // Colores para cada plataforma
  const colors = {
    Discord: '#5865F2',
    Twitter: '#1DA1F2',
    Instagram: '#E1306C',
    Facebook: '#1877F2'
  };
  
  return (
    <a 
      href={`https://${platform.toLowerCase()}.com/tibianity`} 
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative block"
    >
      <div 
        className={`p-2 rounded-full transition-all duration-300 ${
          isHovered ? 'bg-white/10' : 'bg-white/5'
        }`}
        style={{
          boxShadow: isHovered ? `0 0 8px ${colors[platform]}50` : 'none',
          color: isHovered ? colors[platform] : 'rgba(255, 255, 255, 0.7)'
        }}
      >
        {iconMap[platform]}
      </div>
    </a>
  );
};

export default Footer; 
import React, { useState, useEffect } from 'react';

/**
 * Hero Section Component
 */
const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Información para los slides del carrusel
  const slides = [
    {
      id: 0,
      image: "/images/hero2.png",
      alt: "Paisaje de Tibia - Aventura",
      title: "Tu Aventura Comienza Aquí",
      description: "Explora secretos, lucha por gloria y acumula Tibiacoins"
    },
    {
      id: 1,
      image: "/images/hero2.png", // TODO: Reemplazar con la segunda ilustración cuando esté disponible
      alt: "Paisaje de Tibia - Objetos",
      title: "Objetos Exclusivos",
      description: "Potencia tu personaje con items extraordinarios"
    },
    {
      id: 2,
      image: "/images/hero2.png", // TODO: Reemplazar con la tercera ilustración cuando esté disponible
      alt: "Paisaje de Tibia - Comunidad",
      title: "Únete a la Comunidad",
      description: "Conéctate con jugadores de todo el mundo"
    }
  ];
  
  // Efecto para cambiar automáticamente los slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Cambiar cada 3 segundos
    
    return () => clearInterval(interval);
  }, [slides.length]);
  
  return (
    <section className="py-10 px-4 md:py-16 relative">
      <div className="max-w-7xl mx-auto">
        {/* Título centrado mejorado */}
        <div className="text-center mb-8">
          <h1 className="relative inline-block">
            <span className="text-4xl md:text-5xl font-bold text-white block mb-3">Explora Tibia</span>
            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#60c8ff] to-[#bd4fff] bg-clip-text text-transparent block">como nunca antes</span>
            <div className="absolute -bottom-2 left-0 h-[2px] w-1/3 bg-gradient-to-r from-[#60c8ff] to-transparent"></div>
            <div className="absolute -bottom-2 right-0 h-[2px] w-1/3 bg-gradient-to-l from-[#bd4fff] to-transparent"></div>
          </h1>
        </div>
        
        {/* Estilos para animaciones del título */}
        <style jsx="true">{`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          .animated-title {
            animation: fadeIn 0.8s ease-out both;
          }
          
          .text-shimmer {
            background: linear-gradient(90deg, 
              rgba(0, 224, 255, 0.8) 0%, 
              rgba(0, 255, 240, 1) 50%, 
              rgba(0, 224, 255, 0.8) 100%);
            background-size: 200% auto;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            animation: shimmer 3s linear infinite;
            text-shadow: 0 0 10px rgba(0, 224, 255, 0.5),
                         0 0 20px rgba(0, 224, 255, 0.3),
                         0 0 30px rgba(0, 224, 255, 0.2);
          }
          
          .glow-effect {
            position: relative;
          }
          
          .glow-effect::before {
            content: "";
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            z-index: -1;
            background: linear-gradient(45deg, #00E0FF, #0066ff, #00E0FF);
            filter: blur(10px);
            opacity: 0.7;
            animation: glowing 3s ease-in-out infinite alternate;
            border-radius: 10px;
          }
          
          @keyframes glowing {
            0% { opacity: 0.5; filter: blur(10px); }
            100% { opacity: 0.8; filter: blur(15px); }
          }
        `}</style>
        
        {/* Contenedor principal con borde siempre activo */}
        <div className="relative mb-4 mx-auto" style={{ maxWidth: '1100px' }}>
          {/* Borde con gradiente siempre visible */}
          <div 
            className="absolute -inset-[1px] rounded-lg"
            style={{
              background: 'linear-gradient(to right, #60c8ff, #bd4fff)',
              borderRadius: '0.5rem',
            }}
          />
          
          {/* Contenedor principal - más rectangular */}
          <div 
            className="border border-transparent rounded-lg p-0 flex flex-col items-center justify-center bg-[#111118]/70 relative z-10 overflow-hidden"
            style={{ 
              width: '100%',
              height: '0',
              paddingBottom: '40%', /* Relación 5:2 (más rectangular que antes) */
              position: 'relative'
            }}
          >
            {/* Imágenes del carrusel - Una por cada slide */}
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                  activeSlide === index ? 'opacity-100 z-10' : 'opacity-0'
                }`}
              >
                <img 
                  src={slide.image} 
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
            
            {/* Título mejorado con animaciones */}
            <div className="absolute inset-0 flex items-start justify-center z-20 pt-10 md:pt-14">
              <div className="px-5 py-4 rounded-lg bg-[#0a1a2a]/40 backdrop-blur-sm max-w-md text-center animated-title border border-[#00E0FF]/40 glow-effect">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 relative">
                  <span className="text-shimmer">{slides[activeSlide].title}</span>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-[1px] w-2/3 bg-gradient-to-r from-transparent via-[#00E0FF] to-transparent"></div>
                </h3>
                <p className="text-[#00E0FF]/90 text-lg leading-relaxed">
                  {slides[activeSlide].description}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Puntos del carrusel más cercanos al contenedor */}
        <div className="flex justify-center mt-2">
          <div className="flex space-x-4">
            {/* Renderizar los puntos del carrusel */}
            {slides.map((slide) => (
              <div 
                key={slide.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeSlide === slide.id 
                    ? 'bg-white scale-125' 
                    : 'bg-white/30'
                }`}
                onClick={() => setActiveSlide(slide.id)}
                style={{
                  boxShadow: activeSlide === slide.id ? '0 0 5px rgba(255, 255, 255, 0.8)' : 'none',
                  cursor: 'pointer'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 
import React, { useState, useEffect } from 'react';

/**
 * Services Section Component con grid adaptativo
 */
const Services = () => {
  const [newsActiveSlide, setNewsActiveSlide] = useState(0);
  
  // Datos de ejemplo para las noticias
  const newsItems = [
    {
      id: 1,
      title: 'Nueva actualización disponible',
      summary: 'Descubre todas las nuevas características y mejoras en la última versión del bot.',
      date: '10/05/2023',
      image: '/images/news-1.jpg' // Ruta de ejemplo
    },
    {
      id: 2,
      title: 'Eventos especiales de verano',
      summary: 'Participa en nuestros eventos especiales y consigue recompensas exclusivas durante este verano.',
      date: '02/05/2023',
      image: '/images/news-2.jpg' // Ruta de ejemplo
    }
  ];

  // Imágenes para destacados con información para el reverso
  const imageSlides = [
    {
      id: 0,
      image: "/images/hero2.png",
      alt: "Imagen destacada 1",
      title: "Objetos Premium",
      backTitle: "Ventajas Premium",
      description: "Potencia tu personaje con objetos exclusivos que solo encontrarás en Tibianity.",
      features: ["Estadísticas mejoradas", "Aspecto único", "Habilidades especiales"],
      linkText: "Ver catálogo premium",
      linkUrl: "/premium-catalog"
    },
    {
      id: 1,
      image: "/images/hero2.png",
      alt: "Imagen destacada 2",
      title: "Nuevos Personajes",
      backTitle: "Personajes Exclusivos",
      description: "Desbloquea personajes con habilidades únicas y características excepcionales.",
      features: ["Clases especiales", "Progresión única", "Apariencia personalizada"],
      linkText: "Explorar personajes",
      linkUrl: "/characters"
    },
    {
      id: 2,
      image: "/images/hero2.png",
      alt: "Imagen destacada 3",
      title: "Eventos Especiales",
      backTitle: "Próximos Eventos",
      description: "Participa en eventos temporales con recompensas únicas y experiencias inmersivas.",
      features: ["Misiones exclusivas", "Tesoros limitados", "Competiciones PvP"],
      linkText: "Calendario de eventos",
      linkUrl: "/events-calendar"
    }
  ];

  // Características principales
  const features = [
    {
      id: 1,
      title: "Rapidez de Respuesta",
      description: "Nuestros servicios ofrecen respuestas rápidas y eficientes para optimizar tu experiencia de juego en todo momento.",
      position: "left",
      color: "from-[#60c8ff]/30 to-[#60c8ff]/10"
    },
    {
      id: 2,
      title: "Soporte Personalizado",
      description: "Atención personalizada 24/7 para todos tus requerimientos técnicos y consultas sobre el juego.",
      position: "right",
      color: "from-[#bd4fff]/30 to-[#bd4fff]/10"
    },
    {
      id: 3,
      title: "Actualizaciones Constantes",
      description: "Nuevas funcionalidades y mejoras frecuentes para mantener tu experiencia fresca y actualizada.",
      position: "left",
      color: "from-[#60c8ff]/30 to-[#60c8ff]/10"
    },
    {
      id: 4,
      title: "Seguridad Garantizada",
      description: "Protección total para tus datos y transacciones con cifrado de nivel bancario.",
      position: "right",
      color: "from-[#bd4fff]/30 to-[#bd4fff]/10"
    }
  ];

  // Efecto para cambiar automáticamente los slides de noticias
  useEffect(() => {
    const interval = setInterval(() => {
      setNewsActiveSlide((prev) => (prev + 1) % newsItems.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [newsItems.length]);

  return (
    <section className="pt-0 pb-8 px-3 sm:px-4 relative">
      {/* Estilos para la animación de flip card */}
      <style dangerouslySetInnerHTML={{__html: `
        .flip-card {
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: inherit;
          overflow: hidden;
        }
        
        .flip-card-back {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          background-color: #0a1a2a;
          padding: 0.75rem;
          text-align: left;
          width: 100%;
          height: 100%;
          position: absolute;
          backface-visibility: hidden;
          transform: rotateY(180deg);
          border-radius: 0.5rem;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
        
        .flip-card-back h4 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .flip-card-back p {
          font-size: 0.75rem;
          line-height: 1.2;
          margin-bottom: 0.5rem;
        }
        
        .progress-line {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          background: linear-gradient(to right, #60c8ff, #bd4fff);
          transform-origin: left;
          transform: scaleX(0);
          transition: transform 0.3s ease-out;
        }
        
        .flip-card:hover .progress-line {
          transform: scaleX(1);
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
        }
        
        .feature-item::before {
          content: "";
          display: inline-block;
          width: 4px;
          height: 4px;
          margin-right: 6px;
          background-color: #00E0FF;
          border-radius: 50%;
        }
      `}} />
      
      {/* Fondo con estilo diferente al Hero */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#60c8ff] rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-40 -right-20 w-72 h-72 bg-[#bd4fff] rounded-full filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Layout moderno y diferenciado */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          
          {/* Noticias con estilo de tarjetas - Ahora primero */}
          <div>
            <div className="rounded-2xl sm:rounded-xl bg-gradient-to-r from-[#0a1a2a]/80 to-[#111625]/80 backdrop-blur-sm p-5 sm:p-5 shadow-lg shadow-[#bd4fff]/5">
              <div className="flex flex-wrap items-center justify-between mb-5 sm:mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-6 bg-[#bd4fff] rounded-full"></div>
                  <h3 className="text-xl text-white font-semibold">Últimas Noticias</h3>
                </div>
                <a href="/news" className="text-[#bd4fff] hover:text-[#d186ff] transition-all text-sm flex items-center group mt-1 md:mt-0">
                  Ver todas 
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
              
              {/* Grid de noticias moderno */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-4">
                {newsItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`relative overflow-hidden rounded-2xl sm:rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${
                      index === newsActiveSlide ? 'ring-2 ring-[#00E0FF]/30' : ''
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#131b29] to-[#0d141e] opacity-90"></div>
                    <div className="relative p-5 sm:p-4 z-10">
                      <h4 className="text-white font-medium mb-3 sm:mb-2 text-lg">{item.title}</h4>
                      <p className="text-white/70 text-sm mb-4 sm:mb-3">{item.summary}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#60c8ff] text-xs bg-[#60c8ff]/10 px-3 py-1 rounded-full">{item.date}</span>
                        <a href={`/news/${item.id}`} className="text-[#bd4fff] hover:text-[#d186ff] text-sm flex items-center">
                          Leer más
                          <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Panel destacados con efecto especial - Ahora segundo */}
          <div>
            <div className="rounded-2xl sm:rounded-xl bg-gradient-to-r from-[#0a1a2a]/80 to-[#111625]/80 backdrop-blur-sm p-5 sm:p-5 shadow-lg shadow-[#bd4fff]/5">
              <div className="flex items-center space-x-2 mb-5">
                <div className="bg-[#00E0FF] w-1 h-6 rounded-full"></div>
                <h3 className="text-xl text-white font-semibold">Destacados</h3>
              </div>
              
              {/* Galería de elementos destacados con flip card */}
              <div className="grid grid-cols-1 gap-5 sm:gap-3 md:grid-cols-3">
                {imageSlides.map((slide) => (
                  <div 
                    key={slide.id}
                    className="flip-card h-[200px] sm:h-[180px] rounded-2xl sm:rounded-lg"
                  >
                    <div className="flip-card-inner">
                      {/* Cara frontal de la tarjeta */}
                      <div className="flip-card-front">
                        <img 
                          src={slide.image} 
                          alt={slide.alt}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        {/* Overlay con gradiente y título */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a2a]/90 to-[#0a1a2a]/20 flex flex-col justify-end p-4 sm:p-3">
                          <h4 className="text-[#00E0FF] font-medium text-center text-lg">{slide.title}</h4>
                          <div className="progress-line w-full"></div>
                        </div>
                      </div>
                      
                      {/* Cara trasera de la tarjeta */}
                      <div className="flip-card-back">
                        <h4 className="text-[#00E0FF] font-bold text-[13px] mb-1">{slide.backTitle}</h4>
                        <p className="text-white/80 text-[10px] mb-1">{slide.description}</p>
                        
                        <div className="w-full text-left mb-1">
                          {slide.features.map((feature, idx) => (
                            <div key={idx} className="feature-item">
                              <span className="text-white/90 text-[9px]">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <a 
                          href={slide.linkUrl} 
                          className="mt-auto py-1 px-3 text-[#60c8ff] text-[10px] bg-[#60c8ff]/10 rounded-full hover:bg-[#60c8ff]/20 transition-colors"
                        >
                          {slide.linkText}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Características con diseño de tarjeta */}
          <div className="mt-2">
            <div className="rounded-2xl sm:rounded-xl bg-gradient-to-r from-[#0a1a2a]/80 to-[#111625]/80 backdrop-blur-sm p-5 shadow-lg">
              <div className="flex items-center space-x-2 mb-5">
                <div className="w-1 h-6 bg-[#60c8ff] rounded-full"></div>
                <h3 className="text-xl text-white font-semibold">Características Principales</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div 
                    key={feature.id} 
                    className="bg-[#070d14]/90 border border-[#111625]/80 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#60c8ff]/10 hover:-translate-y-1"
                  >
                    <div className="flex items-start">
                      <div className={`p-3 rounded-xl mr-4 bg-gradient-to-r ${feature.color} shadow-md w-10 h-10`}>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-lg mb-2">{feature.title}</h4>
                        <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>

                    <div className="mt-3 w-full h-1 rounded-full overflow-hidden bg-[#111625]/80">
                      <div className={`h-full rounded-full bg-gradient-to-r ${feature.position === "left" ? "from-[#60c8ff] to-[#3182ce]" : "from-[#bd4fff] to-[#8b5cf6]"}`} style={{width: '60%'}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services; 
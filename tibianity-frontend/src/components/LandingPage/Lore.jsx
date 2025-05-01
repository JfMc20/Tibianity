import React, { useState } from 'react';

/**
 * Componente Lore - Muestra una introducción a la historia del mundo de Tibianity
 */
const Lore = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Historia breve para la introducción
  const loreIntro = {
    title: "El Mundo de Tibianity",
    subtitle: "Una historia de magia, aventura y poder",
    paragraphs: [
      "En los albores del tiempo, cuando las estrellas aún eran jóvenes, los antiguos dioses forjaron el mundo de Tibianity. Un reino donde la magia fluye como ríos de luz entre montañas de cristal y bosques milenarios.",
      "Cuatro reinos se disputan el control de las tierras ancestrales, cada uno con sus propias tradiciones, habilidades y ambiciones. Los humanos de Thais, los elfos de Carlin, los enanos de Kazordoon y los misteriosos habitantes de Ab'Dendriel."
    ],
    quote: "Viajero, tu destino te espera en las tierras de Tibianity. ¿Te atreverás a escribir tu propia leyenda?",
    image: "/images/hero2.png" // Puedes cambiar esto por una imagen específica del lore
  };
  
  return (
    <section className="py-12 px-3 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#bd4fff] rounded-full filter blur-[120px] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#60c8ff] rounded-full filter blur-[130px] opacity-10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center">
          {/* Columna izquierda: Texto del lore */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1 mt-8 lg:mt-0 lg:pr-12">
            {/* Título principal */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
              {loreIntro.title}
              <span className="block text-xl sm:text-2xl text-white/70 mt-2">{loreIntro.subtitle}</span>
            </h2>
            
            {/* Párrafos de introducción */}
            <div className="space-y-4 mb-8">
              {loreIntro.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-white/80 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {/* Cita destacada */}
            <blockquote className="border-l-4 border-[#bd4fff] pl-4 my-6">
              <p className="text-[#bd4fff]/90 italic">{loreIntro.quote}</p>
            </blockquote>
            
            {/* Botón para explorar más con estilo del navbar */}
            <div className="mt-8">
              <div className="relative group inline-block">
                <div 
                  className={`absolute -inset-[1px] rounded-md transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    background: 'linear-gradient(to right, #60c8ff, #bd4fff)',
                    borderRadius: '6px',
                  }}
                />
                <a 
                  href="/lore"
                  className="inline-block font-medium text-sm py-1.5 px-4 rounded-md border border-[#2e2e3a] bg-[#111118]/40 hover:bg-[#111118]/80 transition-all duration-300 relative"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span className={`transition-colors duration-300 ${isHovered ? 'text-white' : 'text-white/90'}`}>
                    Explorar el Lore Completo
                  </span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Columna derecha: Imagen o ilustración */}
          <div className="w-full lg:w-2/5 order-1 lg:order-2 relative">
            <div className="relative">
              {/* Borde con gradiente como en Hero.jsx */}
              <div 
                className="absolute -inset-[1px] rounded-lg"
                style={{
                  background: 'linear-gradient(to right, #60c8ff, #bd4fff)',
                  borderRadius: '0.5rem',
                  boxShadow: '0 0 15px rgba(96, 200, 255, 0.3), 0 0 20px rgba(189, 79, 255, 0.2)',
                  filter: 'blur(0.5px)'
                }}
              />
              
              {/* Contenedor de la imagen con máscara */}
              <div className="border border-transparent rounded-lg overflow-hidden bg-[#111118]/70 relative z-10">
                {/* Overlay de gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a2a] to-transparent z-10"></div>
                
                {/* Imagen del mundo */}
                <img 
                  src={loreIntro.image} 
                  alt="El mundo de Tibianity" 
                  className="w-full h-auto object-cover z-0 mix-blend-luminosity opacity-90"
                  style={{ maxHeight: '500px' }}
                />
                
                {/* Detalles decorativos */}
                <div className="absolute top-0 left-0 w-full h-full z-20">
                  <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-[#60c8ff] to-transparent"></div>
                  <div className="absolute top-0 left-0 w-1 h-20 bg-gradient-to-b from-[#60c8ff] to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-1 bg-gradient-to-l from-[#bd4fff] to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-1 h-20 bg-gradient-to-t from-[#bd4fff] to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Lore; 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Team - Muestra una vista previa de los creadores de contenido patrocinados
 */
const Team = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Datos de los creadores de contenido destacados para la vista previa
  const featuredContentCreators = [
    {
      id: 1,
      name: "TibiaLegend",
      role: "Streamer Principal",
      avatar: "/images/hero2.png", // Reemplazar con avatar real
      description: "Streamer de Tibia con más de 10k seguidores. Especializado en cacerías de boss y PvP hardcore.",
      social: {
        twitch: "https://twitch.tv/username",
        discord: "TibiaLegend#0000",
        youtube: "https://youtube.com/@username"
      },
      stats: {
        followers: "10K+",
        views: "150K+"
      }
    },
    {
      id: 2,
      name: "RookGamer",
      role: "Youtuber",
      avatar: "/images/hero2.png", // Reemplazar con avatar real
      description: "Creador de guías y tutoriales para nuevos jugadores. Su serie 'Desde Rookgaard' es viral en la comunidad.",
      social: {
        twitch: "https://twitch.tv/username",
        discord: "RookGamer#0000",
        youtube: "https://youtube.com/@username"
      },
      stats: {
        followers: "8K+",
        views: "120K+"
      }
    }
  ];
  
  // Eventos próximos organizados por el team
  const upcomingEvents = [
    {
      id: 1,
      title: "Torneo PvP 2v2",
      date: "28 Jun 2023",
      time: "20:00 CEST",
      server: "Antica",
      prize: "2500 TC"
    }
  ];

  return (
    <section className="py-8 px-4 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-[#60c8ff] rounded-full filter blur-[150px] opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#bd4fff] rounded-full filter blur-[150px] opacity-10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Encabezado con invitación */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white inline-block relative">
            Nuestro Team
            <div className="absolute -bottom-2 left-0 h-[3px] w-1/2 bg-gradient-to-r from-[#60c8ff] to-transparent rounded-full"></div>
            <div className="absolute -bottom-2 right-0 h-[3px] w-1/2 bg-gradient-to-l from-[#bd4fff] to-transparent rounded-full"></div>
          </h2>
          <p className="text-white/70 mt-3 max-w-2xl mx-auto text-sm">
            Conoce a los mejores creadores de contenido de Tibia que forman parte de nuestro equipo.
          </p>
        </div>
        
        {/* Layout principal de dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda (2/3) - Creadores destacados */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-3">
              <div className="w-10 h-1 bg-gradient-to-r from-[#60c8ff] to-transparent rounded-full"></div>
              <h3 className="ml-3 text-lg text-white font-medium">Creadores Destacados</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredContentCreators.map((creator) => (
                <ContentCreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          </div>
          
          {/* Columna derecha (1/3) - Eventos y estadísticas */}
          <div className="space-y-6">
            {/* Sección de eventos */}
            <div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-1 bg-gradient-to-r from-[#bd4fff] to-transparent rounded-full"></div>
                <h3 className="ml-3 text-lg text-white font-medium">Próximos Eventos</h3>
              </div>
              
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
            
            {/* Sección de estadísticas */}
            <div>
              <div className="flex items-center mb-3">
                <div className="w-10 h-1 bg-gradient-to-r from-[#60c8ff] to-transparent rounded-full"></div>
                <h3 className="ml-3 text-lg text-white font-medium">Team Stats</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#111118]/50 border border-[#2e2e3a] text-center">
                  <p className="text-xl font-bold text-[#60c8ff]">12+</p>
                  <p className="text-white/70 text-xs">Creadores</p>
                </div>
                <div className="p-3 rounded-lg bg-[#111118]/50 border border-[#2e2e3a] text-center">
                  <p className="text-xl font-bold text-[#bd4fff]">25k+</p>
                  <p className="text-white/70 text-xs">Seguidores Totales</p>
                </div>
                <div className="p-3 rounded-lg bg-[#111118]/50 border border-[#2e2e3a] text-center">
                  <p className="text-xl font-bold text-[#60c8ff]">3+</p>
                  <p className="text-white/70 text-xs">Años Juntos</p>
                </div>
                <div className="p-3 rounded-lg bg-[#111118]/50 border border-[#2e2e3a] text-center">
                  <p className="text-xl font-bold text-[#bd4fff]">8+</p>
                  <p className="text-white/70 text-xs">Servidores</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Botón para ver más */}
        <div className="text-center mt-6">
          <div className="relative group inline-block">
            <div 
              className={`absolute -inset-[1px] rounded-md transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              style={{
                background: 'linear-gradient(to right, #60c8ff, #bd4fff)',
                borderRadius: '6px',
              }}
            />
            <Link 
              to="/team"
              className="inline-block font-medium text-sm py-2 px-6 rounded-md border border-[#2e2e3a] bg-[#111118]/40 hover:bg-[#111118]/80 transition-all duration-300 relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className={`transition-colors duration-300 ${isHovered ? 'text-white' : 'text-white/90'}`}>
                Ver todos los creadores
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Componente de tarjeta para creadores de contenido
 */
const ContentCreatorCard = ({ creator }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Borde con gradiente */}
      <div 
        className={`absolute -inset-[1px] rounded-lg transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`}
        style={{
          background: 'linear-gradient(to right, #60c8ff, #bd4fff)',
          borderRadius: '0.5rem',
          boxShadow: isHovered ? '0 0 15px rgba(96, 200, 255, 0.4), 0 0 20px rgba(189, 79, 255, 0.3)' : 'none',
          filter: 'blur(0.5px)'
        }}
      />
      
      {/* Contenido de la tarjeta más compacto */}
      <div className="border border-transparent rounded-lg bg-[#111118]/70 p-3 relative z-10 transition-transform duration-300 transform"
           style={{ transform: isHovered ? 'translateY(-2px)' : 'translateY(0)' }}>
        {/* Layout horizontal */}
        <div className="flex items-center mb-2">
          {/* Avatar */}
          <div className="relative mr-3 w-14 h-14 flex-shrink-0">
            <img 
              src={creator.avatar} 
              alt={creator.name}
              className="rounded-full w-full h-full object-cover border border-[#2e2e3a]"
            />
          </div>
          
          {/* Información del creador */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">{creator.name}</h3>
            <p className="text-xs font-medium text-[#60c8ff]">{creator.role}</p>
            <p className="text-white/70 text-xs line-clamp-2 mt-0.5">{creator.description}</p>
          </div>
        </div>
        
        {/* Estadísticas y redes sociales en línea horizontal */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex space-x-3">
            <span className="text-white/60">
              <span className="text-[#60c8ff] font-medium">{creator.stats.followers}</span> seguidores
            </span>
            <span className="text-white/60">
              <span className="text-[#bd4fff] font-medium">{creator.stats.views}</span> vistas
            </span>
          </div>
          
          {/* Redes sociales como iconos */}
          <div className="flex space-x-1">
            {creator.social.twitch && (
              <a 
                href={creator.social.twitch}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-5 h-5 flex items-center justify-center rounded-full bg-[#131b29] text-white/70 hover:text-[#9146FF] transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.269-6.269v-14.686h-21.314zm19.164 13.612l-3.582 3.582h-5.731l-3.045 3.045v-3.045h-4.836v-15.045h17.194v11.463zm-3.582-7.731v6.628h-2.149v-6.628h2.149zm-5.731 0v6.628h-2.149v-6.628h2.149z" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
              </a>
            )}
            {creator.social.youtube && (
              <a 
                href={creator.social.youtube}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-5 h-5 flex items-center justify-center rounded-full bg-[#131b29] text-white/70 hover:text-[#FF0000] transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
            )}
            {creator.social.discord && (
              <button 
                type="button"
                className="w-5 h-5 flex items-center justify-center rounded-full bg-[#131b29] text-white/70 hover:text-[#5865F2] transition-colors duration-200"
                title={creator.social.discord}
                onClick={() => {
                  // Aquí podría mostrar un modal o copiar al portapapeles
                  navigator.clipboard.writeText(creator.social.discord).catch(err => console.error('Error al copiar:', err));
                  alert(`Discord copiado: ${creator.social.discord}`);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente para eventos próximos
 */
const EventCard = ({ event }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Borde con gradiente */}
      <div 
        className={`absolute -inset-[1px] rounded-lg transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`}
        style={{
          background: 'linear-gradient(to right, #bd4fff, #60c8ff)',
          borderRadius: '0.5rem',
          boxShadow: isHovered ? '0 0 15px rgba(189, 79, 255, 0.4), 0 0 20px rgba(96, 200, 255, 0.3)' : 'none',
          filter: 'blur(0.5px)'
        }}
      />
      
      {/* Contenido del evento */}
      <div className="border border-transparent rounded-lg bg-[#111118]/70 p-3 relative z-10 transition-transform duration-300 transform"
           style={{ transform: isHovered ? 'translateY(-2px)' : 'translateY(0)' }}>
        {/* Título y fecha */}
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-base font-semibold text-white">{event.title}</h4>
          <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-[#bd4fff]">{event.date}</span>
            <span className="text-xs text-white/60">{event.time}</span>
          </div>
        </div>
        
        {/* Detalles del evento */}
        <div className="flex justify-between items-center text-xs">
          <div>
            <div className="text-white/70">
              <span className="text-[#60c8ff]">Servidor:</span> {event.server}
            </div>
            <div className="text-white/70">
              <span className="text-[#60c8ff]">Premio:</span> {event.prize}
            </div>
          </div>
          
          {/* Botón para inscribirse */}
          <button 
            className="px-3 py-1 text-xs font-medium rounded bg-[#bd4fff]/20 text-[#bd4fff] border border-[#bd4fff]/30 hover:bg-[#bd4fff]/30 transition-colors duration-200"
          >
            Inscribirme
          </button>
        </div>
      </div>
    </div>
  );
};

export default Team; 
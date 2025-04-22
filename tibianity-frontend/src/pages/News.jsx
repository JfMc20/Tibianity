import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

/**
 * Página News - Página de noticias y actualizaciones de Tibianity
 */
const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [expandedNews, setExpandedNews] = useState({});

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebugInfo(null);
        
        // Primero intentamos cargar las noticias traducidas del archivo local
        try {
          console.log("Intentando cargar noticias traducidas desde el archivo local");
          const response = await fetch('/data/news-es.json');
          
          if (response.ok) {
            const localData = await response.json();
            console.log("Datos locales cargados correctamente:", localData.last_updated);
            
            if (localData && localData.news && localData.news.length > 0) {
              setNews(localData.news);
              
              // Inicializar estado de expansión para cada noticia
              const initialExpandState = {};
              localData.news.forEach(item => {
                initialExpandState[item.id] = false;
              });
              setExpandedNews(initialExpandState);
              
              setLoading(false);
              return;
            }
          }
        } catch (localError) {
          console.warn("No se pudieron cargar noticias locales, intentando con el backend:", localError);
        }
        
        // Si no hay archivo local o está vacío, recurrimos al backend
        console.log("Intentando conectar al backend en: http://localhost:3002/api/news");
        
        const response = await axios.get('http://localhost:3002/api/news?limit=10', {
          timeout: 30000, // 30 segundos de timeout
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        console.log("Respuesta recibida:", response.status, response.statusText);
        
        const result = response.data;
        console.log("Datos recibidos:", result);
        
        if (!result.success) {
          setDebugInfo(`Respuesta no exitosa: ${JSON.stringify(result)}`);
          throw new Error(result.message || 'Error en la respuesta del servidor');
        }
        
        const newsData = result.data || [];
        setNews(newsData);
        
        // Inicializar estado de expansión para cada noticia del backend
        const initialExpandState = {};
        newsData.forEach(item => {
          initialExpandState[item.id] = false;
        });
        setExpandedNews(initialExpandState);
      } catch (err) {
        console.error('Error al cargar noticias:', err);
        
        let mensajeError = '';
        
        // Manejo más detallado de errores de axios
        if (err.code === 'ECONNABORTED') {
          mensajeError = 'La conexión al servidor ha tomado demasiado tiempo. Verifica que el backend esté en ejecución.';
        } else if (err.code === 'ERR_NETWORK') {
          mensajeError = 'No se pudo conectar al servidor. Asegúrate de que el backend esté ejecutándose en el puerto 3002.';
        } else if (err.response) {
          // El servidor respondió con un código de error
          mensajeError = `El servidor respondió con error: ${err.response.status} ${err.response.statusText}`;
          setDebugInfo(JSON.stringify(err.response.data, null, 2));
        } else {
          mensajeError = `No se pudieron cargar las noticias: ${err.message}`;
        }
        
        setError(mensajeError);
        setDebugInfo(`Error completo: ${err.toString()}\nStack: ${err.stack}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Formatea la fecha al español
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtiene un color basado en el tipo de noticia
  const getTagColor = (type) => {
    const colors = {
      'News': 'bg-gradient-to-r from-blue-500 to-blue-600',
      'Community': 'bg-gradient-to-r from-green-500 to-green-600',
      'Development': 'bg-gradient-to-r from-purple-500 to-purple-600',
      'Support': 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      'Technical Issues': 'bg-gradient-to-r from-red-500 to-red-600',
      'Update': 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      'Game Content': 'bg-gradient-to-r from-pink-500 to-pink-600',
      'Contests': 'bg-gradient-to-r from-amber-500 to-amber-600',
      'Events': 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      'Teaser': 'bg-gradient-to-r from-cyan-500 to-cyan-600',
      'Test Server': 'bg-gradient-to-r from-fuchsia-500 to-fuchsia-600'
    };
    
    return colors[type] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  // Obtiene el nombre y color de la categoría basado en su código
  const getCategoryInfo = (categoryCode) => {
    const categories = {
      0: { name: 'General', color: 'text-gray-400', icon: '🌐' },
      1: { name: 'Desarrollo', color: 'text-purple-400', icon: '⚙️' },
      2: { name: 'Comunidad', color: 'text-green-400', icon: '👥' }
    };
    
    return categories[categoryCode] || categories[0];
  };

  // Formatea el contenido, reemplazando saltos de línea con etiquetas <p>
  const formatContent = (content) => {
    if (!content) return '';
    
    // Divide el contenido por párrafos (doble salto de línea)
    const paragraphs = content.split(/\n\n+/);
    
    return paragraphs
      .filter(p => p.trim().length > 0)
      .map((paragraph, index) => (
        `<p key=${index}>${paragraph.replace(/\n/g, '<br />')}</p>`
      ))
      .join('');
  };
  
  // Manejar la expansión/colapso de una noticia
  const handleToggleExpand = (id) => {
    setExpandedNews(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Verificar si el contenido es largo (más de 300 caracteres)
  const isLongContent = (content) => {
    return content && content.length > 300;
  };

  // Componente para la tarjeta de noticia
  const NewsCard = ({ item, index }) => {
    const contentRef = useRef(null);
    const isExpanded = expandedNews[item.id];
    const contentText = item.content_es || item.content;
    const isLong = isLongContent(contentText);
    const title = item.title_es || item.title;
    
    return (
      <article 
        key={index} 
        className="bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700/50 transition-all duration-300 hover:shadow-2xl hover:border-gray-600/70 hover:translate-y-[-2px]"
        aria-labelledby={`news-title-${item.id}`}
      >
        <div className="p-6 md:p-6">
          <header className="border-b border-gray-700/30 pb-3 mb-4">
            <div className="flex flex-wrap items-center gap-2 justify-between mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md text-white shadow-lg ${getTagColor(item.type)}`}
                  aria-label={`Tipo: ${item.type}`}
                >
                  {item.type}
                </span>
                
                <p className={`text-xs flex items-center ${getCategoryInfo(item.category).color}`}>
                  <span className="mr-1" role="img" aria-hidden="true">{getCategoryInfo(item.category).icon}</span>
                  <span>{getCategoryInfo(item.category).name}</span>
                </p>
                
                {item.title_es && (
                  <span className="px-1.5 py-0.5 text-xs bg-gradient-to-r from-blue-600 to-purple-600 rounded-md text-white shadow-inner shadow-white/10 font-medium tracking-wide">
                    ES
                  </span>
                )}
              </div>
              
              <time 
                dateTime={new Date(item.date).toISOString()} 
                className="flex items-center text-xs text-gray-400"
                aria-label="Fecha de publicación"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1 text-gray-500" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                </svg>
                {formatDate(item.date)}
              </time>
            </div>
            
            <h2 
              id={`news-title-${item.id}`}
              className="text-lg md:text-xl font-semibold text-white group-hover:text-[#60c8ff] transition-colors duration-200 leading-snug"
            >
              {title}
            </h2>
          </header>
          
          <div className="relative">
            <div 
              ref={contentRef}
              className={`text-gray-300 text-sm md:text-base leading-relaxed mb-4 prose prose-sm max-w-none prose-invert prose-headings:text-white prose-a:text-[#60c8ff] prose-p:my-3 prose-p:leading-relaxed first:prose-p:mt-0 prose-strong:text-white/95 prose-strong:font-semibold hover:prose-a:text-[#bd4fff] prose-a:transition-colors overflow-hidden transition-all duration-300 ${isLong && !isExpanded ? 'max-h-60' : ''} ${contentText.length < 100 ? 'text-base font-medium' : ''}`}
              dangerouslySetInnerHTML={{ 
                __html: item.content_es 
                  ? formatContent(item.content_es) 
                  : formatContent(item.content)
              }}
            />
            
            {isLong && (
              <div className={`relative ${!isExpanded ? 'mt-[-40px]' : 'mt-0'}`}>
                {!isExpanded && (
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-800/95 to-transparent pointer-events-none"></div>
                )}
                <button
                  onClick={() => handleToggleExpand(item.id)}
                  className="w-full flex items-center justify-center py-2 px-4 text-sm font-medium text-[#60c8ff] hover:text-[#bd4fff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#60c8ff] focus:ring-opacity-50 rounded-md mt-2"
                  aria-expanded={isExpanded}
                  aria-controls={`content-${item.id}`}
                >
                  {isExpanded ? (
                    <>
                      <span>Ver menos</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2" aria-hidden="true">
                        <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Ver más</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-700/30">
            {item.translated_at && (
              <time 
                dateTime={new Date(item.translated_at).toISOString()} 
                className="flex items-center text-xs text-gray-500"
                aria-label="Fecha de traducción"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1 text-purple-400" aria-hidden="true">
                  <path fillRule="evenodd" d="M2 10c0-3.967 3.69-7 8-7 4.31 0 8 3.033 8 7s-3.69 7-8 7a9.165 9.165 0 01-1.504-.123 5.976 5.976 0 01-3.935 1.107.75.75 0 01-.584-1.143 3.478 3.478 0 00.522-1.756C2.979 13.825 2 12.025 2 10z" clipRule="evenodd" />
                </svg>
                Traducido: {formatDate(item.translated_at)}
              </time>
            )}
            <a 
              href={`https://www.tibia.com/news/?subtopic=newsarchive&id=${item.id}`}
              target="_blank"
              rel="noopener noreferrer" 
              className="group flex items-center text-[#60c8ff] hover:text-[#bd4fff] transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#60c8ff] focus:ring-opacity-50 rounded ml-auto"
              aria-label="Ver noticia completa en el sitio oficial de Tibia"
            >
              <span>Ver noticia completa</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true">
                <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="py-12 md:py-16 px-4 relative overflow-hidden" aria-labelledby="news-heading">
      {/* Fondo con efectos de gradiente */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#60c8ff] rounded-full filter blur-[180px] opacity-15 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#bd4fff] rounded-full filter blur-[180px] opacity-15 animate-pulse-slower"></div>
        <div className="absolute top-1/3 right-1/5 w-72 h-72 bg-[#4fc8ff] rounded-full filter blur-[160px] opacity-10 animate-pulse-slow"></div>
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <h1 
            id="news-heading"
            className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#60c8ff] to-[#bd4fff] inline-block relative mb-2"
          >
            Noticias de Tibia
          </h1>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-[#60c8ff] to-[#bd4fff] rounded-full mb-6"></div>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
            Las últimas noticias y actualizaciones oficiales del mundo de Tibia.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20" aria-live="polite" aria-busy="true">
            <div className="flex flex-col items-center" role="status">
              <div className="relative w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-[#60c8ff]/30 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-t-4 border-[#bd4fff] rounded-full animate-spin"></div>
              </div>
              <p className="mt-5 text-lg font-medium text-[#60c8ff]">Cargando noticias...</p>
            </div>
          </div>
        ) : error ? (
          <div 
            className="text-center py-12 space-y-6 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-red-500/20 shadow-lg px-6"
            aria-live="assertive"
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-400" aria-hidden="true">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-400 text-lg font-medium">{error}</p>
            {debugInfo && (
              <div className="mt-4 p-4 bg-gray-900/60 rounded-lg text-xs text-left mx-auto max-w-2xl border border-gray-700/50">
                <p className="text-gray-300 font-mono mb-2">Información de depuración:</p>
                <pre className="text-red-300 mt-1 overflow-x-auto whitespace-pre-wrap text-xs">{debugInfo}</pre>
              </div>
            )}
            <div className="flex justify-center mt-6">
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={() => window.location.reload()}
              >
                Intentar nuevamente
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-6">
              Verifica que el servidor backend esté en ejecución usando:<br />
              <code className="text-xs bg-gray-800/80 border border-gray-700/50 rounded-md px-3 py-1.5 mt-2 inline-block">cd backend ; npm run dev</code>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {news.length > 0 ? (
              news.map((item, index) => (
                <NewsCard key={item.id || index} item={item} index={index} />
              ))
            ) : (
              <div 
                className="text-center py-16 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50"
                aria-live="polite"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-600 mx-auto mb-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-gray-400 text-lg">No hay noticias disponibles en este momento.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default News; 
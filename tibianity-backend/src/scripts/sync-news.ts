import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import tibiaDataService from '../services/tibiadata.service';
import { TibiaNews, TranslatedTibiaNews, TranslatedNewsStorage } from '../types';

// Cargar variables de entorno
dotenv.config();

// Constantes y configuración
const NEWS_FILE_PATH = path.join(__dirname, '../../../public/data/news-es.json');
const MAX_NEWS_COUNT = 10;
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.TRANSLATION_MODEL || 'mistralai/mistral-7b-instruct';
const BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const FORCE_TRANSLATE = process.argv.includes('--force') || process.argv.includes('-f');

// Inicialización del cliente OpenAI (compatible con OpenRouter)
const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: BASE_URL
});

// Asegurar que el directorio existe
const ensureDirectoryExists = (filePath: string): void => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
    console.log(`✅ Directorio creado: ${dirname}`);
  }
};

// Leer el archivo de noticias traducidas si existe
const readTranslatedNews = (): TranslatedNewsStorage => {
  try {
    if (fs.existsSync(NEWS_FILE_PATH)) {
      const data = fs.readFileSync(NEWS_FILE_PATH, 'utf8');
      return JSON.parse(data) as TranslatedNewsStorage;
    }
  } catch (error) {
    console.error('❌ Error al leer el archivo de noticias traducidas:', error);
  }
  
  // Si no existe o hay error, devolver estructura inicial
  return {
    last_updated: new Date().toISOString(),
    news: []
  };
};

// Guardar las noticias traducidas
const saveTranslatedNews = (data: TranslatedNewsStorage): void => {
  try {
    ensureDirectoryExists(NEWS_FILE_PATH);
    fs.writeFileSync(NEWS_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Noticias guardadas en ${NEWS_FILE_PATH}`);
  } catch (error) {
    console.error('❌ Error al guardar las noticias traducidas:', error);
  }
};

// Traducir texto usando el modelo de lenguaje
const translateText = async (text: string, isHtml: boolean = false): Promise<string> => {
  if (!API_KEY) {
    console.error('❌ Error: No se ha configurado la clave API para traducción');
    return text;
  }

  try {
    // Para textos vacíos o muy cortos, no es necesario traducir
    if (!text || text.length < 5) return text;

    const systemPrompt = isHtml
      ? 'Eres un traductor profesional especializado en traducir contenido del juego Tibia. Traduce el siguiente HTML del inglés al español manteniendo todos los tags HTML intactos. Mantén los nombres propios sin traducir. Adapta las expresiones para que suenen naturales en español.'
      : 'Eres un traductor profesional especializado en traducir contenido del juego Tibia. Traduce el siguiente texto del inglés al español. Mantén los nombres propios sin traducir. Adapta las expresiones para que suenen naturales en español.';

    // Configuración específica para OpenRouter
    const response = await openai.chat.completions.create(
      {
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
        max_tokens: 2048
      },
      {
        headers: {
          'HTTP-Referer': 'https://tibianity.com', // Dominio del proyecto para atribución
          'X-Title': 'Tibianity News Translator' // Título del proyecto
        }
      }
    );

    const translatedText = response.choices[0]?.message?.content?.trim() || text;
    return translatedText;
  } catch (error) {
    console.error('❌ Error al traducir texto:', error);
    return text; // En caso de error, devolvemos el texto original
  }
};

// Traducir una noticia completa
const translateNews = async (news: TibiaNews): Promise<TranslatedTibiaNews> => {
  console.log(`🔄 Traduciendo noticia #${news.id}: "${news.title.substring(0, 30)}..."`);
  
  // Traducir título y contenido
  const [translatedTitle, translatedContent] = await Promise.all([
    translateText(news.title),
    translateText(news.content, true) // El contenido es HTML
  ]);
  
  return {
    ...news,
    title_es: translatedTitle,
    content_es: translatedContent,
    translated_at: new Date().toISOString()
  };
};

// Obtener y sincronizar las noticias
const syncNews = async (): Promise<void> => {
  console.log('🚀 Iniciando sincronización de noticias...');
  
  try {
    // Paso 1: Obtener las noticias más recientes desde la API
    const recentNews = await tibiaDataService.getLatestNews(MAX_NEWS_COUNT);
    console.log(`✅ Obtenidas ${recentNews.length} noticias recientes`);
    
    // Paso 2: Leer noticias traducidas existentes
    const storage = readTranslatedNews();
    
    // Si es modo forzado o no existen noticias, traducilas todas
    if (FORCE_TRANSLATE || storage.news.length === 0) {
      console.log(`🔄 Modo forzado: traduciendo la primera noticia como prueba...`);
      
      // Traducir solo la primera noticia como prueba
      const newsToTranslate = [recentNews[0]];
      
      // Traducir la noticia de prueba
      const translatedNews = await Promise.all(
        newsToTranslate.map(news => translateNews(news))
      );
      console.log(`✅ Se ha traducido la noticia de prueba correctamente`);
      
      // Combinar la noticia traducida con las existentes (si hay)
      const existingNewsIds = new Set(storage.news.map(news => news.id));
      const allNews = [
        ...translatedNews,
        ...storage.news.filter(news => !translatedNews.some(n => n.id === news.id))
      ];
      
      // Ordenar por fecha y limitar
      const sortedNews = allNews
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, MAX_NEWS_COUNT);
      
      // Guardar el archivo
      const updatedStorage: TranslatedNewsStorage = {
        last_updated: new Date().toISOString(),
        news: sortedNews
      };
      
      saveTranslatedNews(updatedStorage);
      console.log(`✅ Sincronización completada. Total noticias: ${sortedNews.length}`);
      return;
    }
    
    // Modo normal: detectar noticias nuevas
    const existingNewsIds = new Set(storage.news.map(news => news.id));
    const newsToTranslate = recentNews.filter(news => !existingNewsIds.has(news.id));
    console.log(`ℹ️ Noticias nuevas para traducir: ${newsToTranslate.length}`);
    
    if (newsToTranslate.length === 0) {
      console.log('✅ No hay noticias nuevas para traducir');
      return;
    }
    
    // Paso 4: Traducir las noticias nuevas
    const translatedNews = await Promise.all(
      newsToTranslate.map(news => translateNews(news))
    );
    console.log(`✅ Se han traducido ${translatedNews.length} noticias`);
    
    // Paso 5: Combinar las noticias existentes con las nuevas traducidas
    const allNews = [
      ...translatedNews,
      ...storage.news
    ];
    
    // Paso 6: Ordenar por fecha (más recientes primero) y limitar a MAX_NEWS_COUNT
    const sortedNews = allNews
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, MAX_NEWS_COUNT);
    
    // Paso 7: Actualizar y guardar el archivo
    const updatedStorage: TranslatedNewsStorage = {
      last_updated: new Date().toISOString(),
      news: sortedNews
    };
    
    saveTranslatedNews(updatedStorage);
    console.log(`✅ Sincronización completada. Total noticias: ${sortedNews.length}`);
    
  } catch (error) {
    console.error('❌ Error durante la sincronización de noticias:', error);
  }
};

// Ejecutar la sincronización
(async () => {
  console.log('=== Sincronización de Noticias de Tibia ===');
  
  if (!API_KEY) {
    console.error('❌ ERROR: No se ha encontrado la clave API para la traducción');
    console.error('Por favor, configura OPENROUTER_API_KEY en el archivo .env');
    process.exit(1);
  }
  
  if (FORCE_TRANSLATE) {
    console.log('ℹ️ Modo forzado activado: se traducirá una noticia como prueba independientemente del estado actual');
  }
  
  await syncNews();
  console.log('✨ Proceso finalizado');
})(); 
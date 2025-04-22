import axios from 'axios';
import apiConfig from '../config/api.config';
import { TibiaNews } from '../types';

/**
 * Servicio para interactuar con la API de Tibia Data
 */
class TibiaDataService {
  private apiUrl: string;
  private client: any;

  constructor() {
    this.apiUrl = apiConfig.tibiaDataApiUrl;
    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: 15000, // Aumentado a 15 segundos para evitar timeouts
    });
    console.log(`TibiaDataService inicializado con URL: ${this.apiUrl}`);
  }

  /**
   * Adapta el formato de los datos de Tibia Data al formato esperado por la aplicación
   * @param newsData - Elemento de noticia de la API
   * @param newsContent - Contenido detallado de la noticia (opcional)
   * @returns - Noticia adaptada al formato de la aplicación
   */
  private adaptNewsFormat(newsData: Record<string, any>, newsContent?: string): TibiaNews {
    try {
      // Estas propiedades son las que están llegando de la API
      const { id, date, news: title, category, type } = newsData;

      // Construimos un objeto compatible con nuestra interfaz TibiaNews
      return {
        id: parseInt(id as string),
        date: date as string,
        title: title as string,
        content: newsContent || `<p>Cargando contenido detallado...</p>`,
        category: category === 'development' ? 1 : category === 'community' ? 2 : 0,
        type: type as string,
        updated: false
      };
    } catch (err) {
      console.error('Error adaptando formato de noticia:', err);
      // Devolvemos un objeto básico para no romper la aplicación
      return {
        id: 0,
        date: new Date().toISOString(),
        title: 'Error al procesar noticia',
        content: '<p>No se pudo cargar el contenido de esta noticia.</p>',
        category: 0,
        type: 'Error',
        updated: false
      };
    }
  }

  /**
   * Obtiene el contenido completo de una noticia por su ID
   * @param id ID de la noticia
   * @returns Contenido HTML de la noticia o null si no se encuentra
   */
  private async getNewsContent(id: number): Promise<string | null> {
    try {
      console.log(`Obteniendo contenido detallado para noticia ID: ${id}`);
      const response = await this.client.get(`/v4/news/id/${id}`);
      
      if (response.data && response.data.news && response.data.news.content) {
        return response.data.news.content;
      }
      
      return null;
    } catch (err) {
      console.error(`Error al obtener contenido para noticia ID ${id}:`, err);
      return null;
    }
  }

  /**
   * Obtiene las últimas noticias de Tibia
   * @param {number} limit - Número de noticias a obtener
   * @returns {Promise<TibiaNews[]>} - Array de noticias
   */
  async getLatestNews(limit: number = 10): Promise<TibiaNews[]> {
    try {
      console.log(`Solicitando noticias a ${this.apiUrl}/v4/news/latest (${new Date().toISOString()})`);
      console.log(`apiConfig.tibiaDataApiUrl = ${apiConfig.tibiaDataApiUrl}`);
      console.log(`Valor de la variable de entorno TIBIADATA_API_URL = ${process.env.TIBIADATA_API_URL}`);
      
      const response = await this.client.get('/v4/news/latest');
      console.log('Respuesta recibida de Tibia Data API:', response.status);
      
      // Verificamos que la respuesta tenga el formato esperado
      if (!response.data || !response.data.news) {
        console.error('Formato de respuesta inesperado:', JSON.stringify(response.data).substring(0, 200));
        throw new Error('La respuesta de la API no tiene el formato esperado');
      }
      
      console.log('Estructura de respuesta:', Object.keys(response.data));
      console.log('Estructura de noticias:', Object.keys(response.data.news));
      
      const newsEntries = Array.isArray(response.data.news) 
        ? response.data.news 
        : (response.data.news.entries || []);
        
      console.log(`Se encontraron ${newsEntries.length} noticias`);
      
      if (newsEntries.length === 0) {
        console.log('Respuesta completa para depuración:', JSON.stringify(response.data).substring(0, 1000));
      }
      
      // Limitamos la cantidad de noticias antes de obtener sus contenidos
      const limitedEntries = newsEntries.slice(0, limit);
      
      // Para cada noticia, obtenemos su contenido completo
      const newsWithContent = await Promise.all(
        limitedEntries.map(async (item: Record<string, any>) => {
          const newsId = parseInt(item.id);
          // Obtenemos el contenido detallado
          const content = await this.getNewsContent(newsId);
          // Adaptamos el formato
          return this.adaptNewsFormat(item, content || undefined);
        })
      );
      
      return newsWithContent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error al obtener noticias:', errorMessage);
      
      // Log de información de error más detallada si está disponible
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        console.error('Detalles del error de red:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          url: axiosError.config?.url,
          data: axiosError.response?.data
        });
      }
      
      throw new Error(`No se pudieron obtener las noticias de Tibia Data: ${errorMessage}`);
    }
  }

  /**
   * Obtiene una noticia específica por ID
   * @param {number} id - ID de la noticia
   * @returns {Promise<TibiaNews | null>} - Noticia
   */
  async getNewsById(id: number): Promise<TibiaNews | null> {
    try {
      console.log(`Solicitando noticia con ID ${id} a ${this.apiUrl}/v4/news/id/${id}`);
      const response = await this.client.get(`/v4/news/id/${id}`);
      console.log('Respuesta recibida para noticia específica');
      
      // Verificamos el formato de la respuesta
      if (!response.data || !response.data.news) {
        console.error('Formato inesperado en getNewsById:', JSON.stringify(response.data).substring(0, 200));
        return null;
      }
      
      // Información básica de la noticia
      const newsItem = Array.isArray(response.data.news) 
        ? response.data.news[0] 
        : (response.data.news.entries && response.data.news.entries[0]);
      
      if (!newsItem) {
        return null;
      }
      
      // Contenido de la noticia
      const newsContent = response.data.news.content || null;
      
      // Convertimos al formato esperado
      return this.adaptNewsFormat(newsItem, newsContent);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error(`Error al obtener noticia con ID ${id}:`, errorMessage);
      
      // Log de información de error más detallada si está disponible
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        console.error('Detalles del error de red:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          url: axiosError.config?.url
        });
      }
      
      throw new Error(`No se pudo obtener la noticia solicitada: ${errorMessage}`);
    }
  }
}

export default new TibiaDataService(); 
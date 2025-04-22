/**
 * Interfaz para las noticias de Tibia
 */
export interface TibiaNews {
  id: number;
  date: string;
  title: string;
  content: string;
  category: number;
  type: string;
  updated: boolean;
  updated_date?: string;
}

/**
 * Interfaz para las noticias traducidas
 */
export interface TranslatedTibiaNews extends TibiaNews {
  title_es: string;
  content_es: string;
  translated_at: string;
}

/**
 * Interfaz para la respuesta de la API de noticias
 */
export interface NewsResponse {
  success: boolean;
  count?: number;
  data: TibiaNews | TibiaNews[];
  message?: string;
}

/**
 * Interfaz para la respuesta de la API de Tibia Data
 */
export interface TibiaDataResponse {
  news: {
    entries: TibiaNews[];
  };
}

/**
 * Interfaz para el archivo de noticias traducidas
 */
export interface TranslatedNewsStorage {
  last_updated: string;
  news: TranslatedTibiaNews[];
}

/**
 * Interfaz para la respuesta del servicio de traducción
 */
export interface TranslationResponse {
  translated_text: string;
  source_language?: string;
  target_language?: string;
} 
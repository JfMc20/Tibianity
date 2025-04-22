import { Request, Response } from 'express';
import tibiaDataService from '../services/tibiadata.service';
import { TibiaNews } from '../types';

/**
 * Controlador de noticias
 */
class NewsController {
  /**
   * Obtiene las últimas noticias
   * @param {Request} req - Objeto de solicitud
   * @param {Response} res - Objeto de respuesta
   */
  async getLatestNews(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const news: TibiaNews[] = await tibiaDataService.getLatestNews(limit);
      
      res.status(200).json({
        success: true,
        count: news.length,
        data: news
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message || 'Error al obtener las noticias'
      });
    }
  }

  /**
   * Obtiene una noticia por ID
   * @param {Request} req - Objeto de solicitud
   * @param {Response} res - Objeto de respuesta
   */
  async getNewsById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID de noticia inválido'
        });
        return;
      }
      
      const news = await tibiaDataService.getNewsById(id);
      
      if (!news) {
        res.status(404).json({
          success: false,
          message: 'Noticia no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: news
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message || 'Error al obtener la noticia'
      });
    }
  }
}

export default new NewsController(); 
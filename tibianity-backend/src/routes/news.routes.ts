import express from 'express';
import newsController from '../controllers/news.controller';

const router = express.Router();

/**
 * @route GET /api/news
 * @desc Obtiene las últimas noticias
 * @access Público
 */
router.get('/', newsController.getLatestNews);

/**
 * @route GET /api/news/:id
 * @desc Obtiene una noticia por ID
 * @access Público
 */
router.get('/:id', newsController.getNewsById);

export default router; 
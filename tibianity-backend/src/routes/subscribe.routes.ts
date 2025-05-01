import { Router } from 'express';
import { handleSubscription } from '../controllers/subscribe.controller';
import { subscribeLimiter } from '../config/rateLimiters.config';

const router = Router();

// Definir la ruta POST para / (relativo a la base de montaje, ej. /api/subscribe)
// Usará el controlador handleSubscription para procesar la solicitud.
// Aplicar el limitador ANTES del controlador
router.post('/', subscribeLimiter, handleSubscription);

export default router; 
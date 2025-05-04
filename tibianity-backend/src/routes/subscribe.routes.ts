import { Router } from 'express';
import { handleSubscription, confirmSubscription } from '../controllers/subscribe.controller';
import { subscribeLimiter } from '../config/rateLimiters.config';

const router = Router();

// Definir la ruta POST para / (relativo a la base de montaje, ej. /api/subscribe)
// Usará el controlador handleSubscription para procesar la solicitud.
// Aplicar el limitador ANTES del controlador
router.post('/', subscribeLimiter, handleSubscription);

// Nueva ruta para manejar la confirmación del email vía token
router.get('/confirm/:token', confirmSubscription);

export default router; 
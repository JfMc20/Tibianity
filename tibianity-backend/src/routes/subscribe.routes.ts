import { Router } from 'express';
import { handleSubscription } from '../controllers/subscribe.controller';

const router = Router();

// Definir la ruta POST para / (relativo a la base de montaje, ej. /api/subscribe)
// Usará el controlador handleSubscription para procesar la solicitud.
router.post('/', handleSubscription);

export default router; 
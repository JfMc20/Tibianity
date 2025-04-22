import express from 'express';
import adminController from '../controllers/admin.controller';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @route GET /admin/users
 * @desc Obtiene todos los usuarios registrados
 * @access Privado (Solo administradores)
 */
router.get('/users', isAuthenticated, isAdmin, adminController.getAllUsers);

/**
 * @route GET /admin/sessions
 * @desc Obtiene todos los registros de sesiones
 * @access Privado (Solo administradores)
 */
router.get('/sessions', isAuthenticated, isAdmin, adminController.getAllSessions);

export default router; 
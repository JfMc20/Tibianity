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

/**
 * @route PATCH /admin/users/:userId/promote
 * @desc Promover un usuario a administrador
 * @access Privado (Solo administradores)
 */
router.patch('/users/:userId/promote',
  isAuthenticated,
  isAdmin,
  adminController.promoteUserToAdmin
);

/**
 * @route PATCH /admin/users/:userId/demote
 * @desc Degradar un administrador a usuario normal
 * @access Privado (Solo administradores)
 */
router.patch('/users/:userId/demote',
  isAuthenticated,
  isAdmin,
  adminController.demoteAdminToUser
);

/**
 * @route PATCH /admin/users/:userId/grant-access
 * @desc Otorga acceso público al sitio a un usuario
 * @access Privado (Solo administradores)
 */
router.patch('/users/:userId/grant-access',
  isAuthenticated,
  isAdmin,
  adminController.grantPublicAccess
);

/**
 * @route PATCH /admin/users/:userId/revoke-access
 * @desc Revoca el acceso público al sitio a un usuario
 * @access Privado (Solo administradores)
 */
router.patch('/users/:userId/revoke-access',
  isAuthenticated,
  isAdmin,
  adminController.revokePublicAccess
);

/**
 * @route POST /admin/send-newsletter
 * @desc Envía un correo a todos los suscriptores
 * @access Privado (Solo administradores)
 */
router.post('/send-newsletter',
  isAuthenticated,
  isAdmin,
  adminController.sendNewsletter
);

/**
 * @route DELETE /admin/subscribers/pending
 * @desc Elimina todos los suscriptores pendientes de confirmación
 * @access Privado (Solo administradores)
 */
router.delete('/subscribers/pending', isAuthenticated, isAdmin, adminController.deletePendingSubscribers);

/**
 * @route DELETE /admin/subscribers/email/:email
 * @desc Elimina un suscriptor específico por su email
 * @access Privado (Solo administradores)
 */
// Asegurarse que :email se parsea correctamente (URL encoding puede ser necesario en el frontend)
router.delete('/subscribers/email/:email', isAuthenticated, isAdmin, adminController.deleteSubscriberByEmail);

export default router; 
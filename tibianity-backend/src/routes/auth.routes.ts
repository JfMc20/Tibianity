import express from 'express';
import passport from '../config/passport.config';
import { getProfile, logout } from '../controllers/auth.controller';
import { isAuthenticated } from '../middleware/auth.middleware';
import { authLimiter } from '../config/rateLimiters.config';

const router = express.Router();

// Ruta para iniciar el proceso de autenticación con Google
router.get('/google', authLimiter, passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Ruta de callback después de la autenticación con Google
router.get('/google/callback', 
  authLimiter,
  passport.authenticate('google', {
    successRedirect: `${process.env.FRONTEND_URL}/auth/success`,
    failureRedirect: `${process.env.FRONTEND_URL}/auth/failure`
  })
);

// Ruta para fallos en la autenticación
router.get('/google/failure', (_req, res) => {
  res.status(401).json({ message: 'Error en la autenticación con Google' });
});

// Ruta para obtener el perfil del usuario actual
router.get('/profile', isAuthenticated, getProfile);

// Ruta para cerrar sesión
router.post('/logout', logout);

export default router; 
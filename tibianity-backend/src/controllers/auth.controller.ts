import { Request, Response } from 'express';
import { UserProfile } from '../types/auth.types';

// Controlador para la ruta de profile
export const getProfile = (req: Request, res: Response) => {
  // Si el usuario no está autenticado, retornar error
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  
  const user = req.user as UserProfile;
  
  // Verificar si el usuario es administrador
  // En el perfil de Google OAuth, los emails se obtienen como un array
  const adminEmails = ['admin@tibianity.com', 'fraan.mujica1@gmail.com'];
  const userEmail = user.emails && user.emails.length > 0 ? user.emails[0].value : '';
  const isAdmin = userEmail && adminEmails.includes(userEmail);
  
  // Retornar los datos del usuario con información adicional
  res.json({
    user: {
      ...user,
      isAdmin
    }
  });
};

// Controlador para la ruta de logout
export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error('Error en logout:', err);
      return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
    res.json({ message: 'Sesión cerrada exitosamente' });
  });
}; 
import { Request, Response } from 'express';
import { UserProfile } from '../types/auth.types';
import User from '../models/User';

// Controlador para la ruta de profile
export const getProfile = async (req: Request, res: Response) => {
  // Si el usuario no está autenticado, retornar error
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const userProfile = req.user as UserProfile;
    const googleId = userProfile.id;

    if (!googleId) {
      return res.status(400).json({ message: 'No se pudo obtener el ID de usuario del perfil de sesión.' });
    }

    // Buscar el usuario completo en la base de datos para obtener isAdmin y canAccessPublicSite
    const dbUser = await User.findOne({ googleId }).select('+isAdmin +canAccessPublicSite');

    if (!dbUser) {
      // Esto no debería pasar si el usuario está autenticado y pasó por el callback de Passport,
      // pero es una comprobación de seguridad adicional.
      return res.status(404).json({ message: 'Usuario autenticado pero no encontrado en la base de datos.' });
    }

    // Usar los valores directamente de la base de datos
    const isAdmin = dbUser.isAdmin === true;
    const canAccessPublicSite = dbUser.canAccessPublicSite === true;

    // Retornar los datos del perfil de sesión (req.user) junto con los campos reales de la DB
    res.json({
      user: {
        ...userProfile,
        isAdmin: isAdmin,
        canAccessPublicSite: canAccessPublicSite
      }
    });

  } catch (error) {
    console.error('Error al obtener perfil de usuario desde DB:', error);
    // Devolver un error genérico, pero mantener al usuario logueado si es posible
    // Podríamos devolver solo req.user sin isAdmin si falla la DB?
    // Por ahora, devolvemos error 500.
    return res.status(500).json({ message: 'Error interno al obtener detalles del perfil.' });
  }
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
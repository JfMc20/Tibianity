import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { UserProfile } from '../types/auth.types';

// Verificar si estamos en modo desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';

// Middleware para verificar si el usuario está autenticado
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // En modo desarrollo, permitir acceso sin autenticación
  if (isDevelopment) {
    return next();
  }
  
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  // Si no está autenticado, enviar error 401
  res.status(401).json({ message: 'No autorizado' });
};

// Middleware para verificar si el usuario es administrador
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // En modo desarrollo, permitir acceso de administrador sin verificación
  if (isDevelopment) {
    return next();
  }
  
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    // Obtener el ID del usuario del objeto de sesión
    const userProfile = req.user as UserProfile;
    const googleId = userProfile.id;

    // Buscar el usuario en la base de datos
    const user = await User.findOne({ googleId });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el usuario tiene el rol de administrador
    // Para esta implementación, consideramos administradores a los usuarios con emails específicos
    // Esta lógica puede ser adaptada según los requerimientos del proyecto
    const adminEmails = ['admin@tibianity.com', 'fraan.mujica1@gmail.com'];
    
    if (user.email && adminEmails.includes(user.email)) {
      return next();
    }
    
    // Si no es administrador, enviar error 403 (Forbidden)
    return res.status(403).json({ message: 'Acceso denegado: requiere privilegios de administrador' });
  } catch (error) {
    console.error('Error al verificar rol de administrador:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}; 
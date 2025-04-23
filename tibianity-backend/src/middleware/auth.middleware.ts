import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { UserProfile } from '../types/auth.types';

// Verificar si estamos en modo desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';

// Middleware para verificar si el usuario está autenticado
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // En modo desarrollo, permitir acceso sin autenticación
  if (isDevelopment) {
    return next();
  }
  
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Si no está autenticado, enviar error 401
  return res.status(401).json({ message: 'Acceso no autorizado. Por favor, inicie sesión.' });
};

// Middleware para verificar si el usuario es administrador
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // En modo desarrollo, permitir acceso de administrador sin verificación
  // ¡PRECAUCIÓN! Esto debería quitarse o protegerse adecuadamente para producción
  if (isDevelopment) {
    console.warn("Advertencia: Saltando verificación de administrador en modo desarrollo.");
    return next();
  }

  // El middleware 'isAuthenticated' ya debería haber corrido antes,
  // pero una verificación extra no hace daño y aclara la intención.
  if (!req.isAuthenticated() || !req.user) {
    // Usamos 401 Unauthorized si no está autenticado
    return res.status(401).json({ message: 'Acceso no autorizado. Se requiere autenticación.' });
  }

  try {
    // Obtener el ID del usuario del objeto de sesión (req.user es poblado por Passport)
    const userProfile = req.user as UserProfile;
    const googleId = userProfile.id;

    if (!googleId) {
        // Si por alguna razón no hay ID en el perfil de sesión
        return res.status(401).json({ message: 'No se pudo identificar al usuario en la sesión.' });
    }

    // Buscar el usuario en la base de datos por su googleId
    const user = await User.findOne({ googleId });

    if (!user) {
      // Aunque esté autenticado con Google, si no existe en nuestra DB, no puede ser admin
      return res.status(404).json({ message: 'Usuario no encontrado en la base de datos.' });
    }

    // --- Lógica de verificación de administrador MODIFICADA ---
    // Verificar directamente el campo 'isAdmin' del documento del usuario
    if (user.isAdmin === true) {
      // Si el campo isAdmin es true, permitir acceso
      return next();
    } else {
      // Si no es administrador (isAdmin es false o no está definido), denegar acceso
      // Usamos 403 Forbidden porque está autenticado pero no tiene permisos
      return res.status(403).json({ message: 'Acceso denegado: requiere privilegios de administrador.' });
    }
    // --- Fin de la lógica modificada ---

  } catch (error) {
    console.error('Error al verificar rol de administrador:', error);
    return res.status(500).json({ message: 'Error interno del servidor al verificar permisos.' });
  }
};

// Middleware para verificar si el usuario autenticado es administrador
// Nota: Esta función 'isAdminMiddleware' parece redundante o una versión anterior.
// La función 'isAdmin' anterior es la que se usa en admin.routes.ts.
// Considera eliminar o refactorizar esta función si no se usa.
export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Primero, asegurarnos que esté autenticado (aunque isAuthenticated ya debería estar antes en la ruta)
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: 'Acceso no autorizado.' });
  }

  // Obtener el perfil del usuario desde req.user (adjuntado por Passport deserializeUser)
  // Necesitamos asegurarnos que 'req.user' tenga la info de 'isAdmin' o 'email'
  // Ajusta el tipo según lo que realmente adjunta deserializeUser
  // Asumiendo que req.user es del tipo UserProfile como se define en passport.config.ts
  const userProfile = req.user as UserProfile;

  // Verificar si es administrador
  // Usaremos la comparación de email ya que UserProfile tiene el array emails
  // ¡Asegúrate de que deserializeUser adjunte el email a req.user correctamente!
  const ADMIN_EMAIL_CHECK = 'fraan.mujica1@gmail.com'; // Temporalmente hardcodeado, ¡mejor importar!

  if (userProfile.emails && userProfile.emails[0]?.value === ADMIN_EMAIL_CHECK) {
     return next(); // Es administrador, continuar
  } else {
    // Si no cumple ninguna condición de admin
    return res.status(403).json({ message: 'Acceso prohibido. Se requieren permisos de administrador.' });
  }
}; 
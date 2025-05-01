import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { UserProfile } from '../types/auth.types';

// Verificar si estamos en modo desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';

// Middleware para verificar si el usuario está autenticado
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // ¡¡¡ADVERTENCIA DE SEGURIDAD!!!
  // En modo desarrollo, SE ESTÁ SALTANDO la verificación de autenticación.
  // ASEGÚRATE de que NODE_ENV esté configurado como 'production' en el entorno de producción.
  if (isDevelopment) {
    console.error('\n*** ADVERTENCIA: Saltando verificación de autenticación (isAuthenticated) en modo desarrollo. ¡NO USAR EN PRODUCCIÓN! ***\n');
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
  // ¡¡¡ADVERTENCIA DE SEGURIDAD!!!
  // En modo desarrollo, SE ESTÁ SALTANDO la verificación de rol de administrador.
  // ASEGÚRATE de que NODE_ENV esté configurado como 'production' en el entorno de producción.
  if (isDevelopment) {
    console.error('\n*** ADVERTENCIA: Saltando verificación de administrador (isAdmin) en modo desarrollo. ¡NO USAR EN PRODUCCIÓN! ***\n');
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

// La función isAdminMiddleware ha sido eliminada por redundancia.
// La lógica correcta de verificación de administrador está en la función 'isAdmin' anterior. 
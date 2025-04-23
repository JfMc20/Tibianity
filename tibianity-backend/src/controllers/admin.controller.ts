import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import SessionLog from '../models/SessionLog';
import mongoose, { Document } from 'mongoose';
import { UserProfile } from '../types/auth.types'; // Asegurarse que esté importado

/**
 * Clase de controlador para funciones administrativas
 */
class AdminController {
  /**
   * Obtiene todos los usuarios registrados
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>}
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      // Obtener usuarios con proyección (excluyendo datos sensibles si fuera necesario)
      const users = await User.find().select('_id googleId name email photo isAdmin createdAt');
      
      // Mapear los usuarios al formato esperado por el frontend
      const mappedUsers = users.map(user => ({
        _id: user.googleId, // El frontend espera _id como identificador único
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString(),
        photo: user.photo
      }));
      
      // Responder con los usuarios en formato plano, sin envolverlos en un objeto
      res.status(200).json(mappedUsers);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor'
      });
    }
  }

  /**
   * Obtiene todos los registros de sesiones
   * @param {Request} req - Objeto de solicitud Express
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>}
   */
  async getAllSessions(req: Request, res: Response): Promise<void> {
    try {
      // Determinar si hay que aplicar filtros
      const filter: Record<string, any> = {};
      
      // Filtrar por usuario si se proporciona un ID
      if (req.query.userId && req.query.userId !== 'all') {
        // Primero obtener el usuario por su googleId para encontrar el ObjectId
        const user = await User.findOne({ googleId: req.query.userId as string });
        if (user) {
          filter.userId = user._id;
        }
      }
      
      // Filtrar por rango de fechas
      if (req.query.startDate) {
        const startDate = new Date(req.query.startDate as string);
        startDate.setHours(0, 0, 0, 0); // Inicio del día
        filter.loginDate = { $gte: startDate };
      }
      
      if (req.query.endDate) {
        const endDate = new Date(req.query.endDate as string);
        endDate.setHours(23, 59, 59, 999); // Final del día
        if (!filter.loginDate) filter.loginDate = {};
        filter.loginDate.$lte = endDate;
      }
      
      // Obtener sesiones con población del usuario relacionado
      const sessions = await SessionLog.find(filter)
        .populate('userId', 'googleId name email')
        .sort({ loginDate: -1 }); // Ordenar por fecha, más recientes primero
      
      // Mapear las sesiones al formato esperado por el frontend
      const mappedSessions = sessions.map(session => {
        // Usar casting explícito para manejar los tipos correctamente
        const sessionDocument = session as unknown as Document & {
          _id: mongoose.Types.ObjectId;
          userId: any;
          loginDate: Date;
        };
        
        const user = sessionDocument.userId;
        
        return {
          _id: sessionDocument._id.toString(),
          userId: user?.googleId || 'Desconocido',
          userName: user?.name || 'Desconocido',
          startTime: sessionDocument.loginDate.toISOString(),
          endTime: new Date(sessionDocument.loginDate.getTime() + 1800000).toISOString(), // Estimamos 30 minutos por sesión
          duration: 30 // Duración estimada en minutos
        };
      });
      
      // Responder con las sesiones en formato plano
      res.status(200).json(mappedSessions);
    } catch (error) {
      console.error('Error al obtener sesiones:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor'
      });
    }
  }

  /**
   * Promueve un usuario a administrador
   * @param {Request} req - Objeto de solicitud Express (espera :userId en params)
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>}
   */
  async promoteUserToAdmin(req: Request, res: Response): Promise<void> {
    const { userId } = req.params; // userId es el googleId enviado por el frontend

    // Opcional: Verificar que el admin no se promueva a sí mismo
    const requesterProfile = req.user as UserProfile;
    if (requesterProfile && requesterProfile.id === userId) {
      res.status(400).json({ success: false, message: 'No puedes promoverte a ti mismo.' });
      return;
    }

    try {
      // Buscar y actualizar el usuario directamente usando googleId
      const updatedUser = await User.findOneAndUpdate(
        { googleId: userId }, // Buscar por googleId
        { $set: { isAdmin: true } }, // Establecer isAdmin a true
        { new: true } // Devolver el documento actualizado
      ).select('_id googleId name email photo isAdmin createdAt'); // Seleccionar campos para devolver

      if (!updatedUser) {
        res.status(404).json({ success: false, message: 'Usuario no encontrado para promover.' });
        return;
      }

      // Mapear el usuario actualizado al formato esperado
      const mappedUser = {
        _id: updatedUser.googleId,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt.toISOString(),
        photo: updatedUser.photo
      };

      console.log(`✅ Usuario promovido a admin: ${updatedUser.name}`);
      res.status(200).json({ success: true, message: 'Usuario promovido a administrador.', user: mappedUser });

    } catch (error) {
      console.error('Error al promover usuario:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor al promover usuario.'
      });
    }
  }

  /**
   * Degrada un administrador a usuario normal
   * @param {Request} req - Objeto de solicitud Express (espera :userId en params)
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>}
   */
  async demoteAdminToUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params; // userId es el googleId enviado por el frontend

    // MUY IMPORTANTE: Verificar que el admin no se degrade a sí mismo
    const requesterProfile = req.user as UserProfile; // req.user es añadido por Passport
    if (requesterProfile && requesterProfile.id === userId) {
      res.status(400).json({ success: false, message: 'No puedes quitarte los privilegios de administrador a ti mismo.' });
      return;
    }

    try {
      // Buscar y actualizar el usuario directamente usando googleId
      const updatedUser = await User.findOneAndUpdate(
        { googleId: userId }, // Buscar por googleId
        { $set: { isAdmin: false } }, // Establecer isAdmin a false
        { new: true } // Devolver el documento actualizado
      ).select('_id googleId name email photo isAdmin createdAt'); // Seleccionar campos para devolver

      if (!updatedUser) {
        res.status(404).json({ success: false, message: 'Usuario no encontrado para degradar.' });
        return;
      }

      // Mapear el usuario actualizado al formato esperado
      const mappedUser = {
        _id: updatedUser.googleId,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin, // Debería ser false ahora
        createdAt: updatedUser.createdAt.toISOString(),
        photo: updatedUser.photo
      };

      console.log(`✅ Usuario degradado a normal: ${updatedUser.name}`);
      res.status(200).json({ success: true, message: 'Usuario degradado a rol normal.', user: mappedUser });

    } catch (error) {
      console.error('Error al degradar usuario:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor al degradar usuario.'
      });
    }
  }
}

export default new AdminController(); 
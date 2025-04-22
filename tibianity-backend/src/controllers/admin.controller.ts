import { Request, Response } from 'express';
import User from '../models/User';
import SessionLog from '../models/SessionLog';
import mongoose, { Document } from 'mongoose';

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
      const users = await User.find().select('_id googleId name email photo createdAt');
      
      // Mapear los usuarios al formato esperado por el frontend
      const mappedUsers = users.map(user => ({
        _id: user.googleId, // El frontend espera _id como identificador único
        name: user.name,
        email: user.email,
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
          userId: user.googleId, // El frontend espera usar googleId como userId
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
}

export default new AdminController(); 
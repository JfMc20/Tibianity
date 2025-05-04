import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import SessionLog from '../models/SessionLog';
import Subscriber from '../models/Subscriber'; // Importar el modelo Subscriber
import mongoose, { Document } from 'mongoose';
import { UserProfile } from '../types/auth.types'; // Asegurarse que esté importado
import { Resend } from 'resend'; // Importar Resend

// Instanciar Resend fuera de la clase para reutilizar la instancia
// Asegúrate de que RESEND_API_KEY está en tus variables de entorno
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL; // Obtener el email remitente

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
      // Obtener usuarios incluyendo canAccessPublicSite
      const users = await User.find().select('_id googleId name email photo isAdmin canAccessPublicSite createdAt');
      
      // Mapear los usuarios al formato esperado por el frontend
      const mappedUsers = users.map(user => ({
        _id: user.googleId,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        canAccessPublicSite: user.canAccessPublicSite,
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

      console.log(`✅ Administrador degradado a usuario: ${updatedUser.name}`);
      res.status(200).json({ success: true, message: 'Administrador degradado a usuario.', user: mappedUser });

    } catch (error) {
      console.error('Error al degradar usuario:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor al degradar usuario.'
      });
    }
  }

  /**
   * Otorga acceso público al sitio a un usuario
   * @param {Request} req - Espera :userId (googleId) en params
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>}
   */
  async grantPublicAccess(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    try {
      const updatedUser = await User.findOneAndUpdate(
        { googleId: userId },
        { $set: { canAccessPublicSite: true } },
        { new: true }
      ).select('_id googleId name email photo isAdmin canAccessPublicSite createdAt'); // Incluir el nuevo campo

      if (!updatedUser) {
        res.status(404).json({ success: false, message: 'Usuario no encontrado para otorgar acceso.' });
        return;
      }

      // Mapear para consistencia (aunque el frontend podría usar el objeto directo)
      const mappedUser = {
        _id: updatedUser.googleId,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        canAccessPublicSite: updatedUser.canAccessPublicSite,
        createdAt: updatedUser.createdAt.toISOString(),
        photo: updatedUser.photo
      };
      
      console.log(`✅ Acceso público otorgado a: ${updatedUser.name}`);
      res.status(200).json({ success: true, message: 'Acceso público otorgado.', user: mappedUser });

    } catch (error) {
      console.error('Error al otorgar acceso público:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor al otorgar acceso.'
      });
    }
  }

  /**
   * Revoca el acceso público al sitio a un usuario
   * @param {Request} req - Espera :userId (googleId) en params
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>}
   */
  async revokePublicAccess(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    try {
      const updatedUser = await User.findOneAndUpdate(
        { googleId: userId },
        { $set: { canAccessPublicSite: false } },
        { new: true }
      ).select('_id googleId name email photo isAdmin canAccessPublicSite createdAt'); // Incluir el nuevo campo

      if (!updatedUser) {
        res.status(404).json({ success: false, message: 'Usuario no encontrado para revocar acceso.' });
        return;
      }
      
      // Mapear para consistencia
      const mappedUser = {
        _id: updatedUser.googleId,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        canAccessPublicSite: updatedUser.canAccessPublicSite,
        createdAt: updatedUser.createdAt.toISOString(),
        photo: updatedUser.photo
      };

      console.log(`✅ Acceso público revocado a: ${updatedUser.name}`);
      res.status(200).json({ success: true, message: 'Acceso público revocado.', user: mappedUser });

    } catch (error) {
      console.error('Error al revocar acceso público:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor al revocar acceso.'
      });
    }
  }

  /**
   * Envía un correo a todos los suscriptores activos usando Resend
   * @param {Request} req - Objeto de solicitud Express (espera subject y body en el cuerpo)
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>}
   */
  async sendNewsletter(req: Request, res: Response): Promise<void> {
    const { subject, body } = req.body;

    if (!subject || !body) {
      res.status(400).json({ success: false, message: 'El asunto y el cuerpo del correo son obligatorios.' });
      return;
    }

    if (!process.env.RESEND_API_KEY || !fromEmail) {
       console.error('Error: RESEND_API_KEY o RESEND_FROM_EMAIL no están configuradas en las variables de entorno.');
       res.status(500).json({ success: false, message: 'Error de configuración del servidor para envío de correos.' });
       return;
    }

    try {
      // Obtener SOLO suscriptores activos
      const activeSubscribers = await Subscriber.find({ status: 'active' }).select('email').lean();

      if (activeSubscribers.length === 0) {
        res.status(404).json({ success: false, message: 'No hay suscriptores activos para enviar el boletín.' });
        return;
      }

      const emails = activeSubscribers.map(sub => sub.email);

      console.log(`INFO: Iniciando envío de newsletter con asunto "${subject}" a ${emails.length} suscriptores activos desde ${fromEmail}.`);

      const { data, error } = await resend.emails.send({
        from: fromEmail,      
        to: fromEmail,        
        bcc: emails,          
        subject: subject,     
        html: body,           
      });

      if (error) {
        console.error('Error al enviar correos con Resend:', error);
        res.status(502).json({ success: false, message: `Error del servicio de envío: ${error.message}` });
        return;
      }

      console.log(`✅ Newsletter enviado exitosamente a ${emails.length} suscriptores activos. ID de envío: ${data?.id}`);
      res.status(200).json({ success: true, message: `Correo enviado exitosamente a ${emails.length} suscriptores activos.` });

    } catch (error) {
      console.error('Error general al procesar el envío de newsletter:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor al procesar el envío.'
      });
    }
  }

  /**
   * Elimina todos los suscriptores con estado 'pending'.
   * @param {Request} _req - Objeto de solicitud Express (no usado aquí)
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>}
   */
  async deletePendingSubscribers(_req: Request, res: Response): Promise<void> {
    try {
      const result = await Subscriber.deleteMany({ status: 'pending' });
      const count = result.deletedCount || 0;
      
      console.log(`🧹 Limpieza: Se eliminaron ${count} suscriptores pendientes.`);
      res.status(200).json({ 
        success: true, 
        message: `Se eliminaron ${count} suscriptores pendientes.`,
        deletedCount: count
      });

    } catch (error) {
      console.error('Error al eliminar suscriptores pendientes:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor al limpiar suscriptores.'
      });
    }
  }

  /**
   * Elimina un suscriptor específico por su email.
   * @param {Request} req - Objeto de solicitud Express (espera :email en params)
   * @param {Response} res - Objeto de respuesta Express
   * @returns {Promise<void>}
   */
  async deleteSubscriberByEmail(req: Request, res: Response): Promise<void> {
    const { email } = req.params;

    if (!email) {
      res.status(400).json({ success: false, message: 'Se requiere un email para eliminar.' });
      return;
    }
    
    // Validar formato básico de email (opcional, ya que viene de admin)
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ success: false, message: 'El formato del email no es válido.' });
        return;
    }

    try {
      const result = await Subscriber.deleteOne({ email: email.toLowerCase() }); // Buscar en minúsculas
      
      if (result.deletedCount === 0) {
        console.log(`🧹 Intento de eliminar email no encontrado: ${email}`);
        res.status(404).json({ success: false, message: `Suscriptor con email ${email} no encontrado.` });
        return;
      }

      console.log(`🧹 Suscriptor eliminado: ${email}`);
      res.status(200).json({ 
        success: true, 
        message: `Suscriptor con email ${email} eliminado correctamente.`,
        deletedCount: result.deletedCount
      });

    } catch (error) {
      console.error(`Error al eliminar suscriptor ${email}:`, error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno del servidor al eliminar suscriptor.'
      });
    }
  }
}

export default new AdminController(); 
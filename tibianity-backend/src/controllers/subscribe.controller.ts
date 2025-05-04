import { Request, Response } from 'express';
import Subscriber from '../models/Subscriber'; // Importa el modelo Subscriber
import mongoose from 'mongoose';
import crypto from 'crypto'; // Importar crypto para tokens
import { Resend } from 'resend'; // Importar Resend
import dotenv from 'dotenv';

// Cargar variables de entorno para Resend y URL base
dotenv.config();

// Instanciar Resend (asegúrate que RESEND_API_KEY está en .env o config)
const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
// Necesitamos la URL base del backend para el enlace de confirmación
// Intenta obtenerla de env, o constrúyela (ajusta según tu setup)
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'; // Añadir URL del Frontend

// Función auxiliar para enviar el email de confirmación
async function sendConfirmationEmail(email: string, token: string) {
  if (!RESEND_FROM_EMAIL) {
    console.error('Error: RESEND_FROM_EMAIL no está configurado.');
    throw new Error('La configuración del servidor para enviar correos está incompleta.');
  }
  
  const confirmationUrl = `${BACKEND_URL}/api/subscribe/confirm/${token}`;
  const emailHtml = `
    <h1>Confirma tu Suscripción</h1>
    <p>¡Gracias por suscribirte a Tibianity!</p>
    <p>Por favor, haz clic en el siguiente enlace para confirmar tu dirección de correo electrónico:</p>
    <a href="${confirmationUrl}" target="_blank">Confirmar mi suscripción</a>
    <p>Si no te suscribiste, puedes ignorar este mensaje.</p>
    <p>Este enlace expirará en 1 hora.</p>
  `;

  try {
    await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: email,
      subject: 'Confirma tu suscripción a Tibianity',
      html: emailHtml,
    });
    console.log(`Email de confirmación enviado a ${email}`);
  } catch (error) {
    console.error(`Error al enviar email de confirmación a ${email}:`, error);
    // Lanzar el error para que sea manejado en handleSubscription
    throw new Error('No se pudo enviar el correo de confirmación.'); 
  }
}

/**
 * Controlador para manejar la suscripción (con doble opt-in).
 */
export const handleSubscription = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'El correo electrónico es obligatorio y debe ser válido.' });
  }

  // Sanitizar email (trim ya lo hace el modelo, pero por si acaso)
  const sanitizedEmail = email.trim().toLowerCase();

  try {
    let subscriber = await Subscriber.findOne({ email: sanitizedEmail });

    if (subscriber && subscriber.status === 'active') {
      console.log(`Suscripción activa ya existente para: ${sanitizedEmail}`);
      return res.status(200).json({ message: 'Ya estás suscrito.' });
    }

    // Generar token y fecha de expiración (1 hora)
    const confirmationToken = crypto.randomBytes(20).toString('hex');
    const tokenExpires = new Date(Date.now() + 3600000); // 1 hora en ms

    if (subscriber) {
      // Email existe pero está pendiente, actualizar token y reenviar email
      console.log(`Actualizando token para suscripción pendiente: ${sanitizedEmail}`);
      subscriber.confirmationToken = confirmationToken;
      subscriber.tokenExpires = tokenExpires;
      subscriber.subscribedAt = new Date(); // Actualizar fecha por si acaso
      await subscriber.save();
    } else {
      // Crear nuevo suscriptor pendiente
      console.log(`Creando nueva suscripción pendiente para: ${sanitizedEmail}`);
      subscriber = new Subscriber({
        email: sanitizedEmail,
        status: 'pending',
        confirmationToken,
        tokenExpires,
      });
      await subscriber.save();
    }

    // Enviar email de confirmación
    await sendConfirmationEmail(sanitizedEmail, confirmationToken);

    // Mensaje genérico al usuario
    return res.status(subscriber ? 200 : 201).json({ 
        message: '¡Gracias por suscribirte! Revisa tu correo electrónico para confirmar tu suscripción.' 
    });

  } catch (error) {
    // Manejo de errores
    if (error instanceof mongoose.Error.ValidationError) {
       const messages = Object.values(error.errors).map(e => e.message);
       console.error('Error de validación al suscribir:', messages);
       return res.status(400).json({ message: messages[0] || 'Correo electrónico inválido.' });
    } else if (error instanceof Error && error.message.includes('confirmación')) {
       // Error específico al enviar el email
       return res.status(500).json({ message: error.message }); 
    } else {
      console.error('Error inesperado al procesar la suscripción:', error);
      return res.status(500).json({ message: 'Error interno del servidor al procesar la suscripción.' });
    }
  }
};

// --- NUEVA FUNCIÓN PARA CONFIRMAR (con redirecciones al frontend) --- 
/**
 * Controlador para confirmar la suscripción vía token y redirigir al frontend.
 */
export const confirmSubscription = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  try {
    const subscriber = await Subscriber.findOne({
      confirmationToken: token,
      tokenExpires: { $gt: Date.now() } 
    });

    if (!subscriber) {
      console.log(`Token de confirmación inválido o expirado: ${token}`);
      // Redirigir a página de token inválido/expirado en el frontend
      res.redirect(`${FRONTEND_URL}/subscription-invalid`);
      return;
    }

    // Activar suscripción y limpiar token
    subscriber.status = 'active';
    subscriber.confirmationToken = undefined;
    subscriber.tokenExpires = undefined;
    await subscriber.save();

    console.log(`Suscripción confirmada para: ${subscriber.email}`);
    // Redirigir a página de éxito en el frontend
    res.redirect(`${FRONTEND_URL}/subscription-confirmed`);

  } catch (error) {
    console.error('Error al confirmar la suscripción:', error);
    // Redirigir a página de error genérico en el frontend
    res.redirect(`${FRONTEND_URL}/subscription-error`);
  }
}; 
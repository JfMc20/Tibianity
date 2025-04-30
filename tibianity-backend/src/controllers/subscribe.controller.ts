import { Request, Response } from 'express';
import Subscriber from '../models/Subscriber'; // Importa el modelo Subscriber
import mongoose from 'mongoose';

/**
 * Controlador para manejar la suscripción de nuevos correos electrónicos.
 */
export const handleSubscription = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;

  // Validación básica de entrada
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'El correo electrónico es obligatorio.' });
  }

  try {
    // Intenta crear un nuevo suscriptor
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    console.log(`Nuevo suscriptor registrado: ${email}`);
    return res.status(201).json({ message: '¡Suscripción exitosa!' });

  } catch (error) {
    // Manejo de errores específicos de Mongoose/MongoDB
    if (error instanceof mongoose.Error.ValidationError) {
       // Captura errores de validación del esquema (ej. formato de email inválido)
       const messages = Object.values(error.errors).map(e => e.message);
       console.error('Error de validación al suscribir:', messages);
       return res.status(400).json({ message: messages[0] || 'Datos inválidos.' }); // Devuelve el primer mensaje de error
    } else if (error instanceof Error && 'code' in error && error.code === 11000) {
        // Captura el error de índice único duplicado (correo ya existe)
        console.warn(`Intento de suscripción duplicado: ${email}`);
        // Consideramos esto como un éxito para el usuario, ya que ya está suscrito
        return res.status(200).json({ message: 'Ya estás suscrito.' });
    } else {
      // Otros errores inesperados
      console.error('Error inesperado al procesar la suscripción:', error);
      return res.status(500).json({ message: 'Error interno del servidor al procesar la suscripción.' });
    }
  }
}; 
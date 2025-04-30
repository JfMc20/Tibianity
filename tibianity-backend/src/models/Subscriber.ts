import mongoose, { Schema, Document } from 'mongoose';

// Interface para definir la estructura del documento Subscriber
export interface ISubscriber extends Document {
  email: string;
  subscribedAt: Date;
}

// Esquema Mongoose para Subscriber
const SubscriberSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio.'],
    unique: true, // Asegura que no haya correos duplicados
    lowercase: true, // Guarda los correos en minúsculas
    trim: true, // Elimina espacios al inicio y al final
    match: [ // Validación básica de formato de email
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, introduce un correo electrónico válido.'
    ]
  },
  subscribedAt: {
    type: Date,
    default: Date.now // Fecha de suscripción por defecto
  }
});

// Crear y exportar el modelo Subscriber
const Subscriber = mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

export default Subscriber; 
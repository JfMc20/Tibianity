import mongoose, { Schema, Document } from 'mongoose';

// Interface para definir la estructura del documento Subscriber
export interface ISubscriber extends Document {
  email: string;
  subscribedAt: Date;
  status: 'pending' | 'active'; // Nuevo campo de estado
  confirmationToken?: string;   // Token para confirmar (opcional)
  tokenExpires?: Date;          // Fecha de expiración del token (opcional)
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
  },
  // Nuevos campos para doble opt-in
  status: {
    type: String,
    enum: ['pending', 'active'], // Solo permite estos dos valores
    default: 'pending',          // Por defecto, la suscripción está pendiente
    required: true
  },
  confirmationToken: {
    type: String,
    required: false // Solo necesario cuando status es 'pending'
  },
  tokenExpires: {
    type: Date,
    required: false // Solo necesario cuando status es 'pending'
  }
});

// Opcional: Añadir un índice al token para búsquedas rápidas
SubscriberSchema.index({ confirmationToken: 1 });

// Crear y exportar el modelo Subscriber
const Subscriber = mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

export default Subscriber; 
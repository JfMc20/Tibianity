import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

/**
 * Interfaz que representa un registro de sesión en la base de datos
 */
export interface ISessionLog extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  ipAddress: string;
  loginDate: Date;
  userAgent: string;
}

/**
 * Esquema para el modelo de registro de sesiones
 */
const SessionLogSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  loginDate: {
    type: Date,
    default: Date.now
  },
  userAgent: {
    type: String,
    required: true
  }
});

// Crear y exportar el modelo
export default mongoose.model<ISessionLog>('SessionLog', SessionLogSchema); 
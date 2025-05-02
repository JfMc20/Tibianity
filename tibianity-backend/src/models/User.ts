import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interfaz que representa un usuario en la base de datos
 */
export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  photo: string;
  isAdmin: boolean;
  canAccessPublicSite?: boolean;
  createdAt: Date;
}

/**
 * Esquema para el modelo de usuario
 */
const UserSchema: Schema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  canAccessPublicSite: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Crear y exportar el modelo
export default mongoose.model<IUser>('User', UserSchema); 
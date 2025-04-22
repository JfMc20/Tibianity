import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * Función para conectar a la base de datos MongoDB
 * Utiliza la URI de conexión especificada en las variables de entorno
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI: string = process.env.MONGO_URI || '';
    
    if (!mongoURI) {
      throw new Error('La variable de entorno MONGO_URI no está definida');
    }
    
    console.log('Intentando conectar a MongoDB...');
    
    // Configurar mongoose para usar la nueva API de URL del parser
    mongoose.set('strictQuery', false);
    
    // Agregar opciones básicas de conexión
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4 // Forzar IPv4
    };
    
    // Conectar a MongoDB Atlas
    await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB conectado: ${mongoose.connection.host}`);
    
    // Verificar la conexión
    if (mongoose.connection.db) {
      // Opcional: realizar un ping para confirmar la conexión
      try {
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Ping exitoso. La conexión a MongoDB Atlas es correcta!");
      } catch (pingError) {
        console.warn("No se pudo realizar ping, pero la conexión parece estar establecida.");
      }
    }
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:');
    
    // Proporcionar información detallada del error
    if (error instanceof Error) {
      console.error(`Mensaje: ${error.message}`);
      if (error.stack) {
        console.error(`Stack: ${error.stack}`);
      }
      if (error.name === 'MongoServerSelectionError') {
        console.error('Este es un error de selección de servidor MongoDB. Posibles causas:');
        console.error('1. Tu IP no está en la lista blanca de MongoDB Atlas');
        console.error('2. Las credenciales son incorrectas');
        console.error('3. El nombre de la base de datos es incorrecto');
        console.error('4. Hay un firewall bloqueando la conexión');
      }
    } else {
      console.error(error);
    }
    
    // Salir con error en caso de fallo en la conexión
    process.exit(1);
  }
}; 
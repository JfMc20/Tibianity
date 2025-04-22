import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { UserProfile } from '../types/auth.types';
import User from '../models/User';
import SessionLog from '../models/SessionLog';

// Cargar variables de entorno
dotenv.config();

// Verificar que las variables de entorno estén definidas
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL; // Obtener la URL base del backend

console.log(`[Passport Config] BACKEND_URL leído de process.env: ${BACKEND_URL}`);

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !BACKEND_URL) {
  console.error(
    'Error: Variables de entorno GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET y BACKEND_URL son requeridas'
  );
  process.exit(1);
}

// Construir dinámicamente
const callbackURL = `${BACKEND_URL}/auth/google/callback`; 
console.log(`[Passport Config] callbackURL construida: ${callbackURL}`);

// Configurar la estrategia de Google
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL, // Usar la variable
      scope: ['profile', 'email'],
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Verificar si el usuario ya existe en la base de datos
        let user = await User.findOne({ googleId: profile.id });
        
        // Si el usuario no existe, crearlo
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails && profile.emails[0]?.value ? profile.emails[0].value : '',
            photo: profile.photos && profile.photos[0]?.value ? profile.photos[0].value : ''
          });
          console.log(`✅ Nuevo usuario creado: ${user.name}`);
        }
        
        // Registrar el inicio de sesión
        try {
          await SessionLog.create({
            userId: user._id,
            ipAddress: req.ip || req.socket.remoteAddress || 'desconocida',
            userAgent: req.headers['user-agent'] || 'desconocido',
            loginDate: new Date()
          });
          console.log(`✅ Sesión registrada para: ${user.name}`);
        } catch (logError) {
          console.error('❌ Error al registrar sesión:', logError);
          // No interrumpir el flujo de autenticación si falla el registro de sesión
        }
        
        // Convertir a formato UserProfile para mantener compatibilidad con el resto del código
        const userProfile: UserProfile = {
          id: user.googleId,
          displayName: user.name,
          emails: profile.emails,
          photos: profile.photos,
          provider: profile.provider
        };
        
        return done(null, userProfile);
      } catch (error) {
        console.error('❌ Error al procesar usuario:', error);
        return done(error as Error, undefined);
      }
    }
  )
);

// Serializar usuario para almacenar en la sesión
passport.serializeUser((user, done) => {
  done(null, (user as UserProfile).id);
});

// Deserializar usuario desde la sesión
passport.deserializeUser(async (id: string, done) => {
  try {
    // Buscar usuario por googleId
    const user = await User.findOne({ googleId: id });
    
    if (!user) {
      return done(new Error('Usuario no encontrado'), null);
    }
    
    // Convertir a UserProfile para mantener compatibilidad
    const userProfile: UserProfile = {
      id: user.googleId,
      displayName: user.name,
      emails: [{ value: user.email }],
      photos: [{ value: user.photo }],
      provider: 'google'
    };
    
    done(null, userProfile);
  } catch (error) {
    done(error, null);
  }
});

export default passport; 
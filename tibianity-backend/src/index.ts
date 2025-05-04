import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import passport from './config/passport.config';
import newsRoutes from './routes/news.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import subscribeRoutes from './routes/subscribe.routes';
import { connectDB } from './config/db';
import { globalLimiter, subscribeLimiter } from './config/rateLimiters.config';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar app
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);
const SESSION_SECRET = process.env.SESSION_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const MONGO_URI = process.env.MONGO_URI;

// Verificar que SESSION_SECRET y MONGO_URI estén definidos
if (!SESSION_SECRET) {
  console.error('Error: La variable de entorno SESSION_SECRET es requerida pero no está definida.');
  process.exit(1); // Detener la aplicación si no hay secreto
}
if (!MONGO_URI) {
  console.error('Error: La variable de entorno MONGO_URI es requerida pero no está definida.');
  process.exit(1);
}

// Configuración CORS mejorada
const corsOptions = {
  origin: process.env.NODE_ENV === 'development'
    ? [FRONTEND_URL, 'http://127.0.0.1:3000', 'http://localhost:3000', 'http://localhost:3001'] // Orígenes permitidos en desarrollo
    : [FRONTEND_URL], // En producción, solo el frontend configurado
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control'],
  credentials: true, // Importante para permitir cookies
  maxAge: 86400, // Caché preflight por 24 horas
  optionsSuccessStatus: 200 // Para navegadores antiguos
};

// Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Confiar en el primer proxy (Traefik) para determinar si la conexión es segura
app.set('trust proxy', 1);

// Aplicar Rate Limiters
// Global para /api (excluyendo /api/subscribe que tendrá el suyo), /auth, /admin
app.use('/api', (req, res, next) => { 
  // Skip limiter si la ruta es /api/subscribe
  if (req.path === '/subscribe') {
    return next();
  }
  globalLimiter(req, res, next);
});
app.use('/auth', globalLimiter); // Mantener global para auth (o usar authLimiter si se prefiere)
app.use('/admin', globalLimiter); // Mantener global para admin

// Limiter específico para /api/subscribe ANTES de montar la ruta
app.use('/api/subscribe', subscribeLimiter);

// Configurar sesiones
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
  })
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Log de solicitudes para depuración
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  // Agregar encabezados CORS adicionales para cada respuesta
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Si es una solicitud OPTIONS prelight, responder inmediatamente
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Rutas
app.use('/api/news', newsRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/subscribe', subscribeRoutes);

// Ruta de prueba
app.get('/', (_req, res) => {
  res.json({ message: 'API de Tibianity funcionando correctamente' });
});

// Capturar errores de rutas no encontradas
app.use((_req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`API disponible en: http://localhost:${PORT}`);
  console.log(`Autenticación Google disponible en: http://localhost:${PORT}/auth/google`);
}); 
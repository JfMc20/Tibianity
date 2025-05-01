import rateLimit from 'express-rate-limit';

// Límite global para la mayoría de las rutas API, Auth y Admin
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // Límite generoso global por IP
  message: { message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo después de 15 minutos' }, // Enviar objeto JSON
  standardHeaders: true, // Devolver información del límite en las cabeceras `RateLimit-*`
  legacyHeaders: false, // Deshabilitar las cabeceras `X-RateLimit-*`
  // Opcional: skipSuccessfulRequests: true // Para limitar solo errores o abusos
});

// Límite más estricto para la ruta de suscripción pública
export const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Limitar cada IP a 10 suscripciones por hora
  message: { message: 'Ha alcanzado el límite de suscripciones desde esta IP.' }, // Enviar objeto JSON
  standardHeaders: true,
  legacyHeaders: false,
});

// Límite para rutas de autenticación (ej. inicio de sesión, registro si se añade)
// Ajustar 'max' según la sensibilidad (ej. 5-10 intentos por hora)
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 20, // Límite moderado para intentos de autenticación por hora
    message: { message: 'Demasiados intentos de autenticación desde esta IP, intente más tarde.' }, // Enviar objeto JSON
    standardHeaders: true,
    legacyHeaders: false,
    // skipSuccessfulRequests: false // Importante: Limitar incluso los éxitos aquí si se desea
});

// Puedes añadir otros limitadores específicos aquí si los necesitas 
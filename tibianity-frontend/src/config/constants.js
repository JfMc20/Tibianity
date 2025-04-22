/**
 * Archivo de configuración centralizada
 * Contiene constantes y configuraciones usadas en toda la aplicación
 */

// Define la URL base para las llamadas a la API.
// Usa una variable de entorno si está disponible durante el build,
// o usa una ruta relativa /api que será manejada por el proxy de Nginx.
export const API_URL = process.env.REACT_APP_API_URL || '/api';

// URLs de API específicas
export const AUTH_API = {
  LOGIN: `${API_URL}/auth/google`,
  LOGOUT: `${API_URL}/auth/logout`,
  PROFILE: `${API_URL}/auth/profile`
};

export const ADMIN_API = {
  USERS: `${API_URL}/admin/users`,
  SESSIONS: `${API_URL}/admin/sessions`
};

// Lista de emails de administradores
export const ADMIN_EMAILS = [
  'admin@tibianity.com',
  'fraan.mujica1@gmail.com'
];

// Email del administrador principal con acceso durante "Próximamente"
export const ADMIN_EMAIL = 'fraan.mujica1@gmail.com';

// Función auxiliar para verificar si un email es de administrador
export const isAdminEmail = (email) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}; 
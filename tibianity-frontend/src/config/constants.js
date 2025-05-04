/**
 * Centralized configuration file
 * Contains constants and configurations used throughout the application
 */

// Defines the base URL for API calls.
// Uses an environment variable if available during build,
// or uses a relative path /api which will be handled by the Nginx proxy.
export const API_URL = process.env.REACT_APP_API_URL || '/api';


// URLs de API específicas
export const AUTH_API = {
  LOGIN: `${API_URL}/auth/google`,
  LOGOUT: `${API_URL}/auth/logout`,
  PROFILE: `${API_URL}/auth/profile`
};

export const ADMIN_API = {
  USERS: `${API_URL}/admin/users`,
  SESSIONS: `${API_URL}/admin/sessions`,
  SUBSCRIBERS: `${API_URL}/admin/subscribers`
}; 
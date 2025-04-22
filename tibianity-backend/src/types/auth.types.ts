export interface UserProfile {
  id: string;
  displayName: string;
  emails?: { value: string; type?: string }[];
  photos?: { value: string }[];
  provider: string;
}

// Extender Express.Request para incluir propiedad user
declare global {
  namespace Express {
    interface User extends UserProfile {}
  }
} 
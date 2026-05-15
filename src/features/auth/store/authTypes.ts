export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAppReady: boolean; 
  isFirstLaunch: boolean;
  isLoading: boolean;
  error: string | null;
}
export type Role = 'member' | 'user';

export interface User {
  id: string | number;
  name: string;
  role: Role;
  email?: string;
  phone?: string;
  
  // Member Specific Fields
  member_id?: string;
  employee_code?: string; 
  address?: string | null;
  designation?: string | null;
  join_date?: string | null;
  distributor_id?: number | null;
  
  // System Fields
  status?: number;      
  device_token?: string | null;
  otp?: string | null;
  otp_expire_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAppReady: boolean; 
  isFirstLaunch: boolean;
  isLoading: boolean;
  error: string | null;
}
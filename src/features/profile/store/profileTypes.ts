export interface UserProfile {
  id: number | string;
  employee_code: string | null;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  designation: string | null;
  join_date: string | null;
  distributor_id: number | string | null;
  distributor_name: string | null;
  status: number;
}

export interface ProfileState {
  data: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}
export interface Slider {
  id: number;
  title: string;
  image: string;
  status: number;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  status: string;
}

export interface DistributorProduct {
  id: number;
  distributor_id: number;
  product_id: number;
  actual_amount: string;
  distributor_amount: string;
  product: Product;
}

export interface Distributor {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  address: string;
  sector_name: string;
  status: number;
}

export interface SubscriptionUser {
  id: number;
  subscription_cost: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  subscription_status: number; 
  transaction_id: string | null;
  card_number?: string | null; // <--- ADDED DYNAMIC CARD NUMBER
}

export interface HomeData {
  sliders: Slider[];
  user?: SubscriptionUser; // <--- The single source of truth
  best_selling_products?: Product[];
  featured_products?: Product[];
  distributor_products?: DistributorProduct[];
  distributor?: Distributor;
}

export interface HomeState {
  data: HomeData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}
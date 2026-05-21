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

export interface DigitalId {
  id: number;
  member_id: number;
  name: string;
  cart_number: string;
  expiry_date: string;
  status: number;
}

export interface HomeData {
  sliders: Slider[];
  best_selling_products: Product[];
  featured_products: Product[];
  digital_ids: DigitalId[];
}

export interface HomeState {
  data: HomeData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
}
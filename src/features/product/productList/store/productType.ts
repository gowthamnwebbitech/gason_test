export interface Product {
  product_id: number;
  name: string;
  image: string;
  price: string | number;
}

export interface ProductResponse {
  status: boolean;
  message: string;
  offset: number;
  next_offset: number;
  total_products: number;
  data: Product[];
}

export interface ProductState {
  items: Product[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  offset: number;
  hasMore: boolean;
  searchQuery: string;
}
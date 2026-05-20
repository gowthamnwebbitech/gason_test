import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductState } from './productType';
import { fetchProducts, searchProducts } from './productThunks';

const initialState: ProductState = {
  items: [],
  loading: false,
  loadingMore: false,
  error: null,
  offset: 0,
  hasMore: true,
  searchQuery: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.items = [];
      state.offset = 0;
      state.hasMore = true;
    },
    resetProducts: (state) => {
      state.items = [];
      state.offset = 0;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Products ---
      .addCase(fetchProducts.pending, (state, action) => {
        if (action.meta.arg.offset === 0) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        
        const newItems = action.payload.data;
        
        if (action.meta.arg.offset === 0) {
          state.items = newItems;
        } else {
          // Deduplicate items based on product_id
          const existingIds = new Set(state.items.map(p => p.product_id));
          const uniqueNewItems = newItems.filter(p => !existingIds.has(p.product_id));
          state.items = [...state.items, ...uniqueNewItems];
        }

        state.offset = action.payload.next_offset;
        state.hasMore = newItems.length > 0 && action.payload.next_offset !== 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload as string;
      })
      
      // --- Search Products ---
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.hasMore = false; // Disable infinite scroll during search
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, clearSearch, resetProducts } = productSlice.actions;
export default productSlice.reducer;
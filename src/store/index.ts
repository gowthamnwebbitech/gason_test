// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authReducer } from '@/features/auth/store';
import profileReducer from '@/features/profile/store/profileSlice'; 
import productReducer from '@/features/product/productList/store/productSlice';
import homeReducer from '@/features/home/store/homeSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer, 
    product: productReducer, 
    home: homeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
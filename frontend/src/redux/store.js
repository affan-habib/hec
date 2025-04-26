import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './slices/sidebarSlice';

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    // Add other reducers here as needed
  },
});

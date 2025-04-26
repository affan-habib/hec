import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Get initial state from cookies or default to false (expanded)
const getInitialState = () => {
  try {
    const savedState = Cookies.get('sidebarCollapsed');
    if (savedState !== undefined) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading sidebar state from cookies:', error);
  }
  return false; // Default to expanded sidebar
};

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    isCollapsed: getInitialState(),
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isCollapsed = !state.isCollapsed;
      // Save to cookies
      try {
        Cookies.set('sidebarCollapsed', JSON.stringify(state.isCollapsed), { expires: 7 });
      } catch (error) {
        console.error('Error saving sidebar state to cookies:', error);
      }
    },
    setSidebarState: (state, action) => {
      state.isCollapsed = action.payload;
      // Save to cookies
      try {
        Cookies.set('sidebarCollapsed', JSON.stringify(state.isCollapsed), { expires: 7 });
      } catch (error) {
        console.error('Error saving sidebar state to cookies:', error);
      }
    },
  },
});

export const { toggleSidebar, setSidebarState } = sidebarSlice.actions;

// Selectors
export const selectSidebarState = (state) => state.sidebar.isCollapsed;

export default sidebarSlice.reducer;

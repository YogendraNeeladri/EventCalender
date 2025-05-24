import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventsSlice';

const store = configureStore({
  reducer: {
    events: eventsReducer,
  },
});

export default store; 

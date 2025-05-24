import { createSlice } from '@reduxjs/toolkit';
import { isWithinInterval, parseISO } from 'date-fns';

const loadEventsFromStorage = () => {
  try {
    const events = localStorage.getItem('calendarEvents');
    return events ? JSON.parse(events) : [];
  } catch (error) {
    console.error('Error loading events from storage:', error);
    return [];
  }
};

const saveEventsToStorage = (events) => {
  try {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events to storage:', error);
  }
};

const checkEventConflict = (events, newEvent) => {
  const newEventStart = parseISO(newEvent.start);
  const newEventEnd = parseISO(newEvent.end);

  return events.some(event => {
    if (event.id === newEvent.id) return false;
    
    const eventStart = parseISO(event.start);
    const eventEnd = parseISO(event.end);

    return (
      isWithinInterval(newEventStart, { start: eventStart, end: eventEnd }) ||
      isWithinInterval(newEventEnd, { start: eventStart, end: eventEnd }) ||
      isWithinInterval(eventStart, { start: newEventStart, end: newEventEnd })
    );
  });
};

const initialState = {
  events: loadEventsFromStorage(),
  selectedEvent: null,
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action) => {
      if (checkEventConflict(state.events, action.payload)) {
        state.error = 'Event conflicts with existing events';
        return;
      }
      state.events.push(action.payload);
      saveEventsToStorage(state.events);
      state.error = null;
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        const otherEvents = state.events.filter(event => event.id !== action.payload.id);
        if (checkEventConflict(otherEvents, action.payload)) {
          state.error = 'Event conflicts with existing events';
          return;
        }
        state.events[index] = action.payload;
        saveEventsToStorage(state.events);
        state.error = null;
      }
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
      saveEventsToStorage(state.events);
      state.error = null;
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
      state.error = null;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addEvent,
  updateEvent,
  deleteEvent,
  setSelectedEvent,
  clearSelectedEvent,
  clearError,
} = eventsSlice.actions;

export default eventsSlice.reducer; 

// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import playersReducer from './slices/playersSlice';
import sessionsReducer from './slices/sessionsSlice';
import authReducer from './slices/authSlice';

// Cargar estado inicial desde localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('fitnessTrackerState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

// Guardar estado en localStorage
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('fitnessTrackerState', serializedState);
    } catch (err) {
        console.error('Error saving state:', err);
    }
};

const store = configureStore({
    reducer: {
        auth: authReducer,
        players: playersReducer,
        sessions: sessionsReducer,
    },
    preloadedState: loadState(),
});

// Guardar en localStorage cada vez que cambie el estado
store.subscribe(() => {
    saveState({
        players: store.getState().players,
        sessions: store.getState().sessions,
        auth: store.getState().auth,
    });
});

export default store;
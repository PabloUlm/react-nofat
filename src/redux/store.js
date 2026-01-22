// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import playersReducer from './slices/playersSlice';
import sessionsReducer from './slices/sessionsSlice';
import authReducer from './slices/authSlice';
import workoutsReducer from './slices/workoutsSlice';
import { Preferences } from '@capacitor/preferences';

// Clave para almacenar el estado
const STATE_KEY = 'fitnessTrackerState';

// Cargar estado inicial desde Capacitor Preferences
const loadState = async () => {
    try {
        const { value } = await Preferences.get({ key: STATE_KEY });
        if (value === null) {
            return undefined;
        }
        return JSON.parse(value);
    } catch (err) {
        console.error('Error loading state:', err);
        return undefined;
    }
};

// Guardar estado en Capacitor Preferences
const saveState = async (state) => {
    try {
        const serializedState = JSON.stringify(state);
        await Preferences.set({
            key: STATE_KEY,
            value: serializedState,
        });
    } catch (err) {
        console.error('Error saving state:', err);
    }
};

// IMPORTANTE: Cargar el estado inicial de forma asíncrona
let preloadedState = undefined;

// Función para inicializar el store
const initializeStore = async () => {
    preloadedState = await loadState();

    const store = configureStore({
        reducer: {
            auth: authReducer,
            players: playersReducer,
            sessions: sessionsReducer,
            workouts: workoutsReducer,
        },
        preloadedState,
    });

    // Guardar en Preferences cada vez que cambie el estado
    // Usar debounce para evitar escrituras excesivas
    let saveTimeout;
    store.subscribe(() => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveState({
                players: store.getState().players,
                sessions: store.getState().sessions,
                auth: store.getState().auth,
                workouts: store.getState().workouts,
            });
        }, 500); // Esperar 500ms antes de guardar
    });

    return store;
};

// Exportar la función de inicialización
export { initializeStore };
// src/utils/storage.js
import { Preferences } from '@capacitor/preferences';

/**
 * Helper para usar Capacitor Preferences de forma sencilla
 * Compatible con la API de localStorage
 */

export const storage = {
    /**
     * Guardar un valor
     * @param {string} key - Clave
     * @param {any} value - Valor (se convierte a JSON automáticamente)
     */
    async setItem(key, value) {
        try {
            const serialized = typeof value === 'string' ? value : JSON.stringify(value);
            await Preferences.set({ key, value: serialized });
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            throw error;
        }
    },

    /**
     * Obtener un valor
     * @param {string} key - Clave
     * @returns {Promise<any>} - Valor parseado o null si no existe
     */
    async getItem(key) {
        try {
            const { value } = await Preferences.get({ key });
            if (value === null) return null;

            // Intentar parsear como JSON, si falla devolver string
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        } catch (error) {
            console.error(`Error getting ${key}:`, error);
            return null;
        }
    },

    /**
     * Eliminar un valor
     * @param {string} key - Clave
     */
    async removeItem(key) {
        try {
            await Preferences.remove({ key });
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
            throw error;
        }
    },

    /**
     * Limpiar todos los valores
     */
    async clear() {
        try {
            await Preferences.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
            throw error;
        }
    },

    /**
     * Obtener todas las claves
     * @returns {Promise<string[]>} - Array de claves
     */
    async keys() {
        try {
            const { keys } = await Preferences.keys();
            return keys;
        } catch (error) {
            console.error('Error getting keys:', error);
            return [];
        }
    },
};

export default storage;
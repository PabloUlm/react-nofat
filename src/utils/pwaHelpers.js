// src/utils/pwaHelpers.js

/**
 * Detecta si la app está corriendo como PWA instalada
 * @returns {boolean}
 */
export const isPWA = () => {
    // Verificar diferentes métodos de detección
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = window.navigator.standalone === true;
    const isAndroidApp = document.referrer.includes('android-app://');

    return isStandalone || isIOSStandalone || isAndroidApp;
};

/**
 * Detecta si el dispositivo es iOS
 * @returns {boolean}
 */
export const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

/**
 * Detecta si el dispositivo es Android
 * @returns {boolean}
 */
export const isAndroid = () => {
    return /Android/.test(navigator.userAgent);
};

/**
 * Verifica si el navegador soporta PWA
 * @returns {boolean}
 */
export const supportsPWA = () => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
};
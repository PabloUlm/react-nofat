// src/utils/registerServiceWorker.js

/**
 * Verifica si la app está corriendo como PWA instalada
 * @returns {boolean} true si está instalada como PWA
 */
export const isPWA = () => {
    // Método 1: Display mode standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    // Método 2: iOS Safari (navigator.standalone)
    const isIOSStandalone = window.navigator.standalone === true;

    // Método 3: Android (referrer contiene android-app://)
    const isAndroidApp = document.referrer.includes('android-app://');

    return isStandalone || isIOSStandalone || isAndroidApp;
};

/**
 * Registra el Service Worker para la PWA
 */
export const registerServiceWorker = async () => {
    // Solo registrar en producción
    if (import.meta.env.DEV) {
        console.log('🔧 Modo desarrollo - Service Worker deshabilitado');
        return;
    }

    if (!('serviceWorker' in navigator)) {
        console.warn('⚠️ Service Worker no soportado en este navegador');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
        });

        console.log('✅ Service Worker registrado:', registration.scope);

        // Escuchar actualizaciones
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('🔄 Nueva versión del Service Worker encontrada');

            newWorker?.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('✨ Nueva versión disponible - Recarga para actualizar');

                    // Opcional: Mostrar notificación al usuario
                    if (confirm('🆕 Hay una nueva versión disponible. ¿Recargar ahora?')) {
                        window.location.reload();
                    }
                }
            });
        });

        // Verificar actualizaciones cada hora
        setInterval(() => {
            registration.update();
        }, 60 * 60 * 1000); // 1 hora

    } catch (error) {
        console.error('❌ Error al registrar Service Worker:', error);
    }
};

/**
 * Configurar el prompt de instalación de PWA
 */
export const setupPWAInstallPrompt = () => {
    let deferredPrompt = null;

    // Capturar el evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevenir el prompt automático
        e.preventDefault();
        deferredPrompt = e;

        console.log('💾 PWA lista para instalar');

        // Disparar evento custom para que otros componentes lo detecten
        window.dispatchEvent(new CustomEvent('pwa-installable', {
            detail: { prompt: deferredPrompt }
        }));
    });

    // Detectar cuando se instala
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA instalada correctamente');
        deferredPrompt = null;

        // Disparar evento custom
        window.dispatchEvent(new CustomEvent('pwa-installed'));

        // Opcional: Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_installed');
        }
    });
};

/**
 * Desregistrar Service Worker (útil para debugging)
 */
export const unregisterServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();

        for (const registration of registrations) {
            await registration.unregister();
            console.log('🗑️ Service Worker desregistrado');
        }
    }
};

/**
 * Limpiar todas las cachés
 */
export const clearAllCaches = async () => {
    if ('caches' in window) {
        const cacheNames = await caches.keys();

        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );

        console.log('🧹 Todas las cachés limpiadas');
    }
};

/**
 * Obtener información de la PWA
 */
export const getPWAInfo = async () => {
    const info = {
        isPWA: isPWA(),
        hasServiceWorker: 'serviceWorker' in navigator,
        serviceWorkerState: null,
        cacheNames: [],
        installable: false
    };

    // Estado del Service Worker
    if (navigator.serviceWorker?.controller) {
        info.serviceWorkerState = navigator.serviceWorker.controller.state;
    }

    // Cachés disponibles
    if ('caches' in window) {
        info.cacheNames = await caches.keys();
    }

    return info;
};

/**
 * Verificar conectividad
 */
export const checkConnectivity = () => {
    return {
        isOnline: navigator.onLine,
        connectionType: navigator.connection?.effectiveType || 'unknown',
        saveData: navigator.connection?.saveData || false
    };
};

/**
 * Listener para cambios de conectividad
 */
export const setupConnectivityListener = (callback) => {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Retornar función de cleanup
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
};

/**
 * Compartir contenido (Web Share API)
 */
export const shareContent = async (data) => {
    if (!navigator.share) {
        console.warn('⚠️ Web Share API no disponible');
        return false;
    }

    try {
        await navigator.share({
            title: data.title || 'FitTracker',
            text: data.text || 'Mira mi progreso en FitTracker',
            url: data.url || window.location.href
        });

        console.log('✅ Contenido compartido');
        return true;
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('❌ Error al compartir:', error);
        }
        return false;
    }
};

/**
 * Solicitar permisos de notificaciones
 */
export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.warn('⚠️ Notificaciones no soportadas');
        return 'unsupported';
    }

    if (Notification.permission === 'granted') {
        return 'granted';
    }

    if (Notification.permission === 'denied') {
        return 'denied';
    }

    try {
        const permission = await Notification.requestPermission();
        console.log(`🔔 Permiso de notificaciones: ${permission}`);
        return permission;
    } catch (error) {
        console.error('❌ Error al solicitar permisos:', error);
        return 'error';
    }
};

/**
 * Mostrar notificación local
 */
export const showNotification = (title, options = {}) => {
    if (Notification.permission !== 'granted') {
        console.warn('⚠️ Permiso de notificaciones no concedido');
        return;
    }

    const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        ...options
    });

    notification.onclick = () => {
        window.focus();
        notification.close();
    };

    return notification;
};

/**
 * Detectar características PWA disponibles
 */
export const getPWACapabilities = () => {
    return {
        serviceWorker: 'serviceWorker' in navigator,
        wakeLock: 'wakeLock' in navigator,
        share: 'share' in navigator,
        notifications: 'Notification' in window,
        badging: 'setAppBadge' in navigator,
        fileSystemAccess: 'showOpenFilePicker' in window,
        screenOrientation: 'orientation' in screen,
        fullscreen: 'requestFullscreen' in document.documentElement,
        clipboard: 'clipboard' in navigator,
        geolocation: 'geolocation' in navigator,
        mediaDevices: 'mediaDevices' in navigator,
        battery: 'getBattery' in navigator
    };
};

// Log de capacidades en desarrollo
if (import.meta.env.DEV) {
    console.log('🔍 PWA Capabilities:', getPWACapabilities());
}

export default {
    isPWA,
    registerServiceWorker,
    setupPWAInstallPrompt,
    unregisterServiceWorker,
    clearAllCaches,
    getPWAInfo,
    checkConnectivity,
    setupConnectivityListener,
    shareContent,
    requestNotificationPermission,
    showNotification,
    getPWACapabilities
};
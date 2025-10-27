// src/utils/registerServiceWorker.js

/**
 * Registrar Service Worker para PWA
 * Debe ser llamado en main.jsx después de montar React
 */
export function registerServiceWorker() {
    // Solo registrar en producción
    if (import.meta.env.MODE !== 'production') {
        console.log('⚠️ Service Worker deshabilitado en desarrollo');
        return;
    }

    // Verificar si el navegador soporta Service Workers
    if (!('serviceWorker' in navigator)) {
        console.warn('⚠️ Service Workers no soportados en este navegador');
        return;
    }

    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
                scope: '/',
            });

            console.log('✅ Service Worker registrado:', registration.scope);

            // Manejar actualizaciones del Service Worker
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('🔄 Nueva versión del Service Worker detectada');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Hay una nueva versión disponible
                        console.log('🆕 Nueva versión disponible. Recarga la página para actualizar.');

                        // Opcional: Mostrar notificación al usuario
                        if (confirm('🆕 Nueva versión disponible. ¿Quieres actualizar ahora?')) {
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                            window.location.reload();
                        }
                    }
                });
            });

            // Listener para cuando se activa un nuevo SW
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    refreshing = true;
                    window.location.reload();
                }
            });

        } catch (error) {
            console.error('❌ Error al registrar Service Worker:', error);
        }
    });
}

/**
 * Desregistrar Service Worker (útil para desarrollo)
 */
export async function unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();

        for (const registration of registrations) {
            await registration.unregister();
            console.log('🗑️ Service Worker desregistrado');
        }
    }
}

/**
 * Verificar si la app está instalada como PWA
 */
export function isPWA() {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://')
    );
}

/**
 * Mostrar prompt de instalación de PWA
 */
export function setupPWAInstallPrompt() {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevenir el prompt automático
        e.preventDefault();
        deferredPrompt = e;

        console.log('💡 PWA puede ser instalada');

        // Mostrar botón de instalación customizado (implementar en UI)
        showInstallButton(deferredPrompt);
    });

    // Detectar cuando se instaló
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA instalada con éxito');
        deferredPrompt = null;
        hideInstallButton();

        // Opcional: Analytics tracking
        // trackEvent('pwa_installed');
    });

    return deferredPrompt;
}

/**
 * Mostrar botón de instalación (implementar en tu componente)
 */
function showInstallButton(deferredPrompt) {
    // Crear o mostrar botón de instalación
    const installButton = document.getElementById('pwa-install-button');

    if (installButton) {
        installButton.style.display = 'block';

        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`);
                deferredPrompt = null;
            }
        });
    }
}

/**
 * Ocultar botón de instalación
 */
function hideInstallButton() {
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
        installButton.style.display = 'none';
    }
}

/**
 * Comprobar actualizaciones del Service Worker manualmente
 */
export async function checkForUpdates() {
    if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
            await registration.update();
            console.log('🔄 Verificando actualizaciones...');
        }
    }
}

/**
 * Limpiar toda la cache (útil para debugging)
 */
export async function clearAllCache() {
    if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        console.log('🗑️ Cache limpiada');
    }
}
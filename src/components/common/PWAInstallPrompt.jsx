// src/components/common/PWAInstallPrompt.jsx
import { useState, useEffect } from 'react';

/**
 * Componente para mostrar prompt de instalación de PWA
 * Muestra un banner elegante invitando al usuario a instalar la app
 */
function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isPWA, setIsPWA] = useState(false);

    useEffect(() => {
        // Verificar si ya está instalada como PWA
        const checkPWA = () => {
            const isInstalled =
                window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone === true ||
                document.referrer.includes('android-app://');

            setIsPWA(isInstalled);
        };

        checkPWA();

        // Escuchar evento de instalación
        const handleBeforeInstallPrompt = (e) => {
            // Prevenir el prompt automático
            e.preventDefault();
            setDeferredPrompt(e);

            // Mostrar nuestro prompt custom después de 3 segundos
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
        };

        // Escuchar cuando se instale
        const handleAppInstalled = () => {
            console.log('✅ PWA instalada');
            setShowPrompt(false);
            setDeferredPrompt(null);
            setIsPWA(true);

            // Opcional: Mostrar mensaje de éxito
            alert('¡App instalada con éxito! 🎉\nAhora puedes acceder desde tu pantalla de inicio.');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Mostrar el prompt nativo
        deferredPrompt.prompt();

        // Esperar la respuesta del usuario
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`);

        // Limpiar el prompt
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);

        // No mostrar de nuevo en esta sesión
        sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    // No mostrar si:
    // 1. Ya está instalada como PWA
    // 2. No hay prompt disponible
    // 3. Usuario lo cerró
    // 4. Ya fue cerrado en esta sesión
    if (
        isPWA ||
        !showPrompt ||
        !deferredPrompt ||
        sessionStorage.getItem('pwa-prompt-dismissed')
    ) {
        return null;
    }

    return (
        <>
            {/* Versión Desktop - Banner superior */}
            <div className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <span className="text-3xl">📲</span>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">
                                    ¡Instala FitTracker!
                                </h3>
                                <p className="text-indigo-100 text-sm">
                                    Accede más rápido y úsala sin conexión
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleInstallClick}
                                className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition"
                            >
                                ✅ Instalar
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Versión Mobile - Card flotante inferior */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-500 overflow-hidden">
                    {/* Franja superior colorida */}
                    <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600" />

                    <div className="p-4">
                        <div className="flex gap-3">
                            {/* Icono */}
                            <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-xl">
                                <span className="text-3xl">📲</span>
                            </div>

                            {/* Contenido */}
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-base mb-1">
                                    ¡Instala FitTracker!
                                </h3>
                                <p className="text-gray-600 text-sm mb-3">
                                    Accede más rápido desde tu pantalla de inicio
                                </p>

                                {/* Botones */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleInstallClick}
                                        className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition"
                                    >
                                        ✅ Instalar
                                    </button>
                                    <button
                                        onClick={handleDismiss}
                                        className="bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-semibold text-sm hover:bg-gray-300 transition"
                                    >
                                        Ahora no
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .animate-slide-up {
                    animation: slide-up 0.5s ease-out;
                }
            `}</style>
        </>
    );
}

export default PWAInstallPrompt;
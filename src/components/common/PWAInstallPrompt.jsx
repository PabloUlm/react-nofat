// src/components/common/PWAInstallPrompt.jsx
import { useState, useEffect } from 'react';

/**
 * OPCIÓN B - ACCESO LIMITADO
 * Banner sticky persistente que no se puede cerrar
 * Obliga a instalar para usar workouts
 */
function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isPWA, setIsPWA] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    useEffect(() => {
        // Verificar si ya está instalada como PWA
        const checkPWA = () => {
            const isInstalled =
                window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone === true ||
                document.referrer.includes('android-app://');

            setIsPWA(isInstalled);
        };

        // Detectar iOS
        const detectIOS = () => {
            const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            setIsIOS(ios);
        };

        checkPWA();
        detectIOS();

        // Escuchar evento de instalación (Android)
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            console.log('✅ Prompt de instalación capturado');
        };

        // Escuchar cuando se instale
        const handleAppInstalled = () => {
            console.log('✅ PWA instalada');
            setDeferredPrompt(null);
            setIsPWA(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            // En iOS mostrar instrucciones
            setShowIOSInstructions(true);
            return;
        }

        if (!deferredPrompt) {
            alert('⚠️ Tu navegador no soporta instalación automática.\n\nVe al menú de tu navegador y busca "Instalar app" o "Añadir a pantalla de inicio".');
            return;
        }

        // Mostrar el prompt nativo (Android)
        deferredPrompt.prompt();

        // Esperar la respuesta del usuario
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`);

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    // Si ya está instalada, no mostrar nada
    if (isPWA) {
        return null;
    }

    // BANNER STICKY PERSISTENTE - NO SE PUEDE CERRAR
    return (
        <>
            {/* Banner Superior STICKY - Siempre visible */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-lg">
                <div className="max-w-7xl mx-auto px-3 md:px-6 py-2 md:py-3">
                    <div className="flex items-center justify-between gap-3">
                        {/* Mensaje */}
                        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                                <span className="text-2xl md:text-3xl">⚠️</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-white font-bold text-sm md:text-base leading-tight">
                                    Instalación Requerida
                                </h3>
                                <p className="text-yellow-100 text-xs md:text-sm hidden md:block">
                                    Instala la app para usar workouts y mantener la pantalla activa
                                </p>
                            </div>
                        </div>

                        {/* Botón Instalar */}
                        <button
                            onClick={handleInstallClick}
                            className="flex-shrink-0 bg-white text-orange-600 px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-bold text-sm md:text-base hover:bg-orange-50 transition shadow-md"
                        >
                            📥 Instalar
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Instrucciones iOS */}
            {showIOSInstructions && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">📱</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Instalar en iOS
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Sigue estos pasos para instalar NO FAT:
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex gap-3 items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                                    1
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">
                                        Toca el botón <strong>Compartir</strong> {' '}
                                        <span className="inline-block text-xl">⎙</span> en la barra inferior
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                                    2
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">
                                        Desplázate y selecciona <strong>"Añadir a pantalla de inicio"</strong>
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                                    3
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">
                                        Toca <strong>"Añadir"</strong> en la esquina superior derecha
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                                    ✓
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700">
                                        Abre la app desde tu pantalla de inicio
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowIOSInstructions(false)}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* Espaciador para que el contenido no quede debajo del banner */}
            <div className="h-[52px] md:h-[60px]" />
        </>
    );
}

export default PWAInstallPrompt;
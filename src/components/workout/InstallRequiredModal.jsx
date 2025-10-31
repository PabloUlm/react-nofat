// src/components/workout/InstallRequiredModal.jsx
import { useState } from 'react';
import { isIOS } from '../../utils/pwaHelpers';

/**
 * Modal que bloquea el inicio de workouts si no está instalada como PWA
 * Parte de la Opción B - Acceso Limitado
 */
function InstallRequiredModal({ onClose }) {
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);
    const deviceIsIOS = isIOS();

    const handleInstall = () => {
        if (deviceIsIOS) {
            setShowIOSInstructions(true);
        } else {
            // Android/Chrome - Buscar evento beforeinstallprompt
            alert('⚠️ Para instalar:\n\n1. Abre el menú de tu navegador (⋮)\n2. Busca "Instalar app" o "Añadir a pantalla de inicio"\n3. Confirma la instalación\n\n¡Luego podrás usar todos los workouts!');
        }
    };

    if (showIOSInstructions) {
        return (
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
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8">
                {/* Icono de advertencia */}
                <div className="text-center mb-6">
                    <div className="text-7xl mb-4">⚠️</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        Instalación Requerida
                    </h2>
                    <p className="text-gray-600 text-base">
                        Para realizar workouts necesitas instalar NO FAT como app
                    </p>
                </div>

                {/* Beneficios */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 md:p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4 text-center">
                        ¿Por qué instalar?
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">✓</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Pantalla siempre activa</p>
                                <p className="text-xs text-gray-600">Durante los workouts de 10 minutos</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">✓</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Mejor rendimiento</p>
                                <p className="text-xs text-gray-600">Carga más rápido y consume menos batería</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">✓</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Funciona sin conexión</p>
                                <p className="text-xs text-gray-600">Una vez instalada, úsala donde sea</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">✓</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">Acceso rápido</p>
                                <p className="text-xs text-gray-600">Desde tu pantalla de inicio</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nota importante */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                        <strong>📌 Nota:</strong> Puedes explorar el Dashboard y Rankings sin instalar,
                        pero los workouts requieren instalación para funcionar correctamente.
                    </p>
                </div>

                {/* Botones */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleInstall}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                    >
                        📥 Ver Cómo Instalar
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition"
                    >
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InstallRequiredModal;
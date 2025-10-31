// src/components/common/PWADiagnostics.jsx
import { useState, useEffect } from 'react';
import {
    isPWA,
    getPWAInfo,
    getPWACapabilities,
    checkConnectivity
} from '../../utils/registerServiceWorker';

/**
 * Componente de diagnóstico PWA (solo visible en desarrollo)
 * Muestra información técnica sobre el estado de la PWA
 */
function PWADiagnostics() {
    const [isOpen, setIsOpen] = useState(false);
    const [pwaInfo, setPwaInfo] = useState(null);
    const [capabilities, setCapabilities] = useState(null);
    const [connectivity, setConnectivity] = useState(null);
    const [wakeLockStatus, setWakeLockStatus] = useState('not-requested');

    // ✅ TODOS los hooks deben estar antes de cualquier return condicional
    useEffect(() => {
        const loadDiagnostics = async () => {
            const info = await getPWAInfo();
            setPwaInfo(info);
            setCapabilities(getPWACapabilities());
            setConnectivity(checkConnectivity());
        };

        loadDiagnostics();

        // Actualizar conectividad cada 5 segundos
        const interval = setInterval(() => {
            setConnectivity(checkConnectivity());
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // ✅ Verificación de producción DESPUÉS de todos los hooks
    if (import.meta.env.PROD) {
        return null;
    }

    // Funciones de manejo (después de los hooks y antes del JSX)
    const loadDiagnostics = async () => {
        const info = await getPWAInfo();
        setPwaInfo(info);
        setCapabilities(getPWACapabilities());
        setConnectivity(checkConnectivity());
    };

    const testWakeLock = async () => {
        try {
            if ('wakeLock' in navigator) {
                const wakeLock = await navigator.wakeLock.request('screen');
                setWakeLockStatus('active');

                wakeLock.addEventListener('release', () => {
                    setWakeLockStatus('released');
                });

                // Liberar después de 5 segundos
                setTimeout(() => {
                    wakeLock.release();
                }, 5000);
            } else {
                setWakeLockStatus('not-supported');
            }
        } catch (err) {
            setWakeLockStatus(`error: ${err.message}`);
        }
    };

    const clearCaches = async () => {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            alert('✅ Cachés limpiadas. Recarga la página.');
        }
    };

    const unregisterSW = async () => {
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(reg => reg.unregister()));
            alert('✅ Service Worker desregistrado. Recarga la página.');
        }
    };

    // Botón flotante cuando está cerrado
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition z-50"
                title="Abrir diagnóstico PWA"
            >
                🔧
            </button>
        );
    }

    // Panel completo cuando está abierto
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-purple-600 text-white p-4 sticky top-0 flex items-center justify-between">
                    <h2 className="text-xl font-bold">🔧 PWA Diagnostics</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Estado General */}
                    <section>
                        <h3 className="text-lg font-bold mb-3">📊 Estado General</h3>
                        <div className="space-y-2">
                            <StatusItem
                                label="PWA Instalada"
                                value={isPWA()}
                            />
                            <StatusItem
                                label="Service Worker"
                                value={pwaInfo?.hasServiceWorker}
                            />
                            <StatusItem
                                label="SW State"
                                value={pwaInfo?.serviceWorkerState || 'N/A'}
                                isInfo
                            />
                            <StatusItem
                                label="Conectividad"
                                value={connectivity?.isOnline}
                            />
                            <StatusItem
                                label="Tipo de Conexión"
                                value={connectivity?.connectionType || 'unknown'}
                                isInfo
                            />
                        </div>
                    </section>

                    {/* Capacidades */}
                    <section>
                        <h3 className="text-lg font-bold mb-3">✨ Capacidades del Navegador</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {capabilities && Object.entries(capabilities).map(([key, value]) => (
                                <StatusItem
                                    key={key}
                                    label={key}
                                    value={value}
                                    compact
                                />
                            ))}
                        </div>
                    </section>

                    {/* Wake Lock Test */}
                    <section>
                        <h3 className="text-lg font-bold mb-3">🔒 Wake Lock Test</h3>
                        <div className="space-y-3">
                            <StatusItem
                                label="Estado"
                                value={wakeLockStatus}
                                isInfo
                            />
                            <button
                                onClick={testWakeLock}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                🧪 Probar Wake Lock (5s)
                            </button>
                        </div>
                    </section>

                    {/* Cachés */}
                    {pwaInfo?.cacheNames && pwaInfo.cacheNames.length > 0 && (
                        <section>
                            <h3 className="text-lg font-bold mb-3">💾 Cachés Activas</h3>
                            <div className="bg-gray-50 rounded p-3 space-y-1">
                                {pwaInfo.cacheNames.map(name => (
                                    <div key={name} className="text-sm font-mono text-gray-700">
                                        📦 {name}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Acciones */}
                    <section>
                        <h3 className="text-lg font-bold mb-3">🛠️ Acciones</h3>
                        <div className="space-y-2">
                            <button
                                onClick={loadDiagnostics}
                                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                🔄 Recargar Diagnóstico
                            </button>
                            <button
                                onClick={clearCaches}
                                className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition"
                            >
                                🧹 Limpiar Cachés
                            </button>
                            <button
                                onClick={unregisterSW}
                                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                🗑️ Desregistrar Service Worker
                            </button>
                        </div>
                    </section>

                    {/* Info del Sistema */}
                    <section>
                        <h3 className="text-lg font-bold mb-3">💻 Sistema</h3>
                        <div className="bg-gray-50 rounded p-3 text-xs font-mono space-y-1">
                            <div>User Agent: {navigator.userAgent}</div>
                            <div>Platform: {navigator.platform}</div>
                            <div>Language: {navigator.language}</div>
                            <div>Screen: {screen.width}x{screen.height}</div>
                            <div>Viewport: {window.innerWidth}x{window.innerHeight}</div>
                        </div>
                    </section>

                    {/* Advertencia */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                        <p className="text-sm text-yellow-800">
                            ⚠️ Este panel solo es visible en modo desarrollo.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente auxiliar para mostrar estados
function StatusItem({ label, value, isInfo = false, compact = false }) {
    const getIcon = () => {
        if (isInfo) return '📌';
        if (typeof value === 'boolean') {
            return value ? '✅' : '❌';
        }
        return '📊';
    };

    const getColor = () => {
        if (isInfo) return 'text-blue-800 bg-blue-50';
        if (typeof value === 'boolean') {
            return value ? 'text-green-800 bg-green-50' : 'text-red-800 bg-red-50';
        }
        return 'text-gray-800 bg-gray-50';
    };

    return (
        <div className={`flex items-center justify-between p-2 rounded ${getColor()}`}>
            <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium`}>
                {getIcon()} {label}
            </span>
            <span className={`${compact ? 'text-xs' : 'text-sm'} font-mono font-bold`}>
                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
            </span>
        </div>
    );
}

export default PWADiagnostics;
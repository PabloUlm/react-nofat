// src/components/workout/WorkoutTimer.jsx
import { useState, useEffect, useRef } from 'react';

function WorkoutTimer({ duration, exercises, onFinish, onCancel }) {
    const totalSeconds = duration * 60; // Convertir minutos a segundos
    const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
    const [isPaused, setIsPaused] = useState(false);
    const [wakeLockError, setWakeLockError] = useState(false);
    const wakeLockRef = useRef(null);

    // 🔒 PWA Wake Lock: Mantener pantalla encendida durante el workout
    useEffect(() => {
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    const wakeLock = await navigator.wakeLock.request('screen');
                    wakeLockRef.current = wakeLock;
                    setWakeLockError(false);

                    console.log('✅ [PWA] Wake Lock activado - Pantalla permanecerá encendida');

                    // Listener para detectar cuando se libera el Wake Lock
                    wakeLock.addEventListener('release', () => {
                        console.log('⚠️ [PWA] Wake Lock liberado');
                        wakeLockRef.current = null;
                    });
                } else {
                    console.warn('⚠️ Wake Lock API no disponible');
                    setWakeLockError(true);
                }
            } catch (err) {
                console.error('❌ Error al activar Wake Lock:', err.name, err.message);
                setWakeLockError(true);
            }
        };

        // Activar inmediatamente al montar
        requestWakeLock();

        // Cleanup: liberar Wake Lock al desmontar el componente
        return () => {
            if (wakeLockRef.current) {
                wakeLockRef.current.release()
                    .then(() => {
                        console.log('🔓 [PWA] Wake Lock liberado al salir del workout');
                        wakeLockRef.current = null;
                    })
                    .catch(err => {
                        console.error('Error al liberar Wake Lock:', err);
                    });
            }
        };
    }, []);

    // 🔄 Re-activar Wake Lock cuando la app vuelve a estar visible
    // Esto es crítico en PWA cuando el usuario minimiza y vuelve a la app
    useEffect(() => {
        const handleVisibilityChange = async () => {
            // Solo reactivar si:
            // 1. La app está visible
            // 2. El workout NO está pausado
            // 3. No hay Wake Lock activo
            if (
                document.visibilityState === 'visible' &&
                !isPaused &&
                !wakeLockRef.current
            ) {
                try {
                    if ('wakeLock' in navigator) {
                        const wakeLock = await navigator.wakeLock.request('screen');
                        wakeLockRef.current = wakeLock;
                        setWakeLockError(false);
                        console.log('✅ [PWA] Wake Lock re-activado al volver a la app');

                        wakeLock.addEventListener('release', () => {
                            console.log('⚠️ [PWA] Wake Lock liberado nuevamente');
                            wakeLockRef.current = null;
                        });
                    }
                } catch (err) {
                    console.error('❌ Error al re-activar Wake Lock:', err);
                    setWakeLockError(true);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isPaused]);

    // ⏸️ Gestión de Wake Lock durante pausa
    // Liberar durante pausa para ahorrar batería, reactivar al continuar
    useEffect(() => {
        if (isPaused && wakeLockRef.current) {
            // Liberar Wake Lock durante la pausa
            wakeLockRef.current.release()
                .then(() => {
                    console.log('⏸️ [PWA] Wake Lock liberado durante pausa (ahorro de batería)');
                    wakeLockRef.current = null;
                })
                .catch(err => {
                    console.error('Error al liberar Wake Lock en pausa:', err);
                });
        } else if (!isPaused && !wakeLockRef.current && document.visibilityState === 'visible') {
            // Reactivar Wake Lock al despausar
            (async () => {
                try {
                    if ('wakeLock' in navigator) {
                        const wakeLock = await navigator.wakeLock.request('screen');
                        wakeLockRef.current = wakeLock;
                        setWakeLockError(false);
                        console.log('▶️ [PWA] Wake Lock reactivado al continuar');

                        wakeLock.addEventListener('release', () => {
                            wakeLockRef.current = null;
                        });
                    }
                } catch (err) {
                    console.error('Error al reactivar Wake Lock:', err);
                    setWakeLockError(true);
                }
            })();
        }
    }, [isPaused]);

    // ⏱️ Timer principal
    useEffect(() => {
        // Si está pausado, no hacer nada
        if (isPaused) return;

        // Si llegó a 0, terminar
        if (secondsRemaining === 0) {
            onFinish();
            return;
        }

        // Timer cada segundo
        const timer = setInterval(() => {
            setSecondsRemaining(s => s - 1);
        }, 1000);

        // Cleanup
        return () => clearInterval(timer);
    }, [secondsRemaining, isPaused, onFinish]);

    // Calcular minutos y segundos
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;

    // Calcular progreso (para barra)
    const progress = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;

    // Determinar color según tiempo restante
    const getTimerColor = () => {
        if (secondsRemaining > 120) return 'text-white'; // > 2min: blanco
        if (secondsRemaining > 60) return 'text-yellow-300'; // > 1min: amarillo
        return 'text-red-400'; // < 1min: rojo
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* HEADER STICKY con Timer - Optimizado móvil */}
            <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
                {/* Barra de progreso */}
                <div className="h-1 md:h-2 bg-indigo-800">
                    <div
                        className="h-full bg-green-400 transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Timer y controles - Stack en móvil */}
                <div className="px-3 py-3 md:px-6 md:py-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Timer */}
                        <div className="flex items-center justify-between md:block">
                            <div className="flex-1 md:mb-3">
                                <p className="text-indigo-200 text-xs md:text-sm mb-0.5 md:mb-1">Tiempo restante</p>
                                <h1 className={`text-4xl md:text-7xl font-bold tabular-nums ${getTimerColor()}`}>
                                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                                </h1>
                            </div>

                            {/* Controles - Compactos en móvil */}
                            <div className="flex gap-2 md:gap-3">
                                {/* Botón Pausa/Reanudar - Solo icono en móvil */}
                                <button
                                    onClick={() => setIsPaused(!isPaused)}
                                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition text-sm md:text-base"
                                    title={isPaused ? 'Reanudar' : 'Pausar'}
                                >
                                    <span className="md:hidden">{isPaused ? '▶️' : '⏸️'}</span>
                                    <span className="hidden md:inline">{isPaused ? '▶️ Reanudar' : '⏸️ Pausa'}</span>
                                </button>

                                {/* Botón Cancelar - Solo icono en móvil */}
                                <button
                                    onClick={() => {
                                        if (confirm('¿Seguro que quieres cancelar el workout?')) {
                                            onCancel();
                                        }
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition text-sm md:text-base"
                                    title="Cancelar"
                                >
                                    <span className="md:hidden">✕</span>
                                    <span className="hidden md:inline">✕ Cancelar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Indicador de Wake Lock (solo visible si hay error) */}
                {wakeLockError && (
                    <div className="bg-yellow-500/90 px-3 py-1">
                        <p className="text-xs text-yellow-900 text-center">
                            ⚠️ Mantén la pantalla encendida manualmente
                        </p>
                    </div>
                )}
            </div>

            {/* Mensaje de pausa */}
            {isPaused && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 md:p-4">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-yellow-800 font-semibold text-sm md:text-base">
                            ⏸️ Workout en pausa - Click "Reanudar" para continuar
                        </p>
                    </div>
                </div>
            )}

            {/* LISTA DE EJERCICIOS - Optimizada móvil */}
            <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-8">
                {/* Header lista - Más compacto en móvil */}
                <div className="mb-4 md:mb-6">
                    <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">
                        📋 Ejercicios del Circuito
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 hidden md:block">
                        Completa tantas rondas como puedas. ¡Vamos! 💪
                    </p>
                </div>

                <div className="space-y-3 md:space-y-4">
                    {exercises.map((exercise, index) => (
                        <div
                            key={exercise.id}
                            className="bg-white rounded-lg md:rounded-xl shadow-md p-3 md:p-6 hover:shadow-lg transition"
                        >
                            <div className="flex items-center gap-3 md:gap-6">
                                {/* Número del ejercicio - Más pequeño en móvil */}
                                <div className="flex-shrink-0 w-10 h-10 md:w-16 md:h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-lg md:text-2xl font-bold">
                                        {index + 1}
                                    </span>
                                </div>

                                {/* Info del ejercicio */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base md:text-2xl font-bold text-gray-900 mb-0.5 md:mb-1 truncate">
                                        {exercise.name}
                                    </h3>
                                    <p className="text-xl md:text-xl text-indigo-600 font-semibold">
                                        {exercise.defaultReps} {exercise.repsType === 'time' ? 'seg' : 'reps'}
                                    </p>
                                </div>

                                {/* Badge de dificultad - OCULTO EN MÓVIL */}
                                <div className="hidden md:block flex-shrink-0">
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                        exercise.difficulty === 'principiante' ? 'bg-green-100 text-green-800' :
                                            exercise.difficulty === 'intermedio' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                    }`}>
                                        {exercise.difficulty}
                                    </span>
                                </div>
                            </div>

                            {/* Descripción - OCULTA EN MÓVIL */}
                            <p className="hidden md:block text-gray-600 text-sm mt-3 ml-22">
                                {exercise.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Nota al final - Más compacta en móvil */}
                <div className="mt-6 md:mt-8 bg-blue-50 border-l-4 border-blue-500 p-3 md:p-6 rounded">
                    <p className="text-blue-800 text-xs md:text-base">
                        <strong className="hidden md:inline">💡 Recuerda:</strong>
                        <span className="md:hidden">💡</span>
                        {' '}Completa los ejercicios en orden.
                        <span className="hidden md:inline">
                            {' '}Al terminar el último, vuelve al primero para empezar una nueva ronda.
                            ¡No pares hasta que suene el timer!
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default WorkoutTimer;
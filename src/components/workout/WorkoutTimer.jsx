// src/components/workout/WorkoutTimer.jsx
import { useState, useEffect, useRef } from 'react';

function WorkoutTimer({ duration, exercises, onFinish, onCancel }) {
    // 🔧 TESTING MODE: Usar segundos directamente en lugar de minutos
    const totalSeconds = duration * 60; // SIN multiplicar por 60 = usar segundos directamente
    const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
    const [isPaused, setIsPaused] = useState(false);
    const wakeLockRef = useRef(null);
    const noSleepVideoRef = useRef(null);

    // Wake Lock: Mantener pantalla encendida con estrategias efectivas
    useEffect(() => {
        let wakeLock = null;

        const requestWakeLock = async () => {
            try {
                // Estrategia 1: Wake Lock API (Chrome Android, Safari 16.4+)
                if ('wakeLock' in navigator) {
                    try {
                        wakeLock = await navigator.wakeLock.request('screen');
                        wakeLockRef.current = wakeLock;
                        console.log('✅ Wake Lock API activado');

                        wakeLock.addEventListener('release', () => {
                            console.log('⚠️ Wake Lock liberado');
                        });
                    } catch (err) {
                        console.warn('⚠️ Wake Lock falló:', err.message);
                    }
                } else {
                    console.warn('⚠️ Wake Lock API no disponible');
                }

                // Estrategia 2: NoSleep.js technique - Video invisible (fallback para iOS)
                console.log('🎬 Activando video invisible (NoSleep)...');
                const video = document.createElement('video');
                video.setAttribute('playsinline', '');
                video.setAttribute('muted', '');
                video.setAttribute('loop', '');
                video.style.cssText = 'position:fixed;opacity:0;pointer-events:none;width:1px;height:1px;z-index:-9999;left:-10px;top:-10px;';

                // Video WebM corto que se repite (técnica NoSleep.js)
                video.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAs1tZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE1MiByMjg1NCBlOWE1OTAzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNyAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAD2WIhAAV/78VAAAAwGWIhABV/78VAAAAwGWIhAAV/78VAAAAwGWIhABV/78VAAAAwGWIhAAV/78VAAAAwGWIhABV/78VAAAAwGWIhAAV/78VAAAAwGWIhABV/78VAAAAwGWIhAAV/78VAAAAwGWIhABV/78VAAAAwGWIhAAV/78VAAAAwGWIhABV/78VAAAAwGWIhABV/78VAAAAwGWIhABV/78VAAAAwGWIhABV/78VAAAA';

                noSleepVideoRef.current = video;
                document.body.appendChild(video);

                // Intentar reproducir (CRÍTICO para iOS)
                try {
                    await video.play();
                    console.log('✅ Video invisible reproduciendo');
                } catch (playErr) {
                    console.warn('⚠️ Video play falló (normal si no hay interacción):', playErr.message);
                }

                console.log('✅ Estrategias anti-sleep activadas');

            } catch (err) {
                console.error('❌ Error al activar mantener pantalla:', err);
            }
        };

        // Activar al montar
        requestWakeLock();

        // Limpiar al desmontar
        return () => {
            // Limpiar Wake Lock API
            if (wakeLockRef.current) {
                wakeLockRef.current.release()
                    .then(() => {
                        console.log('🔓 Wake Lock liberado');
                        wakeLockRef.current = null;
                    })
                    .catch(() => {});
            }

            // Limpiar video invisible
            if (noSleepVideoRef.current) {
                noSleepVideoRef.current.pause();
                noSleepVideoRef.current.remove();
                noSleepVideoRef.current = null;
                console.log('🛑 Video invisible detenido');
            }
        };
    }, []);

    // Re-activar cuando la página vuelve a ser visible
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
                // Reintentar Wake Lock API
                if (!wakeLockRef.current && 'wakeLock' in navigator) {
                    try {
                        const wakeLock = await navigator.wakeLock.request('screen');
                        wakeLockRef.current = wakeLock;
                        console.log('✅ Wake Lock re-activado');
                    } catch (err) {
                        console.warn('⚠️ Error al re-activar Wake Lock:', err.message);
                    }
                }

                // Reintentar video invisible
                if (noSleepVideoRef.current && noSleepVideoRef.current.paused) {
                    try {
                        await noSleepVideoRef.current.play();
                        console.log('✅ Video invisible re-activado');
                    } catch (err) {
                        console.warn('⚠️ Error al re-activar video:', err.message);
                    }
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Timer principal
    useEffect(() => {
        if (isPaused) return;

        if (secondsRemaining === 0) {
            onFinish();
            return;
        }

        const timer = setInterval(() => {
            setSecondsRemaining(s => s - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsRemaining, isPaused, onFinish]);

    // Calcular minutos y segundos
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;

    // Calcular progreso
    const progress = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;

    // Color según tiempo restante
    const getTimerColor = () => {
        if (secondsRemaining > 120) return 'text-white';
        if (secondsRemaining > 60) return 'text-yellow-300';
        return 'text-red-400';
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
                                    <h3 className="text-2xl md:text-2xl font-bold text-gray-900 mb-0.5 md:mb-1 truncate">
                                        {exercise.name}
                                    </h3>
                                    <p className="text-2xl md:text-xl text-indigo-600 font-semibold">
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
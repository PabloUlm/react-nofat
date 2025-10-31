// src/components/workout/WorkoutTimer.jsx
import { useState, useEffect, useRef } from 'react';

function WorkoutTimer({ duration, exercises, onFinish, onCancel }) {
    const totalSeconds = duration * 60;
    const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
    const [isPaused, setIsPaused] = useState(false);

    // 🐛 DEBUG
    const [debugLogs, setDebugLogs] = useState([]);
    const [showDebug, setShowDebug] = useState(true);
    const [audioActive, setAudioActive] = useState(false);
    const [keepaliveActive, setKeepaliveActive] = useState(false);
    const [lastAction, setLastAction] = useState('Iniciando...');
    const [timerDrift, setTimerDrift] = useState(0); // Mostrar drift del timer

    const audioContextRef = useRef(null);
    const oscillatorRef = useRef(null);
    const keepaliveIntervalRef = useRef(null);
    const wakeLockRef = useRef(null);

    // 🎯 Referencias para timer robusto
    const startTimeRef = useRef(null);
    const pausedTimeRef = useRef(0);
    const lastTickRef = useRef(Date.now());
    const timerIntervalRef = useRef(null);

    // 🐛 Logger
    const addDebugLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString('es-ES');
        const log = { time: timestamp, message, type };
        setDebugLogs(prev => [...prev, log].slice(-15));
        console.log(`[${timestamp}] ${message}`);
    };

    // 🔔 NUEVO: Reproducir alarma cuando termina el timer
    const playAlarm = () => {
        try {
            addDebugLog('🔔 Reproduciendo alarma...', 'info');

            // Crear contexto de audio si no existe
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const alarmContext = new AudioContext();

            // Crear una secuencia de 3 beeps
            const beepTimes = [0, 0.3, 0.6]; // 3 beeps con 300ms entre cada uno

            beepTimes.forEach((time, index) => {
                const oscillator = alarmContext.createOscillator();
                const gainNode = alarmContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(alarmContext.destination);

                // Frecuencia del beep (800Hz - audible y no muy molesto)
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';

                // Volumen medio
                gainNode.gain.value = 0.3;

                // Fade out suave al final de cada beep
                const startTime = alarmContext.currentTime + time;
                const duration = 0.2; // 200ms por beep

                gainNode.gain.setValueAtTime(0.3, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

                oscillator.start(startTime);
                oscillator.stop(startTime + duration);

                // Si es el último beep, cerrar el contexto después
                if (index === beepTimes.length - 1) {
                    setTimeout(() => {
                        alarmContext.close();
                    }, (time + duration) * 1000 + 100);
                }
            });

            // También vibrar si está disponible
            if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200, 100, 200]); // 3 vibraciones
            }

            addDebugLog('✅ Alarma reproducida', 'success');

        } catch (err) {
            addDebugLog(`❌ Error reproduciendo alarma: ${err.name}`, 'error');
            console.error('Error en alarma:', err);
        }
    };

    // 🎵 Audio API silencioso
    const activateAudioKeepAlive = () => {
        try {
            addDebugLog('🎵 Activando Audio API...', 'info');

            const AudioContext = window.AudioContext || window.webkitAudioContext;

            if (!AudioContext) {
                addDebugLog('❌ AudioContext no disponible', 'error');
                return false;
            }

            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            gainNode.gain.value = 0.001;
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = 20000;
            oscillator.type = 'sine';
            oscillator.start(0);

            oscillatorRef.current = oscillator;
            setAudioActive(true);
            setLastAction('Audio API activo');
            addDebugLog('✅ Audio API ACTIVADO', 'success');

            return true;
        } catch (err) {
            addDebugLog(`❌ Audio API falló: ${err.name}`, 'error');
            return false;
        }
    };

    // 🔄 Keepalive
    const startKeepalive = () => {
        if (keepaliveIntervalRef.current) {
            clearInterval(keepaliveIntervalRef.current);
        }

        addDebugLog('🔄 Iniciando keepalive (15s)', 'info');

        keepaliveIntervalRef.current = setInterval(() => {
            if (!isPaused) {
                document.title = `💪 ${Math.floor(secondsRemaining / 60)}:${String(secondsRemaining % 60).padStart(2, '0')}`;

                if (navigator.vibrate) {
                    navigator.vibrate(1);
                }

                window.scrollBy(0, 0.1);
                window.scrollBy(0, -0.1);

                addDebugLog('💓 Keepalive ping', 'info');
            }
        }, 15000);

        setKeepaliveActive(true);
        addDebugLog('✅ Keepalive iniciado', 'success');
    };

    // 🚀 Activación principal
    const activateScreenProtection = async () => {
        addDebugLog('🚀 Activando protección...', 'info');

        let successCount = 0;

        if (activateAudioKeepAlive()) {
            successCount++;
        }

        if ('wakeLock' in navigator) {
            try {
                const wakeLock = await navigator.wakeLock.request('screen');
                wakeLockRef.current = wakeLock;
                addDebugLog('✅ Wake Lock activado', 'success');
                successCount++;

                wakeLock.addEventListener('release', () => {
                    addDebugLog('⚠️ Wake Lock liberado', 'warning');
                    wakeLockRef.current = null;
                });
            } catch (err) {
                addDebugLog(`⚠️ Wake Lock: ${err.name}`, 'warning');
            }
        }

        startKeepalive();
        successCount++;

        addDebugLog(`✅ ${successCount} métodos activos`, 'success');
        setLastAction(`${successCount} métodos activos`);
    };

    // ⏱️ TIMER ROBUSTO: Usa tiempo real en lugar de setInterval
    // Esto garantiza que funcione incluso si la pantalla se bloquea
    const startRobustTimer = () => {
        // Guardar tiempo de inicio
        startTimeRef.current = Date.now();
        lastTickRef.current = Date.now();

        addDebugLog('⏱️ Timer robusto iniciado', 'success');

        // Función que calcula el tiempo transcurrido real
        const updateTimer = () => {
            if (isPaused) return;

            const now = Date.now();
            const elapsed = Math.floor((now - startTimeRef.current - pausedTimeRef.current) / 1000);
            const remaining = totalSeconds - elapsed;

            // Calcular drift (diferencia entre timer esperado y real)
            const expectedTick = lastTickRef.current + 1000;
            const drift = now - expectedTick;
            setTimerDrift(Math.round(drift));
            lastTickRef.current = now;

            if (remaining <= 0) {
                addDebugLog('⏰ Timer completado', 'success');
                clearInterval(timerIntervalRef.current);

                // 🔔 REPRODUCIR ALARMA
                playAlarm();

                // Esperar un poco antes de llamar onFinish para que se escuche la alarma
                setTimeout(() => {
                    onFinish();
                }, 1000);
            } else {
                setSecondsRemaining(remaining);
            }
        };

        // Actualizar cada 100ms para mayor precisión
        // Incluso si iOS ralentiza JavaScript, esto se autocorrige
        timerIntervalRef.current = setInterval(updateTimer, 100);
    };

    // 🎬 Inicializar al montar
    useEffect(() => {
        addDebugLog('🎬 Componente montado', 'info');
        setLastAction('Esperando interacción...');

        // Iniciar timer inmediatamente
        startRobustTimer();

        return () => {
            // Cleanup
            if (audioContextRef.current) {
                try {
                    if (oscillatorRef.current) {
                        oscillatorRef.current.stop();
                    }
                    audioContextRef.current.close();
                    addDebugLog('🔇 Audio cerrado', 'info');
                } catch (err) {
                    console.error('Error cerrando audio:', err);
                }
            }

            if (keepaliveIntervalRef.current) {
                clearInterval(keepaliveIntervalRef.current);
                addDebugLog('⏹️ Keepalive detenido', 'info');
            }

            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                addDebugLog('⏹️ Timer detenido', 'info');
            }

            if (wakeLockRef.current) {
                wakeLockRef.current.release().catch(console.error);
            }
        };
    }, []);

    // 🎯 Activar protección con interacción del usuario
    useEffect(() => {
        if (!isPaused && !audioActive) {
            addDebugLog('🎯 Activando protección...', 'info');
            activateScreenProtection();
        }
    }, [isPaused]);

    // 🔄 Re-activar en cambios de visibilidad
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !isPaused) {
                addDebugLog('👀 App visible', 'info');

                // Verificar si el timer se detuvo y reiniciarlo
                if (!timerIntervalRef.current) {
                    addDebugLog('⚠️ Timer detenido, reiniciando...', 'warning');
                    startRobustTimer();
                }

                // Reactivar audio si se suspendió
                if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                    audioContextRef.current.resume()
                        .then(() => {
                            addDebugLog('✅ Audio reanudado', 'success');
                            setAudioActive(true);
                        })
                        .catch(err => {
                            addDebugLog(`❌ Audio error: ${err.name}`, 'error');
                        });
                }

                if (!keepaliveIntervalRef.current && !isPaused) {
                    startKeepalive();
                }
            } else if (document.visibilityState === 'hidden') {
                addDebugLog('🌑 App en background', 'warning');
                // NO detenemos el timer aquí - debe seguir corriendo
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isPaused]);

    // ⏸️ Gestión de pausa MANUAL (solo cuando usuario presiona pausa)
    useEffect(() => {
        if (isPaused) {
            addDebugLog('⏸️ USUARIO PAUSÓ', 'info');
            setLastAction('Pausado manualmente');

            // Guardar tiempo pausado para restar del total
            pausedTimeRef.current += Date.now() - lastTickRef.current;

            // Detener timer
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }

            // Pausar audio
            if (audioContextRef.current) {
                audioContextRef.current.suspend()
                    .then(() => {
                        setAudioActive(false);
                        addDebugLog('🔇 Audio pausado', 'info');
                    })
                    .catch(console.error);
            }

            // Detener keepalive
            if (keepaliveIntervalRef.current) {
                clearInterval(keepaliveIntervalRef.current);
                keepaliveIntervalRef.current = null;
                setKeepaliveActive(false);
                addDebugLog('⏹️ Keepalive detenido', 'info');
            }
        } else {
            addDebugLog('▶️ USUARIO REANUDÓ', 'success');
            setLastAction('Reanudado manualmente');

            // Reiniciar timer
            lastTickRef.current = Date.now();
            startRobustTimer();

            // Reanudar audio
            if (audioContextRef.current) {
                audioContextRef.current.resume()
                    .then(() => {
                        setAudioActive(true);
                        addDebugLog('🔊 Audio reanudado', 'success');
                    })
                    .catch(err => {
                        addDebugLog(`❌ Error audio: ${err.name}`, 'error');
                        activateAudioKeepAlive();
                    });
            } else {
                activateAudioKeepAlive();
            }

            // Reiniciar keepalive
            if (!keepaliveIntervalRef.current) {
                startKeepalive();
            }
        }
    }, [isPaused]);

    // Calcular tiempo
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    const progress = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;

    const getTimerColor = () => {
        if (secondsRemaining > 120) return 'text-white';
        if (secondsRemaining > 60) return 'text-yellow-300';
        return 'text-red-400';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* 🐛 PANEL DE DEBUG */}
            {showDebug && (
                <div className="fixed top-0 left-0 right-0 z-[9999] bg-black/95 text-white text-xs p-2 max-h-52 overflow-y-auto">
                    <button
                        onClick={() => setShowDebug(false)}
                        className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                        Ocultar
                    </button>

                    {/* Estado actual */}
                    <div className="mb-2 pb-2 border-b border-gray-600">
                        <div className="font-bold text-yellow-400 mb-1">📊 ESTADO iOS:</div>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                            <div>Audio: {audioActive ? '✅ ACTIVO' : '❌ INACTIVO'}</div>
                            <div>Keepalive: {keepaliveActive ? '✅ ON' : '❌ OFF'}</div>
                            <div>Timer: {timerIntervalRef.current ? '✅ ON' : '❌ OFF'}</div>
                            <div>Drift: {timerDrift}ms</div>
                            <div className="col-span-2 text-[10px]">Última: {lastAction}</div>
                        </div>
                    </div>

                    {/* Info del timer */}
                    <div className="mb-2 pb-2 border-b border-gray-600">
                        <div className="text-[10px] text-gray-400">
                            Timer robusto: Funciona incluso con pantalla bloqueada
                        </div>
                    </div>

                    {/* Logs */}
                    <div className="space-y-0.5 text-[10px]">
                        {debugLogs.map((log, idx) => (
                            <div
                                key={idx}
                                className={`${
                                    log.type === 'error' ? 'text-red-400' :
                                        log.type === 'warning' ? 'text-yellow-400' :
                                            log.type === 'success' ? 'text-green-400' :
                                                'text-gray-300'
                                }`}
                            >
                                <span className="text-gray-500">[{log.time}]</span> {log.message}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!showDebug && (
                <button
                    onClick={() => setShowDebug(true)}
                    className="fixed top-2 right-2 z-[9999] bg-purple-600 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-lg"
                >
                    🐛
                </button>
            )}

            {/* HEADER con Timer */}
            <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg" style={{ marginTop: showDebug ? '13rem' : '0' }}>
                <div className="h-1 md:h-2 bg-indigo-800">
                    <div
                        className="h-full bg-green-400 transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="px-3 py-3 md:px-6 md:py-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between md:block">
                            <div className="flex-1 md:mb-3">
                                <p className="text-indigo-200 text-xs md:text-sm mb-0.5 md:mb-1">
                                    Tiempo restante {isPaused && '(PAUSADO)'}
                                </p>
                                <h1 className={`text-4xl md:text-7xl font-bold tabular-nums ${getTimerColor()}`}>
                                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                                </h1>
                            </div>

                            <div className="flex gap-2 md:gap-3">
                                <button
                                    onClick={() => {
                                        // CRÍTICO: Esta interacción activa el Audio API
                                        setIsPaused(!isPaused);
                                    }}
                                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition text-sm md:text-base"
                                >
                                    <span className="md:hidden">{isPaused ? '▶️' : '⏸️'}</span>
                                    <span className="hidden md:inline">{isPaused ? '▶️ Reanudar' : '⏸️ Pausa'}</span>
                                </button>

                                <button
                                    onClick={() => {
                                        if (confirm('¿Cancelar workout?')) {
                                            onCancel();
                                        }
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition text-sm md:text-base"
                                >
                                    <span className="md:hidden">✕</span>
                                    <span className="hidden md:inline">✕ Cancelar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instrucción inicial */}
                {!audioActive && !isPaused && (
                    <div className="bg-yellow-500/90 px-3 py-2">
                        <p className="text-xs text-yellow-900 text-center font-semibold">
                            ⚠️ TOCA "PAUSA" Y "REANUDAR" para activar protección de pantalla
                        </p>
                    </div>
                )}

                {/* Confirmación cuando está activo */}
                {audioActive && !isPaused && (
                    <div className="bg-green-500/90 px-3 py-2">
                        <p className="text-xs text-white text-center font-semibold">
                            ✅ Protección activa - El timer continuará aunque se bloquee la pantalla
                        </p>
                    </div>
                )}
            </div>

            {isPaused && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 md:p-4">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-yellow-800 font-semibold text-sm md:text-base">
                            ⏸️ Workout PAUSADO - Toca "Reanudar" para continuar
                        </p>
                    </div>
                </div>
            )}

            {/* EJERCICIOS */}
            <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-8">
                <div className="mb-4 md:mb-6">
                    <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                        📋 Ejercicios del Circuito
                    </h2>
                </div>

                <div className="space-y-3 md:space-y-4">
                    {exercises.map((exercise, index) => (
                        <div
                            key={exercise.id}
                            className="bg-white rounded-lg shadow-md p-3 md:p-6"
                        >
                            <div className="flex items-center gap-3 md:gap-6">
                                <div className="flex-shrink-0 w-10 h-10 md:w-16 md:h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-lg md:text-2xl font-bold">
                                        {index + 1}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-base md:text-2xl font-bold text-gray-900 truncate">
                                        {exercise.name}
                                    </h3>
                                    <p className="text-xl text-indigo-600 font-semibold">
                                        {exercise.defaultReps} {exercise.repsType === 'time' ? 'seg' : 'reps'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WorkoutTimer;
// src/pages/WorkoutSession.jsx
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentWeekWorkout } from '../redux/slices/workoutsSlice';
import { selectCurrentUser } from '../redux/slices/authSlice';
import PreCountdown from '../components/workout/PreCountdown';
import WorkoutTimer from '../components/workout/WorkoutTimer';
import PostWorkoutForm from '../components/workout/PostWorkoutForm';

function WorkoutSession() {
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
    const workout = useSelector(selectCurrentWeekWorkout);

    // Fases: 'pre-countdown' | 'workout' | 'finished'
    const [phase, setPhase] = useState('pre-countdown');

    // Tipo de sesión
    const [isRecovery] = useState(false);
    const duration = isRecovery ? 20 : 10;

    // 🔔 Función de alarma en el PADRE con duración controlada
    const playWorkoutAlarm = useCallback(() => {
        // ⚙️ CONFIGURACIÓN: Parámetros fáciles de modificar
        const ALARM_MAX_DURATION = 3000; // Duración total en milisegundos
        const ALARM_VOLUME = 0.9; // Volumen (0.0 a 1.0)
        const BEEP_DURATION = 200; // Duración de cada beep en ms
        const BEEP_INTERVAL = 300; // Intervalo entre beeps en ms
        const BEEP_FREQUENCY = 800; // Frecuencia del tono en Hz

        try {
            console.log(`🔔 [PADRE] Reproduciendo alarma (máximo ${ALARM_MAX_DURATION}ms)...`);

            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const alarmContext = new AudioContext();

            // 📊 Calcular cuántos beeps caben en ALARM_MAX_DURATION
            const maxBeeps = Math.floor(ALARM_MAX_DURATION / BEEP_INTERVAL);

            // Generar tiempos de beeps dinámicamente
            const beepTimes = [];
            for (let i = 0; i < maxBeeps; i++) {
                beepTimes.push(i * (BEEP_INTERVAL / 1000)); // Convertir a segundos
            }

            console.log(`🔔 Reproduciendo ${beepTimes.length} beeps (cada ${BEEP_INTERVAL}ms)`);

            const oscillators = [];

            beepTimes.forEach((time) => {
                const oscillator = alarmContext.createOscillator();
                const gainNode = alarmContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(alarmContext.destination);

                oscillator.frequency.value = BEEP_FREQUENCY;
                oscillator.type = 'sine';

                // Fade in y fade out suave para mejor sonido
                const startTime = alarmContext.currentTime + time;
                const beepDurationSec = BEEP_DURATION / 1000;

                gainNode.gain.setValueAtTime(0.01, startTime);
                gainNode.gain.exponentialRampToValueAtTime(ALARM_VOLUME, startTime + 0.05); // Fade in rápido
                gainNode.gain.setValueAtTime(ALARM_VOLUME, startTime + (beepDurationSec * 0.7));
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + beepDurationSec); // Fade out

                oscillator.start(startTime);
                oscillator.stop(startTime + beepDurationSec);

                oscillators.push(oscillator);
            });

            // Vibración (ajustar según número de beeps)
            if (navigator.vibrate) {
                const vibrationPattern = [];
                for (let i = 0; i < Math.min(beepTimes.length, 5); i++) {
                    vibrationPattern.push(200, 100); // Vibrar-pausa
                }
                navigator.vibrate(vibrationPattern);
            }

            // 🛑 KILL SWITCH: Forzar cierre después de ALARM_MAX_DURATION + buffer
            const killTimeout = setTimeout(() => {
                console.log('🛑 [PADRE] Forzando cierre de alarma...');

                // 1. Detener todos los osciladores
                oscillators.forEach(osc => {
                    try {
                        osc.stop();
                        osc.disconnect();
                    } catch (e) {
                        // Ignorar si ya está detenido
                        console.log(e);
                    }
                });

                // 2. Cerrar el contexto de audio (CRÍTICO)
                if (alarmContext.state !== 'closed') {
                    alarmContext.close()
                        .then(() => {
                            console.log('✅ [PADRE] Contexto de audio cerrado');
                        })
                        .catch(err => {
                            console.error('Error cerrando contexto:', err);
                        });
                }

                console.log('✅ [PADRE] Alarma detenida forzadamente');
            }, ALARM_MAX_DURATION + 500); // +500ms de buffer

            // Limpiar timeout si el componente se desmonta antes
            return () => clearTimeout(killTimeout);

        } catch (err) {
            console.error('❌ [PADRE] Error en alarma:', err);
        }
    }, []);

    // Handler cuando termina el workout
    const handleWorkoutFinish = useCallback(() => {
        console.log('⏰ [PADRE] Workout terminado, reproduciendo alarma...');

        // 1. Reproducir alarma INMEDIATAMENTE
        playWorkoutAlarm();

        // 2. Cambiar a fase "finished" después de que termine la alarma
        setTimeout(() => {
            console.log('✅ [PADRE] Cambiando a fase finished');
            setPhase('finished');
        }, 1000);
    }, [playWorkoutAlarm]);

    // Si no hay workout generado, volver al dashboard
    if (!workout && !isRecovery) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        ⚠️ No hay workout generado
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Necesitas generar un workout semanal antes de realizar una sesión.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
                    >
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* FASE 1: Pre-Countdown (8 segundos) */}
            {phase === 'pre-countdown' && (
                <PreCountdown
                    onFinish={() => setPhase('workout')}
                    onCancel={() => navigate('/dashboard')}
                />
            )}

            {/* FASE 2: Workout Timer (10 o 20 minutos) */}
            {phase === 'workout' && (
                <WorkoutTimer
                    duration={duration}
                    exercises={workout?.exercises || []}
                    onFinish={handleWorkoutFinish}
                    onCancel={() => navigate('/dashboard')}
                />
            )}

            {/* FASE 3: Formulario de Registro */}
            {phase === 'finished' && (
                <PostWorkoutForm
                    workout={workout}
                    isRecovery={isRecovery}
                    playerId={currentUser.id}
                    onComplete={() => navigate('/dashboard')}
                />
            )}
        </div>
    );
}

export default WorkoutSession;
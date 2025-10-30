// src/pages/WorkoutSession.jsx
import { useState, useRef, useEffect } from 'react';
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
    const [isRecovery] = useState(false); // Por ahora false, luego lo haremos dinámico
    const duration = isRecovery ? 20 : 10; // minutos

    // Ref para almacenar el audio silencioso (compartido entre componentes)
    const audioRef = useRef(null);

    // Cleanup: Detener audio al desmontar o volver al dashboard
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                console.log('🔇 [WorkoutSession] Deteniendo audio silencioso al salir');
                audioRef.current.pause();
                audioRef.current.src = '';
                audioRef.current = null;
            }
        };
    }, []);

    // Handler para recibir el audio desde PreCountdown
    const handleAudioReady = (audio) => {
        audioRef.current = audio;
        if (audio) {
            console.log('✅ [WorkoutSession] Audio recibido desde PreCountdown');
        } else {
            console.warn('⚠️ [WorkoutSession] Audio no se pudo inicializar en PreCountdown');
        }
    };

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
            {/* FASE 1: Pre-Countdown (8 segundos) - Aquí se inicia el audio */}
            {phase === 'pre-countdown' && (
                <PreCountdown
                    onFinish={() => setPhase('workout')}
                    onCancel={() => navigate('/dashboard')}
                    onAudioReady={handleAudioReady}
                />
            )}

            {/* FASE 2: Workout Timer (10 o 20 minutos) - Recibe el audio */}
            {phase === 'workout' && (
                <WorkoutTimer
                    duration={duration}
                    exercises={workout?.exercises || []}
                    onFinish={() => setPhase('finished')}
                    onCancel={() => navigate('/dashboard')}
                    audioRef={audioRef.current}
                />
            )}

            {/* FASE 3: Formulario de Registro - Audio se limpia automáticamente */}
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
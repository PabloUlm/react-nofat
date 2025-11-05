// src/pages/WorkoutSession.jsx
import { useState, useCallback, useEffect } from 'react';
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

    // Solicitar permiso de notificaciones al montar el componente
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Función para alertar al usuario cuando termine el workout
    const alertWorkoutFinished = useCallback(() => {
        // 1️⃣ Vibración de 3 segundos (patrón intenso)
        if (navigator.vibrate) {
            // Patrón: vibrar 500ms, pausa 200ms, repetido durante 3 segundos
            navigator.vibrate([
                500, 200,
                500, 200,
                500, 200,
                500, 200,
                500
            ]);
        }

        // 2️⃣ Notificación del navegador
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🎉 ¡Workout Completado!', {
                body: `¡Excelente trabajo! Has completado tu workout de ${duration} minutos.`,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-96x96.png',
                tag: 'workout-finished',
                requireInteraction: true, // Mantener la notificación hasta que el usuario la cierre
                vibrate: [500, 200, 500] // Vibración adicional con la notificación
            });
        }
    }, [duration]);

    // Si no hay workout generado, volver al dashboard
    if (!workout && !isRecovery) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        âš ï¸ No hay workout generado
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Necesitas generar un workout semanal antes de realizar una sesiÃ³n.
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
            {/* Banner informativo sobre notificaciones (solo en pre-countdown) */}
            {phase === 'pre-countdown' && Notification.permission === 'default' && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 text-sm">
                    <p className="text-yellow-800">
                        💡 <strong>Tip:</strong> Activa las notificaciones para recibir una alerta cuando termine el workout
                    </p>
                </div>
            )}

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
                    onFinish={() => {
                        alertWorkoutFinished();
                        setPhase('finished');
                    }}
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
// src/pages/WorkoutSession.jsx
import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentWeekWorkout } from '../redux/slices/workoutsSlice';
import { selectCurrentUser } from '../redux/slices/authSlice';
import PreCountdown from '../components/workout/PreCountdown';
import WorkoutTimer from '../components/workout/WorkoutTimer';
import PostWorkoutForm from '../components/workout/PostWorkoutForm';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { KeepAwake } from '@capacitor-community/keep-awake';

function WorkoutSession() {
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
    const workout = useSelector(selectCurrentWeekWorkout);

    // Fases: 'pre-countdown' | 'workout' | 'finished'
    const [phase, setPhase] = useState('pre-countdown');

    // Tipo de sesión
    const [isRecovery] = useState(false);
    const duration = isRecovery ? 20 : 10;

    // Solicitar permisos de notificaciones al montar
    useEffect(() => {
        const requestPermissions = async () => {
            try {
                const result = await LocalNotifications.requestPermissions();
                if (result.display !== 'granted') {
                    console.warn('Permisos de notificación no concedidos');
                }
            } catch (error) {
                console.log('LocalNotifications no disponible (probablemente en web)');
            }
        };

        requestPermissions();
    }, []);

    // Función para alertar al usuario cuando termine el workout
    const alertWorkoutFinished = useCallback(async () => {
        try {
            // 1️⃣ Vibración de 3 segundos (patrón intenso)
            try {
                // Patrón: 5 impactos pesados con pausas
                await Haptics.impact({ style: ImpactStyle.Heavy });
                await new Promise(resolve => setTimeout(resolve, 200));
                await Haptics.impact({ style: ImpactStyle.Heavy });
                await new Promise(resolve => setTimeout(resolve, 200));
                await Haptics.impact({ style: ImpactStyle.Heavy });
                await new Promise(resolve => setTimeout(resolve, 200));
                await Haptics.impact({ style: ImpactStyle.Heavy });
                await new Promise(resolve => setTimeout(resolve, 200));
                await Haptics.impact({ style: ImpactStyle.Heavy });
            } catch (error) {
                console.log('Haptics no disponible, usando vibración web fallback');
                // Fallback para web
                if (navigator.vibrate) {
                    navigator.vibrate([500, 200, 500, 200, 500, 200, 500, 200, 500]);
                }
            }

            // 2️⃣ Notificación local
            try {
                await LocalNotifications.schedule({
                    notifications: [
                        {
                            title: '🎉 ¡Workout Completado!',
                            body: `¡Excelente trabajo! Has completado tu workout de ${duration} minutos.`,
                            id: Date.now(),
                            schedule: { at: new Date(Date.now() + 100) }, // Inmediatamente
                            sound: 'beep.wav',
                            attachments: undefined,
                            actionTypeId: '',
                            extra: null,
                        },
                    ],
                });
            } catch (error) {
                console.log('LocalNotifications no disponible, usando Notification API fallback');
                // Fallback para web
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('🎉 ¡Workout Completado!', {
                        body: `¡Excelente trabajo! Has completado tu workout de ${duration} minutos.`,
                        icon: '/icons/icon-192x192.png',
                        badge: '/icons/icon-96x96.png',
                        tag: 'workout-finished',
                        requireInteraction: true,
                    });
                }
            }
        } catch (error) {
            console.error('Error en alertWorkoutFinished:', error);
        }
    }, [duration]);

    // Manejar cuando inicia el workout (activar Keep Awake)
    const handleWorkoutStart = useCallback(async () => {
        try {
            await KeepAwake.keepAwake();
            console.log('✅ Pantalla permanecerá encendida durante el workout');
        } catch (error) {
            console.log('KeepAwake no disponible (probablemente en web)');
        }
        setPhase('workout');
    }, []);

    // Manejar cuando termina el workout (desactivar Keep Awake)
    const handleWorkoutFinish = useCallback(async () => {
        try {
            await KeepAwake.allowSleep();
            console.log('✅ Pantalla puede apagarse de nuevo');
        } catch (error) {
            console.log('KeepAwake no disponible');
        }

        await alertWorkoutFinished();
        setPhase('finished');
    }, [alertWorkoutFinished]);

    // Limpiar Keep Awake cuando el componente se desmonte
    useEffect(() => {
        return () => {
            KeepAwake.allowSleep().catch(() => {
                // Ignorar error si ya está permitido
            });
        };
    }, []);

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
                    onFinish={handleWorkoutStart}
                    onCancel={() => navigate('/dashboard')}
                />
            )}

            {/* FASE 2: Workout Timer (10 o 20 minutos) */}
            {phase === 'workout' && (
                <WorkoutTimer
                    duration={duration}
                    exercises={workout?.exercises || []}
                    onFinish={handleWorkoutFinish}
                    onCancel={async () => {
                        try {
                            await KeepAwake.allowSleep();
                        } catch (error) {
                            // Ignorar
                        }
                        navigate('/dashboard');
                    }}
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
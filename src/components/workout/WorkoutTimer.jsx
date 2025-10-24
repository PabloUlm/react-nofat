// src/components/workout/WorkoutTimer.jsx
import { useState, useEffect } from 'react';

function WorkoutTimer({ duration, exercises, onFinish, onCancel }) {
    const totalSeconds = duration * 60; // Convertir minutos a segundos
    const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
    const [isPaused, setIsPaused] = useState(false);

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
            {/* HEADER STICKY con Timer */}
            <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
                {/* Barra de progreso */}
                <div className="h-2 bg-indigo-800">
                    <div
                        className="h-full bg-green-400 transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Timer y controles */}
                <div className="px-6 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        {/* Timer */}
                        <div className="flex-1">
                            <p className="text-indigo-200 text-sm mb-1">Tiempo restante</p>
                            <h1 className={`text-7xl font-bold tabular-nums ${getTimerColor()}`}>
                                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                            </h1>
                        </div>

                        {/* Controles */}
                        <div className="flex gap-3">
                            {/* Botón Pausa/Reanudar */}
                            <button
                                onClick={() => setIsPaused(!isPaused)}
                                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition"
                            >
                                {isPaused ? '▶️ Reanudar' : '⏸️ Pausa'}
                            </button>

                            {/* Botón Cancelar */}
                            <button
                                onClick={() => {
                                    if (confirm('¿Seguro que quieres cancelar el workout?')) {
                                        onCancel();
                                    }
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                            >
                                ✕ Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mensaje de pausa */}
            {isPaused && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-yellow-800 font-semibold">
                            ⏸️ Workout en pausa - Click "Reanudar" para continuar
                        </p>
                    </div>
                </div>
            )}

            {/* LISTA DE EJERCICIOS (Scrollable) */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        📋 Ejercicios del Circuito
                    </h2>
                    <p className="text-gray-600">
                        Completa tantas rondas como puedas. ¡Vamos! 💪
                    </p>
                </div>

                <div className="space-y-4">
                    {exercises.map((exercise, index) => (
                        <div
                            key={exercise.id}
                            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                        >
                            <div className="flex items-center gap-6">
                                {/* Número del ejercicio */}
                                <div className="flex-shrink-0 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {index + 1}
                  </span>
                                </div>

                                {/* Info del ejercicio */}
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                        {exercise.name}
                                    </h3>
                                    <p className="text-xl text-indigo-600 font-semibold">
                                        {exercise.defaultReps} {exercise.repsType === 'time' ? 'segundos' : 'repeticiones'}
                                    </p>
                                </div>

                                {/* Badge de dificultad */}
                                <div className="flex-shrink-0">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      exercise.difficulty === 'principiante' ? 'bg-green-100 text-green-800' :
                          exercise.difficulty === 'intermedio' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                  }`}>
                    {exercise.difficulty}
                  </span>
                                </div>
                            </div>

                            {/* Descripción (opcional, puede ocupar mucho) */}
                            <p className="text-gray-600 text-sm mt-3 ml-22">
                                {exercise.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Nota al final */}
                <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                    <p className="text-blue-800">
                        <strong>💡 Recuerda:</strong> Completa los ejercicios en orden.
                        Al terminar el último, vuelve al primero para empezar una nueva ronda.
                        ¡No pares hasta que suene el timer!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default WorkoutTimer;
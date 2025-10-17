import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadSession } from '../../redux/slices/sessionsSlice';
import { markWorkoutCompleted, selectCurrentWeekWorkout } from '../../redux/slices/workoutsSlice';
import { getWeekNumber } from '../../utils/dateHelpers';

function SessionUpload({ playerId }) {
    const dispatch = useDispatch();
    const currentWeekWorkout = useSelector(selectCurrentWeekWorkout);
    const currentWeek = getWeekNumber(new Date());

    const [photo, setPhoto] = useState('');
    const [completedRounds, setCompletedRounds] = useState('');
    const [partialExercise, setPartialExercise] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Validar que haya workout activo
        if (!currentWeekWorkout) {
            alert('❌ No hay workout activo esta semana. Genera uno primero.');
            setLoading(false);
            return;
        }

        // Construir el resultado en formato "X.Y" o "X"
        const roundsComplete = parseInt(completedRounds) || 0;
        const partialEx = parseInt(partialExercise) || 0;
        const result = partialEx > 0
            ? `${roundsComplete}.${partialEx} rondas`
            : `${roundsComplete} rondas`;

        // Subir sesión
        const response = dispatch(
            uploadSession({
                playerId,
                photo: photo || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%234F46E5"/%3E%3Ctext x="50%25" y="50%25" font-size="80" text-anchor="middle" dy=".3em" fill="white"%3E💪%3C/text%3E%3C/svg%3E',
                result,
                date: new Date().toISOString(),
            })
        );

        // Si la sesión se subió correctamente
        if (response.success) {
            dispatch(markWorkoutCompleted({
                weekNumber: currentWeek,
                exercises: currentWeekWorkout.exercises,
                result: result,
                rounds: roundsComplete,
                partialExercise: partialEx,
                duration: currentWeekWorkout.duration,
                playerId: playerId
            }));

            alert(`✅ ¡Sesión registrada con éxito!\n📊 Resultado: ${result}`);
            setPhoto('');
            setCompletedRounds('');
            setPartialExercise('');
        } else {
            alert(`❌ Error: ${response.error}`);
        }

        setLoading(false);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-xl font-bold mb-4">📸 Registrar Nueva Sesión</h3>

            {/* Mostrar info del workout actual */}
            {currentWeekWorkout ? (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-sm font-semibold text-blue-900">
                                📋 Workout de esta semana: <span className="text-blue-700">{currentWeekWorkout.focus}</span>
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                                AMRAP {currentWeekWorkout.duration} min · {currentWeekWorkout.exercises.length} ejercicios por ronda
                            </p>
                        </div>
                    </div>

                    {/* Lista compacta de ejercicios */}
                    <details className="mt-3">
                        <summary className="text-xs text-blue-800 cursor-pointer hover:text-blue-900 font-medium">
                            Ver ejercicios del circuito ▼
                        </summary>
                        <div className="mt-2 pl-3 space-y-1">
                            {currentWeekWorkout.exercises.map((ex, idx) => (
                                <p key={ex.id} className="text-xs text-gray-700">
                                    <span className="font-semibold text-indigo-600">{idx + 1}.</span> {ex.name} - {ex.defaultReps} {ex.repsType === 'time' ? 'seg' : 'reps'}
                                </p>
                            ))}
                        </div>
                    </details>
                </div>
            ) : (
                <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-yellow-800">
                        ⚠️ No hay workout generado para esta semana. Ve al inicio del dashboard para generar uno.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL de la Foto (opcional)
                    </label>
                    <input
                        type="url"
                        value={photo}
                        onChange={(e) => setPhoto(e.target.value)}
                        placeholder="https://ejemplo.com/foto.jpg"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                {/* Rondas completadas - OBLIGATORIO */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rondas Completas *
                    </label>
                    <input
                        type="number"
                        value={completedRounds}
                        onChange={(e) => setCompletedRounds(e.target.value)}
                        placeholder="Ej: 5"
                        min="0"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        ¿Cuántas rondas <strong>completas</strong> lograste en {currentWeekWorkout?.duration || 10} minutos?
                    </p>
                </div>

                {/* Ejercicio parcial - OPCIONAL */}
                {currentWeekWorkout && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ejercicio Parcial (opcional)
                        </label>
                        <select
                            value={partialExercise}
                            onChange={(e) => setPartialExercise(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="">-- Ninguno (rondas completas) --</option>
                            {currentWeekWorkout.exercises.map((ex, idx) => (
                                <option key={ex.id} value={idx + 1}>
                                    {idx + 1}. {ex.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Si empezaste otra ronda pero no la completaste, selecciona hasta qué ejercicio llegaste.
                            <br />
                            <span className="text-indigo-600 font-medium">
                                Ejemplo: 5 rondas + ejercicio 3 = "5.3 rondas"
                            </span>
                        </p>
                    </div>
                )}

                {/* Preview del resultado */}
                {completedRounds && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">
                            Tu resultado será:
                            <span className="ml-2 text-lg font-bold text-indigo-600">
                                {completedRounds}{partialExercise ? `.${partialExercise}` : ''} rondas
                            </span>
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !currentWeekWorkout}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Subiendo...' : '✅ Registrar Sesión'}
                </button>
            </form>
        </div>
    );
}

export default SessionUpload;
// src/components/workout/PostWorkoutForm.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadSession } from '../../redux/slices/sessionsSlice';
import { markWorkoutCompleted, selectMuscleGroupRankings } from '../../redux/slices/workoutsSlice';
import { removeWarning } from '../../redux/slices/playersSlice';
import { getWeekNumber } from '../../utils/dateHelpers';
import ProgressModal from './ProgressModal';

function PostWorkoutForm({ workout, isRecovery, playerId, onComplete }) {
    const dispatch = useDispatch();
    const currentWeek = getWeekNumber(new Date());

    const [completedRounds, setCompletedRounds] = useState('');
    const [partialExercise, setPartialExercise] = useState('');
    const [photo, setPhoto] = useState('');
    const [loading, setLoading] = useState(false);
    const [showProgress, setShowProgress] = useState(false);

    // Capturar rankings ANTES de registrar
    const rankingsBefore = useSelector(selectMuscleGroupRankings);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Construir resultado
        const roundsComplete = parseInt(completedRounds) || 0;
        const partialEx = parseInt(partialExercise) || 0;
        const result = partialEx > 0
            ? `${roundsComplete}.${partialEx} rondas`
            : `${roundsComplete} rondas`;

        // Si es recuperación, manejar diferente
        if (isRecovery) {
            const response = dispatch(
                uploadSession({
                    playerId,
                    photo: photo || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect width="150" height="150" fill="%2310B981"/%3E%3Ctext x="50%25" y="50%25" font-size="60" text-anchor="middle" dy=".3em" fill="white"%3E🔄%3C/text%3E%3C/svg%3E',
                    result: 'Recuperación - 20 min',
                    date: new Date().toISOString(),
                    isRecovery: true,
                })
            );

            if (response.success) {
                dispatch(removeWarning(playerId));
                alert('✅ ¡Ejercicio de recuperación completado! Se ha eliminado una amonestación.');
                onComplete();
            } else {
                alert(`❌ Error: ${response.error}`);
            }

            setLoading(false);
            return;
        }

        // Sesión normal
        const response = dispatch(
            uploadSession({
                playerId,
                photo: photo || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%234F46E5"/%3E%3Ctext x="50%25" y="50%25" font-size="80" text-anchor="middle" dy=".3em" fill="white"%3E💪%3C/text%3E%3C/svg%3E',
                result,
                date: new Date().toISOString(),
            })
        );

        if (response.success && workout) {
            dispatch(markWorkoutCompleted({
                weekNumber: currentWeek,
                exercises: workout.exercises,
                result: result,
                rounds: roundsComplete,
                partialExercise: partialEx,
                duration: workout.duration,
                playerId: playerId
            }));

            setLoading(false);

            // Mostrar modal de progreso
            setShowProgress(true);
        } else {
            alert(`❌ Error: ${response.error}`);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
                {/* Celebración */}
                <div className="text-center mb-8">
                    <div className="text-8xl mb-4">🎉</div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        ¡Workout Completado!
                    </h1>
                    <p className="text-xl text-gray-600">
                        {isRecovery ? 'Recuperación de 20 minutos' : `AMRAP ${workout?.duration || 10} minutos`}
                    </p>
                </div>

                {/* Workout Info */}
                {workout && (
                    <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                        <p className="text-sm font-semibold text-indigo-900 mb-2">
                            📋 Workout completado: <span className="text-indigo-600">{workout.focus}</span>
                        </p>
                        <p className="text-xs text-indigo-700">
                            {workout.exercises.length} ejercicios por ronda
                        </p>
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Foto (opcional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            📸 Foto de Celebración (opcional)
                        </label>
                        <input
                            type="url"
                            value={photo}
                            onChange={(e) => setPhoto(e.target.value)}
                            placeholder="https://ejemplo.com/foto.jpg"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    {/* Rondas Completas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            🔢 Rondas Completas *
                        </label>
                        <input
                            type="number"
                            value={completedRounds}
                            onChange={(e) => setCompletedRounds(e.target.value)}
                            placeholder="Ej: 5"
                            min="0"
                            required
                            className="w-full p-4 text-2xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold text-center"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            ¿Cuántas rondas <strong>completas</strong> lograste?
                        </p>
                    </div>

                    {/* Ejercicio Parcial */}
                    {workout && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ➕ Ejercicio Parcial (opcional)
                            </label>
                            <select
                                value={partialExercise}
                                onChange={(e) => setPartialExercise(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="">-- Ninguno (rondas completas) --</option>
                                {workout.exercises.map((ex, idx) => (
                                    <option key={ex.id} value={idx + 1}>
                                        {idx + 1}. {ex.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                Si empezaste otra ronda pero no la completaste, selecciona hasta qué ejercicio llegaste.
                            </p>
                        </div>
                    )}

                    {/* Preview */}
                    {completedRounds && (
                        <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">
                                📊 Tu resultado será:
                            </p>
                            <p className="text-4xl font-bold text-indigo-600 text-center">
                                {completedRounds}{partialExercise ? `.${partialExercise}` : ''} rondas
                            </p>
                        </div>
                    )}

                    {/* Botón Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-bold text-xl hover:from-indigo-700 hover:to-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {loading ? 'Registrando...' : '✅ Registrar Sesión'}
                    </button>
                </form>

                {/* Botón cancelar (volver sin registrar) */}
                <button
                    onClick={onComplete}
                    className="w-full mt-4 text-gray-600 hover:text-gray-800 py-2 text-sm"
                >
                    Volver sin registrar
                </button>
            </div>

            {/* Modal de Progreso */}
            {showProgress && (
                <ProgressModal
                    rankingsBefore={rankingsBefore}
                    playerId={playerId}
                    onClose={() => {
                        setShowProgress(false);
                        onComplete();
                    }}
                />
            )}
        </div>
    );
}

export default PostWorkoutForm;
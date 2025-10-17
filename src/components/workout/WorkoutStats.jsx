// src/components/workout/WorkoutStats.jsx
import { useSelector } from 'react-redux';
import { selectCompletedWorkouts } from '../../redux/slices/workoutsSlice';

function WorkoutStats({ playerId }) {
    const allCompletedWorkouts = useSelector(selectCompletedWorkouts);

    // Filtrar workouts del jugador actual
    const playerWorkouts = allCompletedWorkouts.filter(w => w.playerId === playerId);

    // Calcular estadísticas
    const weeklyWorkouts = playerWorkouts.filter(w => w.type === 'weekly');
    const recoveryWorkouts = playerWorkouts.filter(w => w.type === 'recovery');

    // Calcular rondas con decimales (ej: 5.3 = 5 + 0.3)
    const totalRoundsDecimal = weeklyWorkouts.reduce((sum, w) => {
        const rounds = w.rounds || 0;
        const partial = w.partialExercise || 0;
        const exerciseCount = w.exercises?.length || 1;
        // Convertir ejercicio parcial a decimal: ejercicio 3 de 5 = 0.6
        const partialDecimal = partial > 0 ? partial / exerciseCount : 0;
        return sum + rounds + partialDecimal;
    }, 0);

    const avgRounds = weeklyWorkouts.length > 0
        ? (totalRoundsDecimal / weeklyWorkouts.length).toFixed(2)
        : 0;

    // Últimos 5 workouts
    const recentWorkouts = [...playerWorkouts]
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .slice(0, 5);

    if (playerWorkouts.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h3 className="text-xl font-bold mb-4">📈 Estadísticas de Workouts</h3>
                <p className="text-gray-500 text-center py-8">
                    Aún no has completado ningún workout registrado
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-xl font-bold mb-4">📈 Estadísticas de Workouts</h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-purple-600">{weeklyWorkouts.length}</p>
                    <p className="text-sm text-gray-600">Workouts Semanales</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">{recoveryWorkouts.length}</p>
                    <p className="text-sm text-gray-600">Recuperaciones</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-600">{totalRounds}</p>
                    <p className="text-sm text-gray-600">Rondas Totales</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-orange-600">{avgRounds}</p>
                    <p className="text-sm text-gray-600">Rondas Promedio</p>
                </div>
            </div>

            {/* Historial Reciente */}
            <div>
                <h4 className="font-semibold text-gray-700 mb-3">🕐 Últimos Workouts Completados</h4>
                <div className="space-y-3">
                    {recentWorkouts.map((workout, index) => (
                        <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {workout.type === 'recovery' ? '🔄 Recuperación' : '💪 Workout Semanal'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(workout.completedAt).toLocaleDateString('es-ES', {
                                            weekday: 'short',
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                <div className="text-right">
                                    {workout.type === 'weekly' && workout.rounds > 0 && (
                                        <p className="text-2xl font-bold text-indigo-600">
                                            {workout.rounds}
                                            <span className="text-sm text-gray-500 ml-1">rondas</span>
                                        </p>
                                    )}
                                    {workout.duration && (
                                        <p className="text-xs text-gray-500">
                                            {workout.duration} min
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">Resultado:</span> {workout.result}
                                </p>
                                {workout.exercises && (
                                    <p className="text-xs text-gray-500">
                                        {workout.exercises.length} ejercicios
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WorkoutStats;
// src/components/workout/WeeklyWorkout.jsx
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
    generateWeeklyWorkout,
    selectCurrentWeekWorkout
} from '../../redux/slices/workoutsSlice';
import { getWeekNumber } from '../../utils/dateHelpers';
import { DIFFICULTY } from '../../data/exercises';

function WeeklyWorkout() {
    const dispatch = useDispatch();
    const currentWeekNumber = getWeekNumber(new Date());
    const workout = useSelector(selectCurrentWeekWorkout);
    const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY.INTERMEDIATE);

    useEffect(() => {
        // Generar workout si no existe para esta semana
        if (!workout) {
            handleGenerateWorkout();
        }
    }, [currentWeekNumber]);

    const handleGenerateWorkout = () => {
        dispatch(generateWeeklyWorkout({
            weekNumber: currentWeekNumber,
            duration: 10,
            difficulty: selectedDifficulty
        }));
    };

    if (!workout) {
        return (
            <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h3 className="text-xl font-bold mb-4">💪 Workout de la Semana</h3>
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No hay workout generado para esta semana</p>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Selecciona tu nivel:
                        </label>
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="w-full max-w-xs mx-auto p-2 border border-gray-300 rounded-lg"
                        >
                            <option value={DIFFICULTY.BEGINNER}>Principiante</option>
                            <option value={DIFFICULTY.INTERMEDIATE}>Intermedio</option>
                            <option value={DIFFICULTY.ADVANCED}>Avanzado</option>
                        </select>
                    </div>
                    <button
                        onClick={handleGenerateWorkout}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                    >
                        🎲 Generar Workout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-bold">💪 Workout de la Semana {currentWeekNumber}</h3>
                    <p className="text-gray-600">Foco: <span className="font-semibold text-indigo-600">{workout.focus}</span></p>
                </div>
                <button
                    onClick={handleGenerateWorkout}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-semibold"
                >
                    🔄 Regenerar
                </button>
            </div>

            {/* Info del AMRAP */}
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6">
                <p className="text-sm font-semibold text-indigo-900 mb-1">
                    AMRAP - {workout.duration} minutos
                </p>
                <p className="text-xs text-indigo-700">
                    Completa tantas rondas como puedas en {workout.duration} minutos
                </p>
            </div>

            {/* Lista de Ejercicios */}
            <div className="space-y-3">
                {workout.exercises.map((exercise, index) => (
                    <div
                        key={exercise.id}
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                            {index + 1}
                        </div>

                        <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-gray-900">{exercise.name}</h4>
                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {exercise.difficulty}
                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>

                            <div className="flex items-center gap-2 flex-wrap">
                                {exercise.muscleGroups.map((muscle, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded"
                                    >
                    {muscle}
                  </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex-shrink-0 text-right ml-4">
                            <p className="text-2xl font-bold text-indigo-600">
                                {exercise.defaultReps}
                            </p>
                            <p className="text-xs text-gray-500">
                                {exercise.repsType === 'time' ? 'seg' : 'reps'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Instrucciones */}
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">📋 Instrucciones</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Realiza cada ejercicio en orden</li>
                    <li>• Al terminar el último, vuelve al primero</li>
                    <li>• Completa tantas rondas como puedas en {workout.duration} minutos</li>
                    <li>• Descansa cuando lo necesites, pero intenta mantener el ritmo</li>
                </ul>
            </div>
        </div>
    );
}

export default WeeklyWorkout;
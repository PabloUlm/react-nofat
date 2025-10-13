import { useSelector } from 'react-redux';
import { selectPlayerSessions } from '../../redux/slices/sessionsSlice';
import { getWeekNumber, getUniqueDaysInWeek } from '../../utils/dateHelpers';

function WeeklyProgress({ playerId }) {
    const sessions = useSelector((state) => selectPlayerSessions(state, playerId));
    const currentWeek = getWeekNumber(new Date());
    const uniqueDays = getUniqueDaysInWeek(sessions, currentWeek);

    const getProgressColor = () => {
        if (uniqueDays === 0) return 'bg-gray-200';
        if (uniqueDays === 1) return 'bg-red-400';
        if (uniqueDays === 2) return 'bg-yellow-400';
        return 'bg-green-400';
    };

    const getProgressText = () => {
        if (uniqueDays === 0) return 'No has empezado esta semana';
        if (uniqueDays === 1) return '¡Sigue así! Te faltan 2 días más';
        if (uniqueDays === 2) return '¡Casi! Solo falta 1 día más';
        return '¡Semana completada! 🎉';
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-xl font-bold mb-4">📅 Progreso Semanal</h3>

            <div className="mb-4">
                <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {uniqueDays} / 3 días completados
          </span>
                    <span className="text-sm font-medium text-gray-700">
            {Math.round((uniqueDays / 3) * 100)}%
          </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className={`h-4 rounded-full transition-all duration-500 ${getProgressColor()}`}
                        style={{ width: `${(uniqueDays / 3) * 100}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{getProgressText()}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((day) => (
                    <div
                        key={day}
                        className={`p-4 rounded-lg text-center ${
                            day <= uniqueDays
                                ? 'bg-green-100 border-2 border-green-500'
                                : 'bg-gray-100 border-2 border-gray-300'
                        }`}
                    >
                        <p className="text-2xl mb-1">
                            {day <= uniqueDays ? '✅' : '⬜'}
                        </p>
                        <p className="text-sm font-semibold">
                            Día {day}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WeeklyProgress;

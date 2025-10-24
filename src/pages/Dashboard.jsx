// src/pages/Dashboard.jsx
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../redux/slices/authSlice';
import { selectPlayerById } from '../redux/slices/playersSlice';
import { selectPlayerSessions } from '../redux/slices/sessionsSlice';
import { selectCurrentWeekWorkout } from '../redux/slices/workoutsSlice';
import WeeklyProgress from '../components/session/WeeklyProgress';
import WarningBadge from '../components/player/WarningBadge';
import WeeklyWorkout from '../components/workout/WeeklyWorkout';
import MonthlyBalance from '../components/workout/MonthlyBalance';
import { getWeekNumber } from '../utils/dateHelpers';

function Dashboard() {
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
    const player = useSelector((state) => selectPlayerById(state, currentUser.id));
    const sessions = useSelector((state) => selectPlayerSessions(state, currentUser.id));
    const currentWeekWorkout = useSelector(selectCurrentWeekWorkout);
    const currentWeek = getWeekNumber(new Date());

    const handleStartWorkout = () => {
        if (!currentWeekWorkout) {
            alert('⚠️ Necesitas generar un workout semanal primero');
            return;
        }
        navigate('/workout-session');
    };

    return (
        <div className="px-4 py-6 sm:px-0">
            {/* Header con Stats */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img
                            src={player.photo}
                            alt={player.name}
                            className="w-20 h-20 rounded-full border-4 border-indigo-500"
                        />
                        <div className="ml-4">
                            <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>
                            <p className="text-gray-600">Semana {currentWeek}</p>
                        </div>
                    </div>
                    <WarningBadge warnings={player.warnings} />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-indigo-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-indigo-600">{player.totalSessions}</p>
                        <p className="text-sm text-gray-600">Sesiones Totales</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-green-600">{player.streak}</p>
                        <p className="text-sm text-gray-600">Semanas Consecutivas</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-red-600">{player.warnings}</p>
                        <p className="text-sm text-gray-600">Amonestaciones</p>
                    </div>
                </div>
            </div>

            {/* Workout de la Semana */}
            <WeeklyWorkout />

            {/* NUEVO: Botón Realizar Sesión */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 mt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            💪 ¿Listo para entrenar?
                        </h3>
                        <p className="text-green-100">
                            {currentWeekWorkout
                                ? `Workout: ${currentWeekWorkout.focus} - ${currentWeekWorkout.duration} min`
                                : 'Genera un workout primero'}
                        </p>
                    </div>
                    <button
                        onClick={handleStartWorkout}
                        disabled={!currentWeekWorkout}
                        className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        🚀 Realizar Sesión
                    </button>
                </div>
            </div>

            {/* Progreso Semanal */}
            <WeeklyProgress playerId={currentUser.id} />

            {/* Balance Mensual */}
            <MonthlyBalance />

            {/* Últimas Sesiones */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h3 className="text-xl font-bold mb-4">📋 Últimas Sesiones</h3>
                {sessions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                        Aún no has registrado ninguna sesión
                    </p>
                ) : (
                    <div className="space-y-4">
                        {sessions
                            .slice()
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .slice(0, 5)
                            .map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between border-b pb-4"
                                >
                                    <div className="flex items-center">
                                        {session.photo && (
                                            <img
                                                src={session.photo}
                                                alt="Session"
                                                className="w-16 h-16 object-cover rounded-lg mr-4"
                                            />
                                        )}
                                        <div>
                                            <p className="font-semibold">
                                                {session.isRecovery ? '🔄 Recuperación' : '💪 Sesión'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(session.date).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-indigo-600">{session.result}</p>
                                        <p className="text-xs text-gray-500">Resultado</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
// src/pages/Dashboard.jsx
import { useState } from 'react';
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
import InstallRequiredModal from '../components/workout/InstallRequiredModal';
import { getWeekNumber } from '../utils/dateHelpers';
import { isPWA } from '../utils/pwaHelpers';

function Dashboard() {
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
    const player = useSelector((state) => selectPlayerById(state, currentUser.id));
    const sessions = useSelector((state) => selectPlayerSessions(state, currentUser.id));
    const currentWeekWorkout = useSelector(selectCurrentWeekWorkout);
    const currentWeek = getWeekNumber(new Date());

    // Estado para modal de instalación requerida (OPCIÓN B)
    const [showInstallModal, setShowInstallModal] = useState(false);

    const handleStartWorkout = () => {
        // OPCIÓN B - ACCESO LIMITADO: Verificar si está instalada como PWA
        if (!isPWA()) {
            console.log('❌ No es PWA - Bloqueando workout');
            setShowInstallModal(true);
            return;
        }

        if (!currentWeekWorkout) {
            alert('⚠️ Necesitas generar un workout semanal primero');
            return;
        }

        console.log('✅ Es PWA - Iniciando workout');
        navigate('/workout-session');
    };

    return (
        <div className="px-4 py-6 sm:px-0">
            {/* Header con Stats - Optimizado para móvil */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
                {/* Perfil y Warning - Stack en móvil, horizontal en desktop */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center">
                        <img
                            src={player.photo}
                            alt={player.name}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-indigo-500"
                        />
                        <div className="ml-3 md:ml-4">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{player.name}</h2>
                            <p className="text-sm md:text-base text-gray-600">Semana {currentWeek}</p>
                        </div>
                    </div>
                    <WarningBadge warnings={player.warnings} />
                </div>

                {/* Stats Grid - 2 columnas en móvil, 3 en tablet+ */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
                    <div className="bg-indigo-50 p-3 md:p-4 rounded-lg text-center">
                        <p className="text-2xl md:text-3xl font-bold text-indigo-600">{player.totalSessions}</p>
                        <p className="text-xs md:text-sm text-gray-600">Sesiones Totales</p>
                    </div>
                    <div className="bg-green-50 p-3 md:p-4 rounded-lg text-center">
                        <p className="text-2xl md:text-3xl font-bold text-green-600">{player.streak}</p>
                        <p className="text-xs md:text-sm text-gray-600">Semanas Consecutivas</p>
                    </div>
                    <div className="bg-red-50 p-3 md:p-4 rounded-lg text-center col-span-2 md:col-span-1">
                        <p className="text-2xl md:text-3xl font-bold text-red-600">{player.warnings}</p>
                        <p className="text-xs md:text-sm text-gray-600">Amonestaciones</p>
                    </div>
                </div>
            </div>

            {/* Workout de la Semana */}
            <WeeklyWorkout />

            {/* Botón Realizar Sesión - Stack en móvil */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-4 md:p-6 mt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                            💪 ¿Listo para entrenar?
                        </h3>
                        <p className="text-sm md:text-base text-green-100">
                            {currentWeekWorkout
                                ? `Workout: ${currentWeekWorkout.focus} - ${currentWeekWorkout.duration} min`
                                : 'Genera un workout primero'}
                        </p>
                    </div>
                    <button
                        onClick={handleStartWorkout}
                        disabled={!currentWeekWorkout}
                        className="w-full md:w-auto bg-white text-green-600 px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-green-50 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        🚀 Realizar Sesión
                    </button>
                </div>
            </div>

            {/* Progreso Semanal */}
            <WeeklyProgress playerId={currentUser.id} />

            {/* Balance Mensual */}
            <MonthlyBalance />

            {/* Últimas Sesiones - Optimizado para móvil */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6 mt-6">
                <h3 className="text-lg md:text-xl font-bold mb-4">📋 Últimas Sesiones</h3>
                {sessions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 text-sm md:text-base">
                        Aún no has registrado ninguna sesión
                    </p>
                ) : (
                    <div className="space-y-3 md:space-y-4">
                        {sessions
                            .slice()
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .slice(0, 5)
                            .map((session) => (
                                <div
                                    key={session.id}
                                    className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-3 md:pb-4 gap-3 md:gap-0"
                                >
                                    <div className="flex items-center">
                                        {session.photo && (
                                            <img
                                                src={session.photo}
                                                alt="Session"
                                                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg mr-3 md:mr-4 flex-shrink-0"
                                            />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-sm md:text-base truncate">
                                                {session.isRecovery ? '🔄 Recuperación' : '💪 Sesión'}
                                            </p>
                                            <p className="text-xs md:text-sm text-gray-600">
                                                {new Date(session.date).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right ml-auto md:ml-0">
                                        <p className="font-bold text-indigo-600 text-sm md:text-base">{session.result}</p>
                                        <p className="text-xs text-gray-500">Resultado</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {/* Modal de Instalación Requerida (OPCIÓN B) */}
            {showInstallModal && (
                <InstallRequiredModal onClose={() => setShowInstallModal(false)} />
            )}
        </div>
    );
}

export default Dashboard;
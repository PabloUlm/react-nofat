import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/authSlice';
import { selectPlayerById } from '../redux/slices/playersSlice';
import { selectPlayerSessions } from '../redux/slices/sessionsSlice';
import { uploadSession } from '../redux/slices/sessionsSlice';
import { removeWarning } from '../redux/slices/playersSlice';
import { checkWeeklyCompliance } from '../redux/thunks/checkWeeklyCompliance';
import { useState } from 'react';

function Profile() {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const player = useSelector((state) => selectPlayerById(state, currentUser.id));
    const sessions = useSelector((state) => selectPlayerSessions(state, currentUser.id));
    const [showRecovery, setShowRecovery] = useState(false);

    const handleRecoveryWorkout = () => {
        const result = dispatch(
            uploadSession({
                playerId: currentUser.id,
                photo: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect width="300" height="300" fill="%234F46E5"/%3E%3Ctext x="50%25" y="50%25" font-size="80" text-anchor="middle" dy=".3em" fill="white"%3E💪%3C/text%3E%3C/svg%3E',
                result: 'Ejercicio de Recuperación',
                date: new Date().toISOString(),
                isRecovery: true,
            })
        );

        if (result.success) {
            dispatch(removeWarning(currentUser.id));
            setShowRecovery(false);
            alert('✅ ¡Ejercicio de recuperación completado! Se ha eliminado una amonestación.');
        }
    };

    const handleWeeklyCheck = () => {
        const results = dispatch(checkWeeklyCompliance());

        const message = `
📊 Verificación Semanal Completada

✅ Jugadores OK: ${results.compliant}
⚠️ Amonestaciones: ${results.warnings}
👥 Total verificados: ${results.checked}

Detalles en consola del navegador
        `.trim();

        alert(message);
    };

    return (
        <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-6">
                    <img
                        src={player.photo}
                        alt={player.name}
                        className="w-24 h-24 rounded-full border-4 border-indigo-500"
                    />
                    <div className="ml-6">
                        <h2 className="text-3xl font-bold text-gray-900">{player.name}</h2>
                        <p className="text-gray-600">{player.email}</p>
                    </div>
                </div>

                {/* Estadísticas Detalladas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-indigo-600">{player.totalSessions}</p>
                        <p className="text-sm text-gray-600">Sesiones Totales</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{player.streak}</p>
                        <p className="text-sm text-gray-600">Racha (semanas)</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{player.warnings}</p>
                        <p className="text-sm text-gray-600">Amonestaciones</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">
                            {sessions.filter((s) => s.isRecovery).length}
                        </p>
                        <p className="text-sm text-gray-600">Recuperaciones</p>
                    </div>
                </div>

                {/* Ejercicio de Recuperación */}
                {player.warnings > 0 && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-800">
                                    ⚠️ Tienes {player.warnings} amonestación(es)
                                </h3>
                                <p className="text-sm text-yellow-700 mt-1">
                                    Completa un ejercicio de recuperación para eliminar una amonestación
                                </p>
                            </div>
                            <button
                                onClick={() => setShowRecovery(true)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 font-semibold"
                            >
                                Hacer Recuperación
                            </button>
                        </div>
                    </div>
                )}

                {/* VERIFICACIÓN SEMANAL - Mejorado */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">
                                🔍 Verificación Semanal
                            </h3>
                            <p className="text-sm text-blue-700">
                                Verifica si todos completaron 3 días la semana pasada y asigna amonestaciones
                            </p>
                        </div>
                        <button
                            onClick={handleWeeklyCheck}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold transition-colors"
                        >
                            ▶️ Ejecutar Ahora
                        </button>
                    </div>
                    <div className="mt-3 bg-blue-100 rounded p-3">
                        <p className="text-xs text-blue-800">
                            <strong>Nota:</strong> En producción, esto se ejecutará automáticamente cada lunes mediante un cron job en el servidor.
                        </p>
                    </div>
                </div>

                {/* Modal de Recuperación */}
                {showRecovery && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-2xl font-bold mb-4">🔄 Ejercicio de Recuperación</h3>
                            <p className="text-gray-600 mb-6">
                                Al completar este ejercicio eliminarás una amonestación. ¿Estás seguro de que
                                has realizado el ejercicio?
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleRecoveryWorkout}
                                    className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
                                >
                                    Sí, completado
                                </button>
                                <button
                                    onClick={() => setShowRecovery(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Historial */}
                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4">📊 Historial Completo</h3>
                    <div className="space-y-2">
                        {sessions.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No hay sesiones registradas</p>
                        ) : (
                            sessions
                                .slice()
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                .map((session) => (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-semibold">
                                                {session.isRecovery ? '🔄 Recuperación' : '💪 Sesión Regular'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(session.date).toLocaleDateString('es-ES', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <p className="font-bold text-indigo-600">{session.result}</p>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
// src/components/workout/ProgressModal.jsx
import { useSelector } from 'react-redux';
import { selectMuscleGroupRankings } from '../../redux/slices/workoutsSlice';
import { selectPlayerById } from '../../redux/slices/playersSlice';

function ProgressModal({ rankingsBefore, playerId, onClose }) {
    // Rankings DESPUÉS de registrar la sesión
    const rankingsAfter = useSelector(selectMuscleGroupRankings);
    const player = useSelector(state => selectPlayerById(state, playerId));

    // Calcular cambios en rankings
    const changes = calculateRankingChanges(rankingsBefore, rankingsAfter, playerId);

    // Contar mejoras
    const improvements = changes.filter(c => c.rankImproved || c.pointsGained > 0);
    const rankUps = changes.filter(c => c.rankImproved).length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white">
                    <div className="text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-3xl font-bold mb-2">¡Sesión Registrada!</h2>
                        <p className="text-green-100">
                            Excelente trabajo, {player?.name} 💪
                        </p>
                    </div>
                </div>

                {/* Resumen de progreso */}
                <div className="p-8">
                    {improvements.length > 0 ? (
                        <>
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                                <p className="text-yellow-800 font-semibold text-lg">
                                    🎉 ¡Has mejorado en {improvements.length} {improvements.length === 1 ? 'grupo muscular' : 'grupos musculares'}!
                                </p>
                                {rankUps > 0 && (
                                    <p className="text-yellow-700 text-sm mt-1">
                                        {rankUps === 1 ? 'Has subido' : `Has subido en ${rankUps}`} posiciones en el ranking
                                    </p>
                                )}
                            </div>

                            {/* Lista de cambios */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    📊 Detalle de tu Progreso:
                                </h3>

                                {changes.map((change, index) => {
                                    if (change.pointsGained === 0) return null;

                                    return (
                                        <div
                                            key={change.muscle}
                                            className={`p-4 rounded-lg border-2 ${
                                                change.rankImproved
                                                    ? 'bg-green-50 border-green-500'
                                                    : 'bg-blue-50 border-blue-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {/* Emoji del músculo */}
                                                    <span className="text-3xl">{getMuscleEmoji(change.muscle)}</span>

                                                    <div>
                                                        <p className="font-bold text-gray-900 capitalize">
                                                            {change.muscle}
                                                        </p>

                                                        {/* Cambio de ranking */}
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {change.oldRank && change.newRank ? (
                                                                <>
                                  <span className="text-sm text-gray-600">
                                    Ranking: #{change.oldRank}
                                  </span>
                                                                    {change.rankImproved ? (
                                                                        <>
                                                                            <span className="text-green-600 font-bold">→</span>
                                                                            <span className="text-sm font-bold text-green-600">
                                        #{change.newRank} ⬆️
                                      </span>
                                                                        </>
                                                                    ) : change.oldRank === change.newRank ? (
                                                                        <>
                                                                            <span className="text-blue-600">→</span>
                                                                            <span className="text-sm text-blue-600">
                                        #{change.newRank} (mantiene)
                                      </span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <span className="text-gray-400">→</span>
                                                                            <span className="text-sm text-gray-600">
                                        #{change.newRank}
                                      </span>
                                                                        </>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-sm text-blue-600">
                                  {change.newRank ? `Ranking: #${change.newRank}` : 'Primera vez'}
                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Puntos ganados */}
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-indigo-600">
                                                        +{change.pointsGained.toFixed(1)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">puntos</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600 text-lg">
                                Sesión registrada correctamente. ¡Sigue entrenando para ver mejoras en los rankings! 💪
                            </p>
                        </div>
                    )}

                    {/* Botón continuar */}
                    <button
                        onClick={onClose}
                        className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                    >
                        🏠 Volver al Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

// Función helper para calcular cambios
function calculateRankingChanges(before, after, playerId) {
    const changes = [];

    Object.keys(after).forEach(muscle => {
        const beforeRanking = before[muscle] || [];
        const afterRanking = after[muscle] || [];

        // Encontrar posiciones
        const oldRank = beforeRanking.findIndex(p => p.playerId === playerId);
        const newRank = afterRanking.findIndex(p => p.playerId === playerId);

        // Encontrar puntos
        const oldPoints = beforeRanking.find(p => p.playerId === playerId)?.points || 0;
        const newPoints = afterRanking.find(p => p.playerId === playerId)?.points || 0;

        const pointsGained = newPoints - oldPoints;

        // Solo incluir si ganó puntos
        if (pointsGained > 0) {
            changes.push({
                muscle,
                oldRank: oldRank >= 0 ? oldRank + 1 : null, // +1 porque el index empieza en 0
                newRank: newRank >= 0 ? newRank + 1 : null,
                rankImproved: oldRank >= 0 && newRank >= 0 && newRank < oldRank,
                oldPoints,
                newPoints,
                pointsGained
            });
        }
    });

    // Ordenar por puntos ganados (mayor primero)
    return changes.sort((a, b) => b.pointsGained - a.pointsGained);
}

// Función helper para emojis
function getMuscleEmoji(muscle) {
    const emojis = {
        pecho: '💪',
        espalda: '🦾',
        hombros: '🤸',
        biceps: '💪',
        triceps: '💪',
        core: '🔥',
        gluteos: '🍑',
        cuadriceps: '🦵',
        isquios: '🦵',
        gemelos: '👟',
        cardio: '❤️'
    };
    return emojis[muscle] || '💪';
}

export default ProgressModal;
// src/components/rankings/MuscleRankings.jsx
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { selectMuscleGroupRankings, selectPlayerBadges } from '../../redux/slices/workoutsSlice';
import { MUSCLE_GROUPS } from '../../data/exercises';

function MuscleRankings() {
    const rankings = useSelector(selectMuscleGroupRankings);
    const [selectedMuscle, setSelectedMuscle] = useState(null);
    const [expandedPlayer, setExpandedPlayer] = useState(null);

    // Emojis por grupo muscular
    const muscleEmojis = {
        [MUSCLE_GROUPS.CHEST]: '💪',
        [MUSCLE_GROUPS.BACK]: '🦾',
        [MUSCLE_GROUPS.SHOULDERS]: '🤸',
        [MUSCLE_GROUPS.BICEPS]: '💪',
        [MUSCLE_GROUPS.TRICEPS]: '💪',
        [MUSCLE_GROUPS.CORE]: '🔥',
        [MUSCLE_GROUPS.GLUTES]: '🍑',
        [MUSCLE_GROUPS.QUADS]: '🦵',
        [MUSCLE_GROUPS.HAMSTRINGS]: '🦵',
        [MUSCLE_GROUPS.CALVES]: '👟',
        [MUSCLE_GROUPS.CARDIO]: '❤️'
    };

    const getBadgeTier = (tier) => {
        const tiers = {
            legendary: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
            epic: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
            rare: 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white',
            common: 'bg-gray-200 text-gray-700'
        };
        return tiers[tier] || tiers.common;
    };

    if (Object.keys(rankings).every(key => rankings[key].length === 0)) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-3xl font-bold mb-4">🏆 Rankings por Grupo Muscular</h2>
                <p className="text-center text-gray-500 py-12">
                    Aún no hay suficientes datos para generar rankings.
                    <br />
                    ¡Completa workouts para empezar a competir!
                </p>
            </div>
        );
    }

    // Vista de detalle de un grupo muscular
    if (selectedMuscle) {
        const muscleRanking = rankings[selectedMuscle] || [];

        return (
            <div className="bg-white rounded-lg shadow p-6">
                <button
                    onClick={() => setSelectedMuscle(null)}
                    className="text-indigo-600 hover:text-indigo-800 mb-4 font-semibold"
                >
                    ← Volver a todos los rankings
                </button>

                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2">
                        {muscleEmojis[selectedMuscle]} Rey de {selectedMuscle}
                    </h2>
                    <p className="text-gray-600">
                        Sistema de puntos: Principiante ×1, Intermedio ×1.5, Avanzado ×2
                    </p>
                </div>

                <div className="space-y-4">
                    {muscleRanking.map((player, index) => {
                        const badges = useSelector(state => selectPlayerBadges(state, player.playerId));
                        const isExpanded = expandedPlayer === player.playerId;

                        return (
                            <div
                                key={player.playerId}
                                className={`border rounded-lg overflow-hidden ${
                                    index === 0 ? 'border-yellow-400 bg-yellow-50' :
                                        index === 1 ? 'border-gray-400 bg-gray-50' :
                                            index === 2 ? 'border-orange-400 bg-orange-50' :
                                                'border-gray-200'
                                }`}
                            >
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Posición */}
                                            <div className="text-3xl font-bold">
                                                {index === 0 && '🥇'}
                                                {index === 1 && '🥈'}
                                                {index === 2 && '🥉'}
                                                {index > 2 && <span className="text-gray-500">#{index + 1}</span>}
                                            </div>

                                            {/* Foto y nombre */}
                                            <img
                                                src={player.playerPhoto}
                                                alt={player.playerName}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div>
                                                <p className="font-bold text-lg">{player.playerName}</p>

                                                {/* Badges */}
                                                {badges.length > 0 && (
                                                    <div className="flex gap-1 mt-1">
                                                        {badges.map(badge => (
                                                            <span
                                                                key={badge.id}
                                                                className={`text-xs px-2 py-0.5 rounded ${getBadgeTier(badge.tier)}`}
                                                                title={badge.description}
                                                            >
                                {badge.name}
                              </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Puntos */}
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-indigo-600">
                                                {player.points}
                                            </p>
                                            <p className="text-sm text-gray-500">puntos</p>
                                        </div>
                                    </div>

                                    {/* Botón de desglose */}
                                    <button
                                        onClick={() => setExpandedPlayer(isExpanded ? null : player.playerId)}
                                        className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        {isExpanded ? '▲ Ocultar desglose' : '▼ Ver desglose detallado'}
                                    </button>

                                    {/* Desglose detallado */}
                                    {isExpanded && (
                                        <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                                            <p className="text-sm font-semibold text-gray-700 mb-2">
                                                📊 Desglose de puntos:
                                            </p>
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {player.breakdown
                                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                                    .map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="text-xs p-2 bg-gray-50 rounded flex justify-between"
                                                        >
                                                            <div>
                                                                <span className="font-medium">{item.exercise}</span>
                                                                <span className="text-gray-500 ml-2">
                                  ({item.difficulty})
                                </span>
                                                                <span className="text-gray-400 ml-2">
                                  {new Date(item.date).toLocaleDateString('es-ES', {
                                      day: 'numeric',
                                      month: 'short'
                                  })}
                                </span>
                                                            </div>
                                                            <div className="font-semibold">
                                                                {item.reps} reps × {item.points / item.reps} = {item.points.toFixed(1)} pts
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Vista general de todos los grupos musculares
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">🏆 Rankings por Grupo Muscular</h2>
                <p className="text-gray-600">
                    Haz click en cualquier grupo para ver el ranking completo
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(rankings).map(([muscleGroup, players]) => {
                    if (players.length === 0) return null;

                    const king = players[0];

                    return (
                        <button
                            key={muscleGroup}
                            onClick={() => setSelectedMuscle(muscleGroup)}
                            className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-bold capitalize">
                                    {muscleEmojis[muscleGroup]} {muscleGroup}
                                </h3>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {players.length} competidores
                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-2xl">👑</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <img
                                            src={king.playerPhoto}
                                            alt={king.playerName}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <p className="font-semibold text-sm">{king.playerName}</p>
                                    </div>
                                    <p className="text-xl font-bold text-indigo-600">
                                        {king.points} pts
                                    </p>
                                </div>
                            </div>

                            {/* Top 3 mini preview */}
                            {players.length > 1 && (
                                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
                                    {players.slice(1, 3).map((p, idx) => (
                                        <div key={p.playerId} className="flex justify-between">
                                            <span>{idx === 0 ? '🥈' : '🥉'} {p.playerName}</span>
                                            <span className="font-semibold">{p.points} pts</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default MuscleRankings;
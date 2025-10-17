// src/pages/RankingsPage.jsx (reemplaza LeaderboardPage.jsx)
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { selectLeaderboard } from '../redux/slices/playersSlice';
import { selectPlayerBadges } from '../redux/slices/workoutsSlice';
import WarningBadge from '../components/player/WarningBadge';
import MuscleRankings from '../components/rankings/MuscleRankings';

function RankingsPage() {
    const leaderboard = useSelector(selectLeaderboard);
    const [activeTab, setActiveTab] = useState('general'); // 'general' | 'muscles'

    return (
        <div className="px-4 py-6 sm:px-0">
            {/* Tabs */}
            <div className="bg-white rounded-t-lg shadow overflow-hidden">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                            activeTab === 'general'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        🏅 Clasificación General
                    </button>
                    <button
                        onClick={() => setActiveTab('muscles')}
                        className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                            activeTab === 'muscles'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        👑 Reyes Musculares
                    </button>
                </div>
            </div>

            {/* Contenido */}
            {activeTab === 'general' ? (
                <GeneralLeaderboard leaderboard={leaderboard} />
            ) : (
                <MuscleRankings />
            )}
        </div>
    );
}

function GeneralLeaderboard({ leaderboard }) {
    return (
        <div className="bg-white rounded-b-lg shadow overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <h2 className="text-3xl font-bold text-white">🏆 Clasificación General</h2>
                <p className="text-indigo-100 mt-2">Los mejores atletas según sesiones completadas</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Posición
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Jugador
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Sesiones
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Racha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Badges
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Estado
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboard.map((player, index) => {
                        const badges = useSelector(state => selectPlayerBadges(state, player.id));

                        return (
                            <tr
                                key={player.id}
                                className={index < 3 ? 'bg-yellow-50' : 'hover:bg-gray-50'}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {index === 0 && <span className="text-2xl">🥇</span>}
                                        {index === 1 && <span className="text-2xl">🥈</span>}
                                        {index === 2 && <span className="text-2xl">🥉</span>}
                                        {index > 2 && (
                                            <span className="text-lg font-semibold text-gray-600">
                                                    {index + 1}
                                                </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img
                                            src={player.photo}
                                            alt={player.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {player.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-indigo-600">
                                        {player.totalSessions}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                            <span className="text-sm font-semibold text-green-600">
                                                {player.streak} 🔥
                                            </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {badges.length > 0 ? (
                                            badges.map(badge => (
                                                <span
                                                    key={badge.id}
                                                    className="text-xs"
                                                    title={badge.description}
                                                >
                                                        {badge.name.split(' ')[0]}
                                                    </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400">-</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <WarningBadge warnings={player.warnings} compact />
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RankingsPage;
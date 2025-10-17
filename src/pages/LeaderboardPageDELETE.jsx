import { useSelector } from 'react-redux';
import { selectLeaderboard } from '../redux/slices/playersSlice';
import WarningBadge from '../components/player/WarningBadge';

function LeaderboardPage() {
    const leaderboard = useSelector(selectLeaderboard);

    return (
        <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                    <h2 className="text-3xl font-bold text-white">🏆 Clasificación Global</h2>
                    <p className="text-indigo-100 mt-2">Los mejores atletas de la semana</p>
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
                                Estado
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {leaderboard.map((player, index) => (
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
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <WarningBadge warnings={player.warnings} compact />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default LeaderboardPage;
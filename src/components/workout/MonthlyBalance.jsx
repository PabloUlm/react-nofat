// src/components/workout/MonthlyBalance.jsx
import { useSelector } from 'react-redux';
import { selectMonthlyBalance, selectMonthlyDistribution } from '../../redux/slices/workoutsSlice';

function MonthlyBalance() {
    const actualBalance = useSelector(selectMonthlyBalance);
    const targetDistribution = useSelector(selectMonthlyDistribution);

    // Calcular total de ejercicios
    const totalExercises = Object.values(actualBalance).reduce((sum, count) => sum + count, 0);

    // Calcular porcentajes actuales
    const actualPercentages = {};
    Object.keys(actualBalance).forEach(muscle => {
        actualPercentages[muscle] = totalExercises > 0
            ? Math.round((actualBalance[muscle] / totalExercises) * 100)
            : 0;
    });

    // Ordenar por diferencia (más deficientes primero)
    const muscleGroups = Object.keys(actualBalance).sort((a, b) => {
        const diffA = targetDistribution[a] - actualPercentages[a];
        const diffB = targetDistribution[b] - actualPercentages[b];
        return diffB - diffA;
    });

    const getStatusColor = (actual, target) => {
        const diff = actual - target;
        if (Math.abs(diff) <= 3) return 'bg-green-100 text-green-800';
        if (diff < 0) return 'bg-red-100 text-red-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    const getBarColor = (actual, target) => {
        const diff = actual - target;
        if (Math.abs(diff) <= 3) return 'bg-green-500';
        if (diff < 0) return 'bg-red-500';
        return 'bg-yellow-500';
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-2xl font-bold mb-4">📊 Balance Muscular del Mes</h3>

            {totalExercises === 0 ? (
                <p className="text-center text-gray-500 py-8">
                    Aún no hay datos suficientes para analizar el balance mensual
                </p>
            ) : (
                <>
                    <div className="mb-6 text-center">
                        <p className="text-3xl font-bold text-indigo-600">{totalExercises}</p>
                        <p className="text-sm text-gray-600">ejercicios completados este mes</p>
                    </div>

                    <div className="space-y-4">
                        {muscleGroups.map((muscle) => {
                            const actual = actualPercentages[muscle];
                            const target = targetDistribution[muscle];
                            const diff = actual - target;
                            const count = actualBalance[muscle];

                            return (
                                <div key={muscle} className="border-b pb-4 last:border-b-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900 capitalize">
                        {muscle}
                      </span>
                                            <span className="text-sm text-gray-500">
                        ({count} ejercicios)
                      </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {actual}% / {target}%
                      </span>
                                            <span className={`text-xs px-2 py-1 rounded font-semibold ${getStatusColor(actual, target)}`}>
                        {diff > 0 ? '+' : ''}{diff}%
                      </span>
                                        </div>
                                    </div>

                                    {/* Barra de progreso */}
                                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                                        {/* Barra objetivo (gris más oscuro) */}
                                        <div
                                            className="absolute h-full bg-gray-400 opacity-30"
                                            style={{ width: `${target}%` }}
                                        />
                                        {/* Barra actual */}
                                        <div
                                            className={`absolute h-full transition-all duration-500 ${getBarColor(actual, target)}`}
                                            style={{ width: `${actual}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Leyenda */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700 mb-2">📖 Leyenda:</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span>Equilibrado (±3%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded"></div>
                                <span>Falta trabajar</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                <span>Sobre-trabajado</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default MonthlyBalance;
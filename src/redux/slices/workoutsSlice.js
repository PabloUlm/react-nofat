// src/redux/slices/workoutsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { EXERCISES, MUSCLE_GROUPS, DIFFICULTY } from '../../data/exercises';
import { getWeekNumber } from '../../utils/dateHelpers';

/**
 * Configuración de distribución mensual de grupos musculares
 * Puedes ajustar estos porcentajes según tus objetivos
 */
const MONTHLY_DISTRIBUTION = {
    [MUSCLE_GROUPS.CHEST]: 10,
    [MUSCLE_GROUPS.BACK]: 15,
    [MUSCLE_GROUPS.SHOULDERS]: 10,
    [MUSCLE_GROUPS.BICEPS]: 5,
    [MUSCLE_GROUPS.TRICEPS]: 5,
    [MUSCLE_GROUPS.CORE]: 20,
    [MUSCLE_GROUPS.GLUTES]: 15,
    [MUSCLE_GROUPS.QUADS]: 10,
    [MUSCLE_GROUPS.HAMSTRINGS]: 5,
    [MUSCLE_GROUPS.CALVES]: 2,
    [MUSCLE_GROUPS.CARDIO]: 3
};

/**
 * Focos semanales rotativos (se repite cada 4 semanas)
 */
const WEEKLY_FOCUS_CYCLE = [
    {
        name: 'Tren Inferior',
        primaryMuscles: [MUSCLE_GROUPS.QUADS, MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.HAMSTRINGS],
        secondaryMuscles: [MUSCLE_GROUPS.CORE, MUSCLE_GROUPS.CARDIO],
        distribution: { primary: 60, secondary: 40 }
    },
    {
        name: 'Core y Cardio',
        primaryMuscles: [MUSCLE_GROUPS.CORE, MUSCLE_GROUPS.CARDIO],
        secondaryMuscles: [MUSCLE_GROUPS.QUADS, MUSCLE_GROUPS.GLUTES],
        distribution: { primary: 70, secondary: 30 }
    },
    {
        name: 'Tren Superior - Push',
        primaryMuscles: [MUSCLE_GROUPS.CHEST, MUSCLE_GROUPS.SHOULDERS, MUSCLE_GROUPS.TRICEPS],
        secondaryMuscles: [MUSCLE_GROUPS.CORE, MUSCLE_GROUPS.CARDIO],
        distribution: { primary: 65, secondary: 35 }
    },
    {
        name: 'Tren Superior - Pull',
        primaryMuscles: [MUSCLE_GROUPS.BACK, MUSCLE_GROUPS.BICEPS],
        secondaryMuscles: [MUSCLE_GROUPS.CORE, MUSCLE_GROUPS.GLUTES],
        distribution: { primary: 60, secondary: 40 }
    }
];

const initialState = {
    // Workouts generados por semana
    byWeek: {},
    // Configuración de distribución mensual personalizada
    monthlyDistribution: MONTHLY_DISTRIBUTION,
    // Historial de workouts completados
    completedWorkouts: [],
};

const workoutsSlice = createSlice({
    name: 'workouts',
    initialState,
    reducers: {
        generateWeeklyWorkout: (state, action) => {
            const { weekNumber, duration = 10, difficulty } = action.payload;

            // Determinar foco de la semana según ciclo
            const focusIndex = (weekNumber - 1) % 4;
            const weeklyFocus = WEEKLY_FOCUS_CYCLE[focusIndex];

            // Generar workout basado en el foco
            const workout = generateWorkout(weeklyFocus, duration, difficulty);

            state.byWeek[weekNumber] = {
                weekNumber,
                focus: weeklyFocus.name,
                duration,
                exercises: workout,
                generatedAt: new Date().toISOString(),
            };
        },

        generateRecoveryWorkout: (state, action) => {
            const { duration = 20, playerId } = action.payload;

            // Workout de recuperación: bajo impacto, más duración
            const recoveryExercises = EXERCISES.filter(ex =>
                ex.difficulty === 'principiante' &&
                (ex.muscleGroups.includes(MUSCLE_GROUPS.CORE) ||
                    ex.muscleGroups.includes(MUSCLE_GROUPS.GLUTES))
            );

            const workout = recoveryExercises
                .sort(() => 0.5 - Math.random())
                .slice(0, 6);

            state.completedWorkouts.push({
                type: 'recovery',
                duration,
                exercises: workout,
                playerId,
                completedAt: new Date().toISOString(),
            });
        },

        updateMonthlyDistribution: (state, action) => {
            state.monthlyDistribution = {
                ...state.monthlyDistribution,
                ...action.payload,
            };
        },

        markWorkoutCompleted: (state, action) => {
            const { weekNumber, exercises, result, rounds, partialExercise, duration, playerId } = action.payload;
            state.completedWorkouts.push({
                type: 'weekly',
                weekNumber,
                exercises,
                result,
                rounds: rounds || 0,
                partialExercise: partialExercise || 0,
                duration,
                playerId,
                completedAt: new Date().toISOString(),
            });
        },
    },
});

/**
 * Genera un workout basado en el foco semanal
 * MEJORADO: Evita duplicados usando Set de IDs
 */
function generateWorkout(focus, duration, difficulty) {
    const exerciseCount = Math.ceil(duration / 2); // ~2 min por ejercicio en AMRAP

    // Calcular cuántos ejercicios de cada categoría
    const primaryCount = Math.ceil(exerciseCount * (focus.distribution.primary / 100));
    const secondaryCount = exerciseCount - primaryCount;

    // Filtrar ejercicios primarios
    let primaryExercises = EXERCISES.filter(ex =>
        focus.primaryMuscles.some(mg => ex.muscleGroups.includes(mg))
    );

    // Filtrar ejercicios secundarios
    let secondaryExercises = EXERCISES.filter(ex =>
        focus.secondaryMuscles.some(mg => ex.muscleGroups.includes(mg))
    );

    // Aplicar filtro de dificultad si se especifica
    if (difficulty) {
        primaryExercises = primaryExercises.filter(ex => ex.difficulty === difficulty);
        secondaryExercises = secondaryExercises.filter(ex => ex.difficulty === difficulty);
    }

    // ✅ MEJORADO: Usar Set para garantizar unicidad
    const selectedIds = new Set();
    const selectedExercises = [];

    // Seleccionar ejercicios primarios (sin duplicados)
    const shuffledPrimary = [...primaryExercises].sort(() => 0.5 - Math.random());
    for (const exercise of shuffledPrimary) {
        if (selectedIds.has(exercise.id)) continue;
        selectedExercises.push(exercise);
        selectedIds.add(exercise.id);
        if (selectedExercises.length >= primaryCount) break;
    }

    // Seleccionar ejercicios secundarios (sin duplicados y sin repetir primarios)
    const shuffledSecondary = [...secondaryExercises].sort(() => 0.5 - Math.random());
    for (const exercise of shuffledSecondary) {
        if (selectedIds.has(exercise.id)) continue;
        selectedExercises.push(exercise);
        selectedIds.add(exercise.id);
        if (selectedExercises.length >= exerciseCount) break;
    }

    // Mezclar el orden final y retornar
    return selectedExercises.sort(() => 0.5 - Math.random());
}

export const {
    generateWeeklyWorkout,
    generateRecoveryWorkout,
    updateMonthlyDistribution,
    markWorkoutCompleted,
} = workoutsSlice.actions;

// Selectors
export const selectWorkoutByWeek = (state, weekNumber) =>
    state.workouts.byWeek[weekNumber];

export const selectCurrentWeekWorkout = (state) => {
    const currentWeek = getWeekNumber(new Date());
    return state.workouts.byWeek[currentWeek];
};

export const selectMonthlyDistribution = (state) =>
    state.workouts.monthlyDistribution;

export const selectCompletedWorkouts = (state) =>
    state.workouts.completedWorkouts;

// Selector para analizar balance mensual
export const selectMonthlyBalance = (state) => {
    const currentMonth = new Date().getMonth();
    const workoutsThisMonth = state.workouts.completedWorkouts.filter(w => {
        const completedDate = new Date(w.completedAt);
        return completedDate.getMonth() === currentMonth;
    });

    // Contar ejercicios por grupo muscular
    const muscleGroupCount = {};
    Object.values(MUSCLE_GROUPS).forEach(mg => {
        muscleGroupCount[mg] = 0;
    });

    workoutsThisMonth.forEach(workout => {
        workout.exercises?.forEach(exercise => {
            exercise.muscleGroups.forEach(mg => {
                muscleGroupCount[mg]++;
            });
        });
    });

    return muscleGroupCount;
};

// NUEVO: Selector para calcular rankings por grupo muscular
export const selectMuscleGroupRankings = (state) => {
    const allPlayers = state.players?.allIds || [];
    const completedWorkouts = state.workouts.completedWorkouts;

    // Multiplicadores de dificultad
    const difficultyMultipliers = {
        [DIFFICULTY.BEGINNER]: 1,
        [DIFFICULTY.INTERMEDIATE]: 1.5,
        [DIFFICULTY.ADVANCED]: 2
    };

    // Inicializar estructura de rankings
    const rankings = {};
    Object.values(MUSCLE_GROUPS).forEach(mg => {
        rankings[mg] = {};
    });

    // Calcular puntos para cada workout completado
    completedWorkouts.forEach(workout => {
        if (workout.type !== 'weekly' || !workout.exercises || !workout.playerId) return;

        const rounds = workout.rounds || 0;
        const partialExercise = workout.partialExercise || 0;

        workout.exercises.forEach((exercise, exerciseIndex) => {
            // Determinar si este ejercicio cuenta
            const exerciseNumber = exerciseIndex + 1;
            let repsCompleted = rounds;

            // Si hay ejercicio parcial y llegamos hasta él (lo completamos)
            if (partialExercise > 0 && exerciseNumber <= partialExercise) {
                repsCompleted += 1;
            }

            if (repsCompleted === 0) return;

            // Calcular puntos base según dificultad
            const basePoints = difficultyMultipliers[exercise.difficulty] || 1;

            // Dividir puntos entre los músculos trabajados
            const muscleCount = exercise.muscleGroups.length;
            const pointsPerMuscle = basePoints / muscleCount;

            // Asignar puntos a cada grupo muscular
            exercise.muscleGroups.forEach(muscleGroup => {
                if (!rankings[muscleGroup][workout.playerId]) {
                    rankings[muscleGroup][workout.playerId] = {
                        points: 0,
                        breakdown: []
                    };
                }

                const points = pointsPerMuscle * repsCompleted;
                rankings[muscleGroup][workout.playerId].points += points;
                rankings[muscleGroup][workout.playerId].breakdown.push({
                    exercise: exercise.name,
                    difficulty: exercise.difficulty,
                    reps: repsCompleted,
                    points: points,
                    date: workout.completedAt
                });
            });
        });
    });

    // Convertir a arrays ordenados y añadir info del jugador
    const rankedResults = {};
    Object.keys(rankings).forEach(muscleGroup => {
        rankedResults[muscleGroup] = Object.entries(rankings[muscleGroup])
            .map(([playerId, data]) => {
                const player = state.players?.byId?.[playerId];
                return {
                    playerId,
                    playerName: player?.name || 'Desconocido',
                    playerPhoto: player?.photo || '',
                    points: Math.round(data.points * 10) / 10, // Redondear a 1 decimal
                    breakdown: data.breakdown
                };
            })
            .sort((a, b) => b.points - a.points);
    });

    return rankedResults;
};

// NUEVO: Selector para obtener badges de cada jugador
export const selectPlayerBadges = (state, playerId) => {
    const rankings = selectMuscleGroupRankings(state);
    const badges = [];

    let crownCount = 0; // Número de grupos donde es #1
    let top3Count = 0; // Número de grupos donde está en top 3
    let specialistGroup = null; // Grupo donde domina más
    let maxDominance = 0;

    Object.entries(rankings).forEach(([muscleGroup, players]) => {
        const playerRank = players.findIndex(p => p.playerId === playerId);

        if (playerRank === 0) {
            crownCount++;

            // Verificar si es especialista (2x puntos del segundo)
            if (players.length > 1) {
                const firstPoints = players[0].points;
                const secondPoints = players[1].points;
                const dominance = firstPoints / secondPoints;

                if (dominance >= 2 && dominance > maxDominance) {
                    maxDominance = dominance;
                    specialistGroup = muscleGroup;
                }
            }
        }

        if (playerRank >= 0 && playerRank < 3) {
            top3Count++;
        }
    });

    // Asignar badges según logros
    if (crownCount >= 3) {
        badges.push({
            id: 'absolute_king',
            name: '👑 Rey Absoluto',
            description: `Domina ${crownCount} grupos musculares`,
            tier: 'legendary'
        });
    }

    if (specialistGroup) {
        badges.push({
            id: 'specialist',
            name: '🔥 Especialista',
            description: `${Math.round(maxDominance)}x más puntos en ${specialistGroup}`,
            tier: 'epic'
        });
    }

    if (top3Count >= 5) {
        badges.push({
            id: 'versatile',
            name: '⚡ Polivalente',
            description: `Top 3 en ${top3Count} grupos diferentes`,
            tier: 'rare'
        });
    }

    // Verificar si solo hace ejercicios avanzados
    const completedWorkouts = state.workouts.completedWorkouts.filter(
        w => w.playerId === playerId && w.type === 'weekly'
    );

    const allAdvanced = completedWorkouts.length > 0 && completedWorkouts.every(workout =>
        workout.exercises?.every(ex => ex.difficulty === DIFFICULTY.ADVANCED)
    );

    if (allAdvanced && completedWorkouts.length >= 3) {
        badges.push({
            id: 'elite',
            name: '💎 Elite',
            description: 'Solo ejercicios avanzados',
            tier: 'legendary'
        });
    }

    if (crownCount === 1) {
        badges.push({
            id: 'champion',
            name: '🏆 Campeón',
            description: 'Líder en 1 grupo muscular',
            tier: 'common'
        });
    }

    return badges;
};

export default workoutsSlice.reducer;
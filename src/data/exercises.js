// src/data/exercises.js

/**
 * Categorías de grupos musculares
 */
export const MUSCLE_GROUPS = {
    CHEST: 'pecho',
    BACK: 'espalda',
    SHOULDERS: 'hombros',
    BICEPS: 'biceps',
    TRICEPS: 'triceps',
    CORE: 'core',
    GLUTES: 'gluteos',
    QUADS: 'cuadriceps',
    HAMSTRINGS: 'isquios',
    CALVES: 'gemelos',
    CARDIO: 'cardio'
};

/**
 * Niveles de dificultad
 */
export const DIFFICULTY = {
    BEGINNER: 'principiante',
    INTERMEDIATE: 'intermedio',
    ADVANCED: 'avanzado'
};

/**
 * Equipamiento necesario
 */
export const EQUIPMENT = {
    NONE: 'sin_equipo',
    DUMBBELLS: 'mancuernas',
    KETTLEBELL: 'kettlebell',
    BAR: 'barra',
    BOX: 'cajon',
    PULL_UP_BAR: 'barra_dominadas',
    ROPE: 'cuerda'
};

/**
 * Base de datos de ejercicios para AMRAP
 */
export const EXERCISES = [
    // ========== TREN SUPERIOR - PECHO ==========
    {
        id: 'ex001',
        name: 'Flexiones',
        nameEn: 'Push-ups',
        muscleGroups: [MUSCLE_GROUPS.CHEST, MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.CORE],
        difficulty: DIFFICULTY.BEGINNER,
        equipment: EQUIPMENT.NONE,
        repsType: 'count', // count | time | distance
        defaultReps: 10,
        description: 'Flexión de brazos estándar con cuerpo recto'
    },
    {
        id: 'ex002',
        name: 'Flexiones Diamante',
        nameEn: 'Diamond Push-ups',
        muscleGroups: [MUSCLE_GROUPS.CHEST, MUSCLE_GROUPS.TRICEPS],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 8,
        description: 'Flexiones con manos juntas formando diamante'
    },
    {
        id: 'ex003',
        name: 'Flexiones Explosivas',
        nameEn: 'Clapping Push-ups',
        muscleGroups: [MUSCLE_GROUPS.CHEST, MUSCLE_GROUPS.TRICEPS],
        difficulty: DIFFICULTY.ADVANCED,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 5,
        description: 'Flexiones con palmada en el aire'
    },

    // ========== TREN SUPERIOR - ESPALDA ==========
    {
        id: 'ex004',
        name: 'Dominadas',
        nameEn: 'Pull-ups',
        muscleGroups: [MUSCLE_GROUPS.BACK, MUSCLE_GROUPS.BICEPS],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.PULL_UP_BAR,
        repsType: 'count',
        defaultReps: 5,
        description: 'Dominadas pronación agarre ancho'
    },
    {
        id: 'ex005',
        name: 'Dominadas Supinas',
        nameEn: 'Chin-ups',
        muscleGroups: [MUSCLE_GROUPS.BACK, MUSCLE_GROUPS.BICEPS],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.PULL_UP_BAR,
        repsType: 'count',
        defaultReps: 6,
        description: 'Dominadas con agarre supino'
    },
    {
        id: 'ex006',
        name: 'Remo Invertido',
        nameEn: 'Inverted Rows',
        muscleGroups: [MUSCLE_GROUPS.BACK, MUSCLE_GROUPS.BICEPS],
        difficulty: DIFFICULTY.BEGINNER,
        equipment: EQUIPMENT.BAR,
        repsType: 'count',
        defaultReps: 10,
        description: 'Remo horizontal bajo barra'
    },

    // ========== TREN SUPERIOR - HOMBROS ==========
    {
        id: 'ex007',
        name: 'Press de Hombros con Mancuernas',
        nameEn: 'Dumbbell Shoulder Press',
        muscleGroups: [MUSCLE_GROUPS.SHOULDERS, MUSCLE_GROUPS.TRICEPS],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.DUMBBELLS,
        repsType: 'count',
        defaultReps: 10,
        description: 'Press militar con mancuernas'
    },
    {
        id: 'ex008',
        name: 'Flexiones Pike',
        nameEn: 'Pike Push-ups',
        muscleGroups: [MUSCLE_GROUPS.SHOULDERS, MUSCLE_GROUPS.TRICEPS],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 8,
        description: 'Flexiones en V invertida'
    },

    // ========== TREN SUPERIOR - BRAZOS ==========
    {
        id: 'ex009',
        name: 'Curl de Bíceps con Mancuernas',
        nameEn: 'Dumbbell Bicep Curls',
        muscleGroups: [MUSCLE_GROUPS.BICEPS],
        difficulty: DIFFICULTY.BEGINNER,
        equipment: EQUIPMENT.DUMBBELLS,
        repsType: 'count',
        defaultReps: 12,
        description: 'Curl de bíceps alterno'
    },
    {
        id: 'ex010',
        name: 'Fondos en Banco',
        nameEn: 'Bench Dips',
        muscleGroups: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.CHEST],
        difficulty: DIFFICULTY.BEGINNER,
        equipment: EQUIPMENT.BOX,
        repsType: 'count',
        defaultReps: 12,
        description: 'Fondos de tríceps en banco'
    },

    // ========== CORE ==========
    {
        id: 'ex011',
        name: 'Plancha',
        nameEn: 'Plank Hold',
        muscleGroups: [MUSCLE_GROUPS.CORE],
        difficulty: DIFFICULTY.BEGINNER,
        equipment: EQUIPMENT.NONE,
        repsType: 'time',
        defaultReps: 30, // segundos
        description: 'Plancha isométrica frontal'
    },
    {
        id: 'ex012',
        name: 'Abdominales',
        nameEn: 'Sit-ups',
        muscleGroups: [MUSCLE_GROUPS.CORE],
        difficulty: DIFFICULTY.BEGINNER,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 15,
        description: 'Abdominales completos'
    },
    {
        id: 'ex013',
        name: 'Russian Twists',
        nameEn: 'Russian Twists',
        muscleGroups: [MUSCLE_GROUPS.CORE],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 20,
        description: 'Giros rusos sentado'
    },
    {
        id: 'ex014',
        name: 'Mountain Climbers',
        nameEn: 'Mountain Climbers',
        muscleGroups: [MUSCLE_GROUPS.CORE, MUSCLE_GROUPS.CARDIO],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 20,
        description: 'Escaladores en plancha'
    },
    {
        id: 'ex015',
        name: 'Plancha Lateral',
        nameEn: 'Side Plank',
        muscleGroups: [MUSCLE_GROUPS.CORE],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.NONE,
        repsType: 'time',
        defaultReps: 30,
        description: 'Plancha lateral cada lado'
    },

    // ========== TREN INFERIOR - GLÚTEOS Y CUÁDRICEPS ==========
    {
        id: 'ex016',
        name: 'Sentadillas',
        nameEn: 'Air Squats',
        muscleGroups: [MUSCLE_GROUPS.QUADS, MUSCLE_GROUPS.GLUTES],
        difficulty: DIFFICULTY.BEGINNER,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 15,
        description: 'Sentadillas sin peso'
    },
    {
        id: 'ex017',
        name: 'Sentadilla con Salto',
        nameEn: 'Jump Squats',
        muscleGroups: [MUSCLE_GROUPS.QUADS, MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.CARDIO],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 10,
        description: 'Sentadilla explosiva con salto'
    },
    {
        id: 'ex018',
        name: 'Sentadilla Pistol',
        nameEn: 'Pistol Squats',
        muscleGroups: [MUSCLE_GROUPS.QUADS, MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.CORE],
        difficulty: DIFFICULTY.ADVANCED,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 5,
        description: 'Sentadilla a una pierna'
    },
    {
        id: 'ex019',
        name: 'Zancadas',
        nameEn: 'Lunges',
        muscleGroups: [MUSCLE_GROUPS.QUADS, MUSCLE_GROUPS.GLUTES],
        difficulty: DIFFICULTY.BEGINNER,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 12,
        description: 'Zancadas alternas'
    },
    {
        id: 'ex020',
        name: 'Zancadas con Salto',
        nameEn: 'Jumping Lunges',
        muscleGroups: [MUSCLE_GROUPS.QUADS, MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.CARDIO],
        difficulty: DIFFICULTY.ADVANCED,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 10,
        description: 'Zancadas alternando en salto'
    },
    {
        id: 'ex021',
        name: 'Step-ups en Cajón',
        nameEn: 'Box Step-ups',
        muscleGroups: [MUSCLE_GROUPS.QUADS, MUSCLE_GROUPS.GLUTES],
        difficulty: DIFFICULTY.BEGINNER,
        equipment: EQUIPMENT.BOX,
        repsType: 'count',
        defaultReps: 12,
        description: 'Subidas a cajón alternas'
    },

    // ========== TREN INFERIOR - ISQUIOS Y GLÚTEOS ==========
    {
        id: 'ex022',
        name: 'Peso Muerto Rumano con Mancuernas',
        nameEn: 'Dumbbell Romanian Deadlift',
        muscleGroups: [MUSCLE_GROUPS.HAMSTRINGS, MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.BACK],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.DUMBBELLS,
        repsType: 'count',
        defaultReps: 10,
        description: 'Peso muerto rumano'
    },
    {
        id: 'ex023',
        name: 'Puente de Glúteos',
        nameEn: 'Glute Bridge',
        muscleGroups: [MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.HAMSTRINGS],
        difficulty: DIFFICULTY.BEGINNER,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 15,
        description: 'Elevación de cadera'
    },
    {
        id: 'ex024',
        name: 'Puente de Glúteos a Una Pierna',
        nameEn: 'Single Leg Glute Bridge',
        muscleGroups: [MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.HAMSTRINGS, MUSCLE_GROUPS.CORE],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 10,
        description: 'Elevación de cadera unilateral'
    },

    // ========== TREN INFERIOR - GEMELOS ==========
    {
        id: 'ex025',
        name: 'Elevaciones de Gemelos',
        nameEn: 'Calf Raises',
        muscleGroups: [MUSCLE_GROUPS.CALVES],
        difficulty: DIFFICULTY.BEGINNER,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 20,
        description: 'Elevaciones de talones'
    },

    // ========== CARDIO / FULL BODY ==========
    {
        id: 'ex026',
        name: 'Burpees',
        nameEn: 'Burpees',
        muscleGroups: [MUSCLE_GROUPS.CHEST, MUSCLE_GROUPS.CORE, MUSCLE_GROUPS.QUADS, MUSCLE_GROUPS.CARDIO],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.NONE,
        repsType: 'count',
        defaultReps: 10,
        description: 'Burpee completo con flexión'
    },
    {
        id: 'ex027',
        name: 'Saltos al Cajón',
        nameEn: 'Box Jumps',
        muscleGroups: [MUSCLE_GROUPS.QUADS, MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.CARDIO],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.BOX,
        repsType: 'count',
        defaultReps: 10,
        description: 'Saltos explosivos al cajón'
    },
    {
        id: 'ex028',
        name: 'Comba / Saltar la Cuerda',
        nameEn: 'Jump Rope',
        muscleGroups: [MUSCLE_GROUPS.CALVES, MUSCLE_GROUPS.CARDIO],
        difficulty: DIFFICULTY.BEGINNER,
        equipment: EQUIPMENT.ROPE,
        repsType: 'count',
        defaultReps: 50,
        description: 'Saltos de comba'
    },
    {
        id: 'ex029',
        name: 'Swing con Kettlebell',
        nameEn: 'Kettlebell Swings',
        muscleGroups: [MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.HAMSTRINGS, MUSCLE_GROUPS.BACK, MUSCLE_GROUPS.CARDIO],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.KETTLEBELL,
        repsType: 'count',
        defaultReps: 15,
        description: 'Swing ruso con kettlebell'
    },
    {
        id: 'ex030',
        name: 'Thrusters',
        nameEn: 'Thrusters',
        muscleGroups: [MUSCLE_GROUPS.QUADS, MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.SHOULDERS, MUSCLE_GROUPS.CARDIO],
        difficulty: DIFFICULTY.ADVANCED,
        equipment: EQUIPMENT.DUMBBELLS,
        repsType: 'count',
        defaultReps: 10,
        description: 'Sentadilla frontal + press de hombros'
    },
    {
        id: 'ex031',
        name: 'Wall Balls',
        nameEn: 'Wall Balls',
        muscleGroups: [MUSCLE_GROUPS.QUADS, MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.SHOULDERS, MUSCLE_GROUPS.CARDIO],
        difficulty: DIFFICULTY.INTERMEDIATE,
        equipment: EQUIPMENT.NONE, // Necesita balón medicinal pero lo dejamos así
        repsType: 'count',
        defaultReps: 15,
        description: 'Sentadilla profunda y lanzamiento a pared'
    },
    {
        id: 'ex032',
        name: 'Remo con Mancuerna',
        nameEn: 'Dumbbell Rows',
        muscleGroups: [MUSCLE_GROUPS.BACK, MUSCLE_GROUPS.BICEPS],
        difficulty: DIFFICULTY.BEGINNER,
        equipment: EQUIPMENT.DUMBBELLS,
        repsType: 'count',
        defaultReps: 12,
        description: 'Remo unilateral con mancuerna'
    }
];

/**
 * Filtra ejercicios por grupo muscular
 */
export const getExercisesByMuscleGroup = (muscleGroup) => {
    return EXERCISES.filter(ex => ex.muscleGroups.includes(muscleGroup));
};

/**
 * Filtra ejercicios por dificultad
 */
export const getExercisesByDifficulty = (difficulty) => {
    return EXERCISES.filter(ex => ex.difficulty === difficulty);
};

/**
 * Filtra ejercicios por equipamiento
 */
export const getExercisesByEquipment = (equipment) => {
    return EXERCISES.filter(ex => ex.equipment === equipment);
};

/**
 * Obtiene ejercicios aleatorios según criterios
 */
export const getRandomExercises = (count, filters = {}) => {
    let filtered = [...EXERCISES];

    if (filters.muscleGroups) {
        filtered = filtered.filter(ex =>
            filters.muscleGroups.some(mg => ex.muscleGroups.includes(mg))
        );
    }

    if (filters.difficulty) {
        filtered = filtered.filter(ex => ex.difficulty === filters.difficulty);
    }

    if (filters.equipment) {
        filtered = filtered.filter(ex => ex.equipment === filters.equipment);
    }

    // Shuffle y tomar N ejercicios
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
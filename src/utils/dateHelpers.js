/**
 * Obtiene el número de semana del año
 */
export const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

/**
 * Verifica si dos fechas son el mismo día
 */
export const isSameDay = (date1, date2) => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

/**
 * Cuenta cuántos días únicos tiene sesiones en una semana específica
 */
export const getUniqueDaysInWeek = (sessions, weekNumber) => {
    const sessionsInWeek = sessions.filter(
        (session) => session.weekNumber === weekNumber && !session.isRecovery
    );

    const uniqueDates = new Set(
        sessionsInWeek.map((session) => {
            const date = new Date(session.date);
            return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        })
    );

    return uniqueDates.size;
};

/**
 * Calcula la racha actual de sesiones consecutivas (por semanas)
 */
export const calculateStreak = (sessions) => {
    if (!sessions || sessions.length === 0) return 0;

    const regularSessions = sessions
        .filter((s) => !s.isRecovery)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (regularSessions.length === 0) return 0;

    const currentWeek = getWeekNumber(new Date());
    let streak = 0;
    let checkingWeek = currentWeek;

    const sessionsByWeek = {};
    regularSessions.forEach((session) => {
        const week = session.weekNumber;
        if (!sessionsByWeek[week]) {
            sessionsByWeek[week] = [];
        }
        sessionsByWeek[week].push(session);
    });

    while (sessionsByWeek[checkingWeek]) {
        const uniqueDays = getUniqueDaysInWeek(regularSessions, checkingWeek);
        if (uniqueDays >= 3) {
            streak++;
            checkingWeek--;
        } else {
            break;
        }
    }

    return streak;
};

/**
 * Formatea una fecha en formato legible
 */
export const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

/**
 * Verifica si una fecha es hoy
 */
export const isToday = (date) => {
    return isSameDay(new Date(), new Date(date));
};
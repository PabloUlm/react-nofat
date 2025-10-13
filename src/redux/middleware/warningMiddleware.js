import { addWarning } from '../slices/playersSlice';
import { selectAllPlayers } from '../slices/playersSlice';
import { selectPlayerSessions } from '../slices/sessionsSlice';
import { getWeekNumber, getUniqueDaysInWeek } from '../../utils/dateHelpers';

const warningMiddleware = (store) => (next) => (action) => {
    const result = next(action);

    if (action.type === 'sessions/checkWeeklyCompliance') {
        const state = store.getState();
        const players = selectAllPlayers(state);
        const currentWeek = getWeekNumber(new Date());
        const previousWeek = currentWeek - 1;

        players.forEach((player) => {
            const sessions = selectPlayerSessions(state, player.id);
            const uniqueDays = getUniqueDaysInWeek(sessions, previousWeek);

            if (uniqueDays < 3) {
                store.dispatch(addWarning(player.id));
                console.log(`⚠️ Amonestación para ${player.name}: Solo ${uniqueDays}/3 días completados`);
            }
        });
    }

    return result;
};

export default warningMiddleware;

export const checkWeeklyCompliance = () => ({
    type: 'sessions/checkWeeklyCompliance',
});
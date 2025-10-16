// src/redux/thunks/checkWeeklyCompliance.js
import { addWarning } from '../slices/playersSlice';
import { selectAllPlayers } from '../slices/playersSlice';
import { selectPlayerSessions } from '../slices/sessionsSlice';
import { getWeekNumber, getUniqueDaysInWeek } from '../../utils/dateHelpers';

/**
 * Verifica el cumplimiento semanal de todos los jugadores
 * Añade amonestaciones a quienes no completaron 3 días la semana pasada
 *
 * @returns {Object} Resumen de la verificación
 */
export const checkWeeklyCompliance = () => (dispatch, getState) => {
    const state = getState();
    const players = selectAllPlayers(state);
    const currentWeek = getWeekNumber(new Date());
    const previousWeek = currentWeek - 1;

    const results = {
        checked: 0,
        warnings: 0,
        compliant: 0,
        details: [],
    };

    players.forEach((player) => {
        const sessions = selectPlayerSessions(state, player.id);
        const uniqueDays = getUniqueDaysInWeek(sessions, previousWeek);

        results.checked++;

        if (uniqueDays < 3) {
            dispatch(addWarning(player.id));
            results.warnings++;
            results.details.push({
                playerId: player.id,
                playerName: player.name,
                uniqueDays,
                status: 'warning',
            });
            console.log(
                `⚠️ Amonestación para ${player.name}: Solo ${uniqueDays}/3 días completados en semana ${previousWeek}`
            );
        } else {
            results.compliant++;
            results.details.push({
                playerId: player.id,
                playerName: player.name,
                uniqueDays,
                status: 'compliant',
            });
            console.log(
                `✅ ${player.name} completó ${uniqueDays}/3 días en semana ${previousWeek}`
            );
        }
    });

    console.log('📊 Resumen de verificación:', results);

    return results;
};
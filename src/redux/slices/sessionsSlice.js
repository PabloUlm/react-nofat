import { createSlice } from '@reduxjs/toolkit';
import { updatePlayerStats } from './playersSlice';
import {
    getWeekNumber,
    isSameDay,
    getUniqueDaysInWeek,
    calculateStreak
} from '../../utils/dateHelpers';

const initialState = {
    byId: {},
    allIds: [],
    byPlayer: {},
};

const sessionsSlice = createSlice({
    name: 'sessions',
    initialState,
    reducers: {
        addSession: (state, action) => {
            const session = action.payload;
            state.byId[session.id] = session;
            state.allIds.push(session.id);

            if (!state.byPlayer[session.playerId]) {
                state.byPlayer[session.playerId] = [];
            }
            state.byPlayer[session.playerId].push(session.id);
        },
        deleteSession: (state, action) => {
            const sessionId = action.payload;
            const session = state.byId[sessionId];

            if (session) {
                delete state.byId[sessionId];
                state.allIds = state.allIds.filter((id) => id !== sessionId);

                if (state.byPlayer[session.playerId]) {
                    state.byPlayer[session.playerId] = state.byPlayer[session.playerId].filter(
                        (id) => id !== sessionId
                    );
                }
            }
        },
    },
});

export const { addSession, deleteSession } = sessionsSlice.actions;

export const uploadSession = (sessionData) => (dispatch, getState) => {
    const { playerId, photo, result, date, isRecovery = false } = sessionData;
    const state = getState();

    const playerSessions = selectPlayerSessions(state, playerId);
    const hasSameDay = playerSessions.some((session) =>
        isSameDay(new Date(session.date), new Date(date))
    );

    if (hasSameDay && !isRecovery) {
        return {
            success: false,
            error: 'Ya tienes una sesión registrada para este día',
        };
    }

    const weekNumber = getWeekNumber(new Date(date));
    const uniqueDays = getUniqueDaysInWeek(playerSessions, weekNumber);

    if (uniqueDays >= 3 && !isRecovery) {
        return {
            success: false,
            error: 'Ya has completado 3 días diferentes esta semana',
        };
    }

    const newSession = {
        id: `s${Date.now()}`,
        playerId,
        photo,
        result,
        date: date || new Date().toISOString(),
        weekNumber,
        isRecovery,
    };

    dispatch(addSession(newSession));

    const updatedSessions = selectPlayerSessions(getState(), playerId);
    const totalSessions = updatedSessions.filter((s) => !s.isRecovery).length;
    const streak = calculateStreak(updatedSessions);

    dispatch(
        updatePlayerStats({
            playerId,
            totalSessions,
            streak,
            lastSessionDate: date,
        })
    );

    return { success: true, session: newSession };
};

export const selectAllSessions = (state) =>
    state.sessions.allIds.map((id) => state.sessions.byId[id]);

export const selectPlayerSessions = (state, playerId) => {
    const sessionIds = state.sessions.byPlayer[playerId] || [];
    return sessionIds.map((id) => state.sessions.byId[id]);
};

export const selectWeeklySessions = (state, playerId, weekNumber) => {
    const sessions = selectPlayerSessions(state, playerId);
    return sessions.filter((session) => session.weekNumber === weekNumber);
};

export const selectSessionById = (state, sessionId) =>
    state.sessions.byId[sessionId];

export default sessionsSlice.reducer;
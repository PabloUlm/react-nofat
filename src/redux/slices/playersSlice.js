import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    byId: {
        '1': {
            id: '1',
            name: 'Carlos Martínez',
            email: 'carlos@example.com',
            photo: 'https://i.pravatar.cc/150?img=12',
            warnings: 0,
            streak: 0,
            totalSessions: 0,
            lastSessionDate: null,
        },
        '2': {
            id: '2',
            name: 'Ana García',
            email: 'ana@example.com',
            photo: 'https://i.pravatar.cc/150?img=5',
            warnings: 0,
            streak: 0,
            totalSessions: 0,
            lastSessionDate: null,
        },
        '3': {
            id: '3',
            name: 'Luis Rodríguez',
            email: 'luis@example.com',
            photo: 'https://i.pravatar.cc/150?img=8',
            warnings: 0,
            streak: 0,
            totalSessions: 0,
            lastSessionDate: null,
        },
    },
    allIds: ['1', '2', '3'],
};

const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        addWarning: (state, action) => {
            const playerId = action.payload;
            if (state.byId[playerId]) {
                state.byId[playerId].warnings += 1;
            }
        },
        removeWarning: (state, action) => {
            const playerId = action.payload;
            if (state.byId[playerId]) {
                state.byId[playerId].warnings = Math.max(0, state.byId[playerId].warnings - 1);
            }
        },
        updatePlayerStats: (state, action) => {
            const { playerId, totalSessions, streak, lastSessionDate } = action.payload;
            if (state.byId[playerId]) {
                state.byId[playerId].totalSessions = totalSessions;
                state.byId[playerId].streak = streak;
                state.byId[playerId].lastSessionDate = lastSessionDate;
            }
        },
        addPlayer: (state, action) => {
            const player = action.payload;
            state.byId[player.id] = {
                ...player,
                warnings: 0,
                streak: 0,
                totalSessions: 0,
                lastSessionDate: null,
            };
            state.allIds.push(player.id);
        },
        resetWarnings: (state, action) => {
            const playerId = action.payload;
            if (state.byId[playerId]) {
                state.byId[playerId].warnings = 0;
            }
        },
    },
});

export const {
    addWarning,
    removeWarning,
    updatePlayerStats,
    addPlayer,
    resetWarnings,
} = playersSlice.actions;

export const selectAllPlayers = (state) =>
    state.players.allIds.map((id) => state.players.byId[id]);

export const selectPlayerById = (state, playerId) =>
    state.players.byId[playerId];

export const selectPlayersAtRisk = (state) =>
    state.players.allIds
        .map((id) => state.players.byId[id])
        .filter((player) => player.warnings >= 1);

export const selectLeaderboard = (state) => {
    const players = state.players.allIds.map((id) => state.players.byId[id]);
    return [...players].sort((a, b) => {
        if (b.totalSessions !== a.totalSessions) {
            return b.totalSessions - a.totalSessions;
        }
        if (a.warnings !== b.warnings) {
            return a.warnings - b.warnings;
        }
        return b.streak - a.streak;
    });
};

export default playersSlice.reducer;
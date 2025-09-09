import { createSlice } from '@reduxjs/toolkit';
import { STATE_STATUS } from '../constants';

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        pendingtasks: {
            status: STATE_STATUS.UNFETCHED,
            data: []
        }
    },
    reducers: {
        getPendingTasksRequest(state, action) {
            console.log('getPendingTasksRequest action', action);
            state.pendingtasks.status = STATE_STATUS.FETCHING;
            state.pendingtasks.data = [];
        },
        getPendingTasksSuccess(state, action) {
            state.pendingtasks.status = STATE_STATUS.FETCHED;
            state.pendingtasks.data = action.payload;
        },
        getPendingTasksFailure(state, action) {
            state.pendingtasks.status = STATE_STATUS.FAILED_FETCH;
            state.pendingtasks.data = [];
        }
    }
});

export const {
    getPendingTasksFailure,
    getPendingTasksRequest,
    getPendingTasksSuccess
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
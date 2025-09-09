import { takeLatest, put, call, fork } from "redux-saga/effects";
import { pendingTasks } from "../../services/dashboardService";
import {
    getPendingTasksFailure,
    getPendingTasksRequest,
    getPendingTasksSuccess
} from '../feature/dashboardSlice';

function* fechPendingTasks({ payload }) {
    console.log("pending tasks payload", payload);
    try {
        const data = yield call(pendingTasks, payload);
        console.log("data for pending tasks ", data);
        
        if (data?.success) {
            yield put(getPendingTasksSuccess(data?.data));
        } else {
            yield put(getPendingTasksFailure());
        }
    } catch (err) {
        yield put(getPendingTasksFailure(err));
    }
}

function* watchPendingTasks() {
    yield takeLatest(getPendingTasksRequest.type, fechPendingTasks);
}

export const dashboardSaga = [
    fork(watchPendingTasks),
];
import { takeLatest, call, put, fork } from 'redux-saga/effects';
import {
  getDispatchDetailsFailure,
  getDispatchDetailsRequest,
  getDispatchDetailsSuccess,
  getRegionByPlantsFailure,
  getRegionByPlantsRequest,
  getRegionByPlantsSuccess,
} from '../feature/dispatchDetailsSlice';
import { ScannerService } from '../../services/scannerService';
function* onLoadDispatchDetailsAsync({ payload }) {
  try {
    console.log('hit this one saga', payload);
    const data = yield call(ScannerService.fetchDispatchDetails, payload);
    console.log('data saga', data, payload);
    const totalPages = Math.ceil(data?.hits?.total / payload.pageSize);
    if (data?._shards?.successful) {
      yield put(
        getDispatchDetailsSuccess({
          data: data,
          totalPages: totalPages,
        }),
      );
    } else {
      yield put(getDispatchDetailsFailure());
    }
  } catch (error) {
    console.log(error);
    yield put(getDispatchDetailsFailure());
  }
}
function* getRegionByPlants({ payload }) {
  try {
    console.log('get region by plants list', payload);

    const data = yield call(ScannerService.regionByPlants, payload);
    console.log('get region by plants data', data);

    if (data?.data?.success) {
      yield put(getRegionByPlantsSuccess(data?.data?.data));
    } else {
      yield put(getRegionByPlantsFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getRegionByPlantsFailure(error));
  }
}
function* watchLoadDispatchDetails() {
  yield takeLatest(getDispatchDetailsRequest.type, onLoadDispatchDetailsAsync);
}
function* watchLoadRegionByPlants() {
  yield takeLatest(getRegionByPlantsRequest.type, getRegionByPlants);
}
export const dispatchDetailsSaga = [fork(watchLoadDispatchDetails),
fork(watchLoadRegionByPlants)
];

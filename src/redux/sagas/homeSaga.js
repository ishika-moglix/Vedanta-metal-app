import { takeLatest, call, put, fork } from 'redux-saga/effects';
import {
  getCreditBalanceFailure,
  getCreditBalanceRequest,
  getCreditBalanceSuccess,
  getSessionFailure,
  getSessionRequest,
  getSessionSuccess,
  getSearchPlantFailure,
  getSearchPlantRequest,
  getSearchPlantSuccess,
  getLCBGBalanceSuccess,
  getLCBGBalanceFailure,
  getLCBGBalanceRequest,
} from '../feature/homeSlice';

import { ScannerService } from '../../services/scannerService';
import AsyncStorage from '@react-native-async-storage/async-storage';
function* fetchCreditBalance({ payload }) {
  try {

    const data = yield call(ScannerService.getCreditBalance, payload);

    if (data?.successful) {
      yield put(getCreditBalanceSuccess(data?.data));
    } else {
      yield put(getCreditBalanceFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getCreditBalanceFailure(error));
  }
}

function* fetchLCBGBalance({ payload }) {
  try {

    const data = yield call(ScannerService.getLCBGreditBalance, payload);

    if (data?.success) {
      yield put(getLCBGBalanceSuccess(data?.data));
    } else {
      yield put(getLCBGBalanceFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getLCBGBalanceFailure(error));
  }
}

function* fetchSession({ payload }) {
  try {
    //console.log('saga', payload);

    const { data } = yield call(ScannerService.getSession, payload);
    if (data?.successful) {
      AsyncStorage.setItem(
        '@plantId',
        JSON.stringify({
          plantId: Object.keys(data?.data?.companyData?.branchNames)[0],
        }),
      );
      AsyncStorage.setItem(
        '@get_session',
        JSON.stringify({
          branchId: Object.keys(data?.data?.companyData?.branchNames)[0],
          companyId: Object.keys(data?.data?.companyData?.companyNames)[0],
          moglixB2BToken: payload?.authData?.token,
          moglixB2BUserId: payload?.authData?.userId,
        }),
      );

      yield put(getSessionSuccess(data?.data));
    } else {
      yield put(getSessionFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getSessionFailure(error));
  }
}

function* fetchSearchPlants({ payload }) {
  try {
    const { data } = yield call(ScannerService.searchPlantsByCompany, payload);
    // console.log('get plants data', data);

    if (data?.successful) {
      yield put(getSearchPlantSuccess(data?.data?.[0]));
    } else {
      yield put(getSearchPlantFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getSearchPlantFailure(error));
  }
}

function* watchCreditBalance() {
  yield takeLatest(getCreditBalanceRequest.type, fetchCreditBalance);
}

function* watchGetSession() {
  yield takeLatest(getSessionRequest.type, fetchSession);
}

function* watchSearchPlants() {
  yield takeLatest(getSearchPlantRequest.type, fetchSearchPlants);
}

function* watchLCBGBalance() {
  yield takeLatest(getLCBGBalanceRequest.type, fetchLCBGBalance);
}
export const homeSaga = [
  fork(watchCreditBalance),
  fork(watchGetSession),
  fork(watchSearchPlants),
  fork(watchLCBGBalance),
];

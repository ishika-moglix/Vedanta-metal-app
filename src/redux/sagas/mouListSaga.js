import { takeLatest, call, put, fork } from 'redux-saga/effects';
import {
  getMouListFailure,
  getMouListRequest,
  getMouListSuccess,
  getApprovedCustomerListFailure,
  getApprovedCustomerListRequest,
  getApprovedCustomerListSuccess,
  getApproverTypeFailure,
  getApproverTypeRequest,
  getApproverTypeSuccess,
  getMouAllStatusFailure,
  getMouAllStatusRequest,
  getMouAllStatusSuccess,
  getMouApprovedEmailIdFailure,
  getMouApprovedEmailIdRequest,
  getMouApprovedEmailIdSuccess,
  getMouCreatorNameFailure,
  getMouCreatorNameRequest,
  getMouCreatorNameSuccess,
  getNFAListFailure, getNFAListRequest, getNFAListSuccess,
  getNfaCustomerListSuccess,
  getNfaCustomerListFailure,
  getNfaCustomerListRequest,
  getNfaApproverIdListSuccess,
  getNfaApproverIdListFailure,
  getNfaApproverIdListRequest,
  getDraftMouRequest,
  getDraftMouFailure,
  getDraftMouSuccess,
  getFetchDraftMouFailure,
  getFetchDraftMouRequest,
  getFetchDraftMouSuccess,
  getNfaFailure,
  getNfaRequest,
  getNfaSuccess
} from '../feature/mouslice';

import { ScannerService } from '../../services/scannerService';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  approvedCustomerList,
  fetchMOUApproverEmailId,
  getAllMouStatus,
  getApproverType,
  fetchCreatorNameData,
  mouList,
  nfaList,
  mouCustomerList,
  nfaApproverUseyIdList,
  nfaApproverUserIdList,
  getNfa,
  draftMou,
  fetchDraftMou,
  zincList,
  zincDraftList,
  getZincMouStatus,
} from '../../services/mouService';
import { useSelector } from 'react-redux';
function* fetchMouList({ payload }) {
  console.log('hit this one mou saga', payload);
  try {
    // console.log('hit this one mou saga', payload);
      const data = payload?.dataObj?.businessUnit === 'Zinc' ? yield call(zincList, payload) : yield call(mouList, payload);
      console.log('zinc list data', data);
    
    if (data?.success) {
      const totalPages = Math.ceil(
        data?.data?.[0]?.totalMOU / payload.pageSize,
      );
      yield put(getMouListSuccess({ data: data, totalPages: totalPages }));
    } else {
      yield put(getMouListFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getMouListFailure(error));
  }
}
function* fetchNFAList({ payload }) {
  console.log('hit nfa saga', payload);
  try {
    const data = yield call(nfaList, payload);
    console.log('nfa list data', data?.data?.count, data?.data);

    if (data?.success) {
      const totalPages = Math.ceil(
        data?.data?.count / payload.pageSize,
      );
      yield put(getNFAListSuccess({
        data: data?.data
        , totalPages: totalPages
      }));
    } else {
      yield put(getNFAListFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getNFAListFailure(error));
  }
}

function* fetchApproverType({ payload }) {
  try {
    console.log('approver type', payload);

    const data = yield call(getApproverType, payload);
    console.log('approver type data', data);

    if (data?.data?.successful) {
      yield put(getApproverTypeSuccess(data?.data?.data));
    } else {
      yield put(getApproverTypeFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getApproverTypeFailure(error));
  }
}
function* fetchApprovedCustomerList({ payload }) {
  try {
    console.log('approved customer list', payload);

    const data = yield call(approvedCustomerList, payload);
    console.log('approved customer listdata', data);

    if (data?.successful) {
      yield put(getApprovedCustomerListSuccess(data?.data));
    } else {
      yield put(getApprovedCustomerListFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getApprovedCustomerListFailure(error));
  }
}
function* fetchMOUApprovedEmailId({ payload }) {
  try {
    console.log('approved email id', payload);

    const data = yield call(fetchMOUApproverEmailId, payload?.approverEmailId);
    console.log('approved email id data', data);

    if (data?.successful) {
      yield put(getMouApprovedEmailIdSuccess(data?.data));
    } else {
      yield put(getMouApprovedEmailIdFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getMouApprovedEmailIdFailure(error));
  }
}
function* fetchMOUAllStatus({ payload }) {
  try {
    console.log('mou all status', payload);

    const data = yield call(getAllMouStatus, payload);
    console.log('mou all status data', data);

    if (data?.data?.success) {
      yield put(getMouAllStatusSuccess(data?.data?.data));
    } else {
      yield put(getMouAllStatusFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getMouAllStatusFailure(error));
  }
}
function* fetchCreatorName({ payload }) {
  try {
    console.log('creator name', payload?.fetchCreatorNameData);

    const data = yield call(fetchCreatorNameData, payload?.fetchCreatorNameData);
    console.log('creator name data', data);

    if (data?.success) {
      yield put(getMouCreatorNameSuccess(data?.data));
    } else {
      yield put(getMouCreatorNameFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getMouCreatorNameFailure(error));
  }
}
function* fetchNfaCustomerList({ payload }) {
  try {
    console.log('nfa customer list', payload);

    const data = yield call(mouCustomerList, payload);
    console.log('nfa customer listdata', data);

    if (data?.successful) {
      yield put(getNfaCustomerListSuccess(data?.data));
    } else {
      yield put(getNFAListFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getNfaCustomerListFailure(error));
  }
}
function* fetchNfaApprovedIdList({ payload }) {
  try {
    console.log('nfa approver id list', payload);

    const data = yield call(nfaApproverUserIdList, payload);
    console.log('nfa approver id list data', data);

    if (data?.successful) {
      yield put(getNfaApproverIdListSuccess(data?.data));
    } else {
      yield put(getNfaApproverIdListFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getNfaApproverIdListFailure(error));
  }
}
function* fetchToGetNfa({ payload }) {
  try {
    console.log('get nfa view', payload);

    const data = yield call(getNfa, payload);
    console.log('get nfa view data', data);

    if (data?.success) {
      yield put(getNfaSuccess(data?.data));
    } else {
      yield put(getNfaFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getNfaFailure(error));
  }
}
function* fetchGetDraftMou({ payload }) {
  try {
    console.log('draft mou', payload);

    const data = payload?.businessUnit ==='Zinc' ? yield call(getZincMouStatus, payload): yield call(draftMou, payload);
    console.log('draft mou data', data);
    if (payload?.businessUnit === 'Zinc') {
      if (data?.data?.success) {
        yield put(getDraftMouSuccess(data?.data?.data));
      } else {
        yield put(getDraftMouFailure());
      }
    } else {
      if (data?.success) {
        yield put(getDraftMouSuccess(data?.data));
      } else {
        yield put(getDraftMouFailure());
      }
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getDraftMouFailure(error));
  }
}
function* fetchDraftMouListing({ payload }) {
  try {
    console.log('draft listing mou', payload);

    const data = payload?.dataObj?.businessUnit === 'Zinc' ? yield call(zincDraftList, payload) : yield call(fetchDraftMou, payload?.dataObj);
    // console.log('draft mou data', data);

    if (data?.success) {
      const totalPages = Math.ceil(
        data?.data?.[0]?.totalMOU / payload.pageSize,
      );
      yield put(getFetchDraftMouSuccess({ data: data, totalPages: totalPages }));
    } else {
      yield put(getFetchDraftMouFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getFetchDraftMouFailure(error));
  }
}

function* watchMouList() {
  yield takeLatest(getMouListRequest.type, fetchMouList);
}

function* watchNFAList() {
  yield takeLatest(getNFAListRequest.type, fetchNFAList);
}

function* watchMouApprovedCustomerList() {
  yield takeLatest(
    getApprovedCustomerListRequest.type,
    fetchApprovedCustomerList,
  );
}

function* watchMouApproverType() {
  yield takeLatest(getApproverTypeRequest.type, fetchApproverType);
}

function* watchCreatorName() {
  yield takeLatest(getMouCreatorNameRequest.type, fetchCreatorName);
}

function* watchMouAllStatus() {
  yield takeLatest(getMouAllStatusRequest.type, fetchMOUAllStatus);
}
function* watchMouApprovedEmailId() {
  yield takeLatest(getMouApprovedEmailIdRequest.type, fetchMOUApprovedEmailId);
}
function* watchNFACustomerList() {
  yield takeLatest(getNfaCustomerListRequest.type, fetchNfaCustomerList);
}
function* watchNfaApproverUserId() {
  yield takeLatest(getNfaApproverIdListRequest.type, fetchNfaApprovedIdList);
}
function* watchGetNfa() {
  yield takeLatest(getNfaRequest.type, fetchToGetNfa);
}
function* watchGetDraftMou() {
  yield takeLatest(getDraftMouRequest.type, fetchGetDraftMou);
}
function* watchFetchDraftMou() {
  yield takeLatest(getFetchDraftMouRequest.type, fetchDraftMouListing);
}
export const mouListSaga = [
  fork(watchMouList),
  fork(watchCreatorName),
  fork(watchMouAllStatus),
  fork(watchMouApprovedCustomerList),
  fork(watchMouApprovedEmailId),
  fork(watchMouApproverType),
  fork(watchNFAList),
  fork(watchNFACustomerList),
  fork(watchNfaApproverUserId),
  fork(watchGetNfa),
  fork(watchGetDraftMou),
  fork(watchFetchDraftMou),
];

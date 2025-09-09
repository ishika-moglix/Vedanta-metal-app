import { takeLatest, call, put, fork } from 'redux-saga/effects';
import {
    getCustomerListingSuccess,
    getCustomerListingFailure,
    getCustomerListingRequest,
    getPlantRequestsFailure,
    getPlantRequestsRequest,
  getPlantRequestsSuccess,
  getAllByCompanyFailure,
  getAllByCompanyRequest, getAllByCompanySuccess,
  getByCompanyFailure, getByCompanyRequest, getByCompanySuccess,
  companyGetFailure, companyGetRequest,
  companyGetSuccess,
  userGetFailure, userGetRequest, userGetSuccess,
  getDetailsFailure,
  getDetailsRequest,
  getDetailsSuccess
} from '../feature/customerRegSlice';
import { customerListing, getPlantRequest, getAllByCompany, getByCompany, userGet, companyGet, getDetailsCustomer } from '../../services/customerRegistration';
function* onLoadcustomerListing({ payload }) {
  try {
    console.log('hit this one saga', payload);
    const data = yield call(customerListing, payload);
    console.log('data saga', data, payload);
    const totalPages = Math.ceil(data?.data?.data?.totalCount/ payload.pageSize);
    if (data?.data?.successful) {
      yield put(
        getCustomerListingSuccess({
          data: data?.data?.data,
          totalPages: totalPages,
        }),
      );
    } else {
      yield put(getCustomerListingFailure());
    }
  } catch (error) {
    console.log(error);
    yield put(getCustomerListingFailure());
  }
}
function* getPlantRequests({ payload }) {
  try {
    console.log('getPlantRequests', payload);

    const data = yield call(getPlantRequest, payload);
    console.log('get region by plants data', data);

    if (data?.data?.success) {
      yield put(getPlantRequestsSuccess(data?.data?.data));
    } else {
      yield put(getPlantRequestsFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getPlantRequestsFailure(error));
  }
}
function* onLoadgetAllByCompany({ payload }) {
  try {
    console.log('getAllByCompany', payload);

    const data = yield call(getAllByCompany, payload);
    console.log('get getAllByCompany data', data);

    if (data?.data.successful) {
      yield put(getAllByCompanySuccess(data?.data?.data));
    } else {
      yield put(getAllByCompanyFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getAllByCompanyFailure(error));
  }
}
function* onLoadGetByCompany({ payload }) {
  try {
    console.log('getByCompany', payload);
    const data = yield call(getByCompany, payload);
    console.log('get getByCompany data', data);
  const totalPages = Math.ceil(data?.data?.data?.totalUsers/ payload.pageSize);
    if (data?.data?.successful) {
      yield put(getByCompanySuccess({
        data: data?.data?.data,
        totalPages: totalPages,
      }));
    } else {
      yield put(getByCompanyFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getByCompanyFailure(error));
  }
}
function* onLoadUserGet({ payload }) {
  try {
    console.log('onLoadUserCompany', payload);

    const data = yield call(userGet, payload);
    console.log('get onLoadUserCompany data', data);

    if (data?.data?.successful) {
      yield put(userGetSuccess(data?.data?.data));
    } else {
      yield put(userGetFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(userGetFailure(error));
  }
}
function* onLoadCompanyGet({ payload }) {
  try {
    console.log('onLoadCompanyGet', payload);

    const data = yield call(companyGet, payload);
    console.log('get onLoadCompanyGet data', data);

    if (data?.data?.successful) {
      yield put(companyGetSuccess(data?.data?.data));
    } else {
      yield put(companyGetFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(companyGetFailure(error));
  }
}
function* onLoadGetDetails({ payload }) {
  try {
    console.log('onLoadGetDetails', payload);
    const data = yield call(getDetailsCustomer, payload);
    console.log('get onLoadGetDetails data', data);

    if (data?.data?.successful) {
      yield put(getDetailsSuccess(data?.data?.data));
    } else {
      yield put(getDetailsFailure());
    }
  } catch (error) {
    console.log('saga error here', error);
    yield put(getDetailsFailure(error));
  }
}
function* watchLoadCustomerListing() {
  yield takeLatest(getCustomerListingRequest.type, onLoadcustomerListing);
}
function* watchLoadPlantRequests() {
  yield takeLatest(getPlantRequestsRequest.type, getPlantRequests);
}
function* watchLoadGetAllByCompany() {
  yield takeLatest(getAllByCompanyRequest.type, onLoadgetAllByCompany);
}
function* watchLoadGetByCompany() {
  yield takeLatest(getByCompanyRequest.type, onLoadGetByCompany);
}
function* watchLoadUserGet() {
  yield takeLatest(userGetRequest.type, onLoadUserGet);
}
function* watchLoadCompanyGet() {
  yield takeLatest(companyGetRequest.type, onLoadCompanyGet);
}
function* watchLoadGetDetails() {
  yield takeLatest(getDetailsRequest.type, onLoadGetDetails);
}
export const customerRegistrationSaga = [fork(watchLoadCustomerListing),
  fork(watchLoadPlantRequests),
  fork(watchLoadGetAllByCompany),
  fork(watchLoadCompanyGet),
  fork(watchLoadUserGet),
  fork(watchLoadGetByCompany),
  fork(watchLoadGetDetails)
];

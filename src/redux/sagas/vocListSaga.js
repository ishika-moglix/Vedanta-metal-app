import { takeLatest, call, put, fork } from 'redux-saga/effects';
import {
    getVocListFailure,
    getVocListRequest,
    getVocListSuccess,
    getVocAdminListFailure,
    getVocAdminListRequest,
    getVocAdminListSuccess,
    getVocComplaintFailure,
    getVocComplaintRequest,
    getVocComplaintSuccess,
    getCCHPProductVariantsFailure,
    getCCHPProductVariantsRequest,
    getCCHPProductVariantsSuccess,
    getFeedbackCategoryFailure,
    getFeedbackCategoryRequest,
    getFeedbackCategorySuccess,
    getFeedbackSubCategoryFailure,
    getFeedbackSubCategoryRequest,
    getFeedbackSubCategorySuccess,
    getComplaintMailFailure,
    getComplaintMailRequest,
    getComplaintMailSuccess,
    getShipmentFailure,
    getShipmentRequest,
    getShipmentSuccess,
    getUserByRoleRMFailure,
    getUserByRolePMFailure,
    getUserByRolePMRequest,
    getUserByRolePMSEZFailure,
    getUserByRolePMSEZRequest,
    getUserByRolePMSEZSuccess,
    getUserByRolePMSuccess,
    getUserByRoleRMRequest,
    getUserByRoleRMSEZFailure,
    getUserByRoleRMSEZRequest,
    getUserByRoleRMSEZSuccess,
    getUserByRoleRMSuccess,

} from '../feature/vocSlice';
import { ScannerService } from '../../services/scannerService';
// import AsyncStorage from '@react-native-async-storage/async-storage';

function* fetchVocList({ payload }) {
    // console.log('hit this one mou saga', payload);
    try {
        const data = yield call(ScannerService.vocListing, payload);
        // console.log('mou list data', data);

        if (data?.data?.success) {
            const totalPages = Math.ceil(
                data?.data?.data?.totalFeedback / payload.pageSize,
            );
            yield put(getVocListSuccess({ data: data?.data?.data, totalPages: totalPages }));
        } else {
            yield put(getVocListFailure());
        }
    } catch (error) {
        // console.log('saga error here', error);
        yield put(getVocListFailure(error));
    }
}

function* fetchVocAdminList({ payload }) {
    // console.log('hit this one voc saga', payload);
    try {
        const data = yield call(ScannerService.vocAdminListing, payload);
        // console.log('voc list data', data);

        if (data?.data?.success) {
            const totalPages = Math.ceil(
                data?.data?.data?.totalFeedback / payload.pageSize,
            );
            yield put(getVocAdminListSuccess({ data: data?.data?.data, totalPages: totalPages }));
        } else {
            yield put(getVocAdminListFailure());
        }
    } catch (error) {
        // console.log('saga error here', error);
        yield put(getVocAdminListFailure(error));
    }
}

function* getComplaintById({ payload }) {
    // console.log('hit this getComplaintById saga', payload);
    try {
        const data = yield call(ScannerService.getComplaintById, payload);


        if (data?.data?.success) {
            // console.log('getComplaintById data', data);
            yield put(getVocComplaintSuccess(data?.data?.data));
        } else {
            yield put(getVocComplaintFailure());
        }
    } catch (error) {
        // console.log('saga error here', error);
        yield put(getVocComplaintFailure(error));
    }
}

function* getAllCCHPProductVariants({ payload }) {
    // console.log('hit this getAllCCH saga', payload);
    try {
        const data = yield call(ScannerService.getAllCCHPProductVariants, payload);
        // console.log('getAllCCHH prod data', data);
        if (data?.data?.success) {
            yield put(getCCHPProductVariantsSuccess(data?.data?.data));
        } else {
            yield put(getCCHPProductVariantsFailure());
        }
    } catch (error) {
        // console.log('saga error here', error);
        yield put(getCCHPProductVariantsFailure(error));
    }
}
function* getFeedbackCategory({ payload }) {
    //// console.log('hit this getFeedbackCategory saga', payload);
    try {
        const data = yield call(ScannerService.feedbackCategory, payload);
        //// console.log('getFeedbackCategory prod data', data);
        if (data?.data?.success) {
            yield put(getFeedbackCategorySuccess(data?.data?.data));
        } else {
            yield put(getFeedbackCategoryFailure());
        }
    } catch (error) {
        // console.log('saga error here', error);
        yield put(getFeedbackCategoryFailure(error));
    }
}
function* getFeedbackSubCategory({ payload }) {
    // console.log('hit this getFeedbackSubCategory saga', payload);
    try {
        const data = yield call(ScannerService.feedbackSubCategory, payload);
        //// console.log('getFeedbackCategory prod data', data);
        if (data?.data?.success) {
            yield put(getFeedbackSubCategorySuccess(data?.data?.data));
        } else {
            yield put(getFeedbackSubCategoryFailure());
        }
    } catch (error) {
        // console.log('saga error here', error);
        yield put(getFeedbackSubCategoryFailure(error));
    }
}
function* getComplaintMail({ payload }) {
    console.log('hit this dispatchCompanyId saga', payload);
    try {
        const data = yield call(ScannerService.getComplaintMail, payload);
        // console.log('getComplaintMailSuccess prod data', data);
        if (data?.data?.success) {
            yield put(getComplaintMailSuccess(data?.data?.data));
        } else {
            yield put(getComplaintMailFailure());
        }
    } catch (error) {
        // console.log('saga error here', error);
        yield put(getComplaintMailFailure(error));
    }
}
function* getUserByRoleRM({ payload }) {
    // console.log('hit this getUserByRole saga RM', payload);
    try {
        const data = yield call(ScannerService.getUserByRoleRM, payload);
        // console.log('getUserByRole prod data', data);
        if (data?.data?.successful) {
            yield put(getUserByRoleRMSuccess(data?.data?.data));
        } else {
            yield put(getUserByRoleRMFailure());
        }
    } catch (error) {
        // console.log('saga error here', error);
        yield put(getUserByRoleRMFailure(error));
    }
}
function* getUserByRoleRMSEZ({ payload }) {
    // console.log('hit this getUserByRole saga RM SEZ', payload);
    try {
        const data = yield call(ScannerService.getUserByRoleRMSEZ, payload);
        // console.log('getUserByRole prod data', data);
        if (data?.data?.successful) {
            yield put(getUserByRoleRMSEZSuccess(data?.data?.data));
        } else {
            yield put(getUserByRoleRMSEZFailure());
        }
    } catch (error) {
        // console.log('saga error here', error);
        yield put(getUserByRoleRMSEZFailure(error));
    }
}
function* getUserByRolePM({ payload }) {
    // console.log('hit this getUserByRole saga', payload);
    try {
        const data = yield call(ScannerService.getUserByRolePM, payload);
        // console.log('getUserByRole prod data', data);
        if (data?.data?.successful) {
            yield put(getUserByRolePMSuccess(data?.data?.data));
        } else {
            yield put(getUserByRolePMFailure());
        }
    } catch (error) {
        // console.log('saga error here', error);
        yield put(getUserByRolePMFailure(error));
    }
}
function* getUserByRolePMSEZ({ payload }) {
    // console.log('hit this getUserByRole saga', payload);
    try {
        const data = yield call(ScannerService.getUserByRolePMSEZ, payload);
        // console.log('getUserByRole prod data', data);
        if (data?.data?.successful) {
            yield put(getUserByRolePMSEZSuccess(data?.data?.data));
        } else {
            yield put(getUserByRolePMSEZFailure());
        }
    } catch (error) {
        // console.log('saga error here', error);
        yield put(getUserByRolePMSEZFailure(error));
    }
}
function* getShipment({ payload }) {
    // console.log('hit this getUserByRole saga', payload);
    try {
        const data = yield call(ScannerService.getShipment, payload);
        // console.log('getShipment prod data', data);
        if (data?.data?.success) {
            yield put(getShipmentSuccess(data?.data?.data));
        } else {
            yield put(getShipmentFailure());
        }
    } catch (error) {
        // console.log('saga error here', error);
        yield put(getShipmentFailure(error));
    }
}
function* watchVocList() {
    yield takeLatest(getVocListRequest.type, fetchVocList);
}
function* watchVocAdminList() {
    yield takeLatest(getVocAdminListRequest.type, fetchVocAdminList);
}
function* watchVocComplaint() {
    yield takeLatest(getVocComplaintRequest.type, getComplaintById);
}
function* watchCCHPProductVariant() {
    yield takeLatest(getCCHPProductVariantsRequest.type, getAllCCHPProductVariants);
}
function* watchFeedbackCategory() {
    yield takeLatest(getFeedbackCategoryRequest.type, getFeedbackCategory);
}
function* watchFeedbackSubCategory() {
    yield takeLatest(getFeedbackSubCategoryRequest.type, getFeedbackSubCategory);
}
function* watchComplaintMail() {
    yield takeLatest(getComplaintMailRequest.type, getComplaintMail);
}
function* watchUserByRolePM() {
    yield takeLatest(getUserByRolePMRequest.type, getUserByRolePM);
}
function* watchUserByRoleRM() {
    yield takeLatest(getUserByRoleRMRequest.type, getUserByRoleRM);
}
function* watchUserByRolePMSEZ() {
    yield takeLatest(getUserByRolePMSEZRequest.type, getUserByRolePMSEZ);
}
function* watchUserByRoleRMSEZ() {
    yield takeLatest(getUserByRoleRMSEZRequest.type, getUserByRoleRMSEZ);
}
function* watchShipment() {
    yield takeLatest(getShipmentRequest.type, getShipment);
}
export const vocListSaga = [
    fork(watchVocList),
    fork(watchVocAdminList),
    fork(watchVocComplaint),
    fork(watchCCHPProductVariant),
    fork(watchFeedbackCategory),
    fork(watchFeedbackSubCategory),
    fork(watchUserByRolePM),
    fork(watchUserByRoleRM),
    fork(watchUserByRolePMSEZ),
    fork(watchUserByRoleRMSEZ),
    fork(watchComplaintMail),
    fork(watchShipment),
];
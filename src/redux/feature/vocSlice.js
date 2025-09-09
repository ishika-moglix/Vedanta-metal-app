import { createSlice } from '@reduxjs/toolkit';
import { STATE_STATUS } from '../constants';

const vocSlice = createSlice({
    name: 'vocList',
    initialState: {
        vocList: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
            currentPage: 0,
        },

        vocAdminList: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
            currentPage: 0,
        },

        complaintById: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },

        CCHPProductVariants: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },

        feedbackSubCategory: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },
        feedbackCategory: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },
        getComplaintMail: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },
        getUserByRoleRM: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },
        getUserByRoleRMSEZ: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },
        getUserByRolePM: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },
        getUserByRolePMSEZ: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },
        getShipment: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },
    },
    reducers: {
        getVocListRequest(state, action) {
            console.log('vocList action', action);
            const page = action.payload.page || 1;
            console.log('pagae is', page);
            state.vocList.status = STATE_STATUS.FETCHING;
            state.vocList.data = page === 1 ? [] : state.vocList.data;
            state.vocList.currentPage = page;
        },
        getVocListSuccess(state, action) {
            state.vocList.status = STATE_STATUS.FETCHED;
            state.vocList.data = state.vocList.data.concat(action.payload.data);
            state.vocList.totalPages = action.payload.totalPages;
        },
        getVocListFailure(state, action) {
            state.vocList.status = STATE_STATUS.FAILED_FETCH;
        },
        getVocAdminListRequest(state, action) {
            console.log('vocList action', action);
            const page = action.payload.page || 1;
            console.log('pagae is', page);
            state.vocAdminList.status = STATE_STATUS.FETCHING;
            state.vocAdminList.data = page === 1 ? [] : state.vocAdminList.data;
            state.vocAdminList.currentPage = page;
        },
        getVocAdminListSuccess(state, action) {
            state.vocAdminList.status = STATE_STATUS.FETCHED;
            state.vocAdminList.data = state.vocAdminList.data.concat(action.payload.data);
            state.vocAdminList.totalPages = action.payload.totalPages;
        },
        getVocAdminListFailure(state, action) {
            state.vocAdminList.status = STATE_STATUS.FAILED_FETCH;
        },
        getVocComplaintRequest(state, action) {
            console.log('complaintById action', action);
            state.complaintById.status = STATE_STATUS.FETCHING;
            state.complaintById.data = {};
        },
        getVocComplaintSuccess(state, action) {
            state.complaintById.status = STATE_STATUS.FETCHED;
            state.complaintById.data = action.payload;

        },
        getVocComplaintFailure(state, action) {
            state.complaintById.status = STATE_STATUS.FAILED_FETCH;
        },
        getCCHPProductVariantsRequest(state, action) {
            console.log('CCHPProductVariants action', action);
            state.CCHPProductVariants.status = STATE_STATUS.FETCHING;
            state.CCHPProductVariants.data = {};
        },
        getCCHPProductVariantsSuccess(state, action) {
            state.CCHPProductVariants.status = STATE_STATUS.FETCHED;
            state.CCHPProductVariants.data = action.payload;

        },
        getCCHPProductVariantsFailure(state, action) {
            state.CCHPProductVariants.status = STATE_STATUS.FAILED_FETCH;
        },
        getFeedbackCategoryRequest(state, action) {
            console.log('feedbackCategory action', action);
            state.feedbackCategory.status = STATE_STATUS.FETCHING;
            state.feedbackCategory.data = {};
        },
        getFeedbackCategorySuccess(state, action) {
            state.feedbackCategory.status = STATE_STATUS.FETCHED;
            state.feedbackCategory.data = action.payload;

        },
        getFeedbackCategoryFailure(state, action) {
            state.feedbackCategory.status = STATE_STATUS.FAILED_FETCH;
        },
        getFeedbackSubCategoryRequest(state, action) {
            console.log('feedbackSubCategory action', action);
            state.feedbackSubCategory.status = STATE_STATUS.FETCHING;
            state.feedbackSubCategory.data = {};
        },
        getFeedbackSubCategorySuccess(state, action) {
            state.feedbackSubCategory.status = STATE_STATUS.FETCHED;
            state.feedbackSubCategory.data = action.payload;

        },
        getFeedbackSubCategoryFailure(state, action) {
            state.feedbackSubCategory.status = STATE_STATUS.FAILED_FETCH;
        },
        getComplaintMailRequest(state, action) {
            console.log('ComplaintMail action', action);
            state.getComplaintMail.status = STATE_STATUS.FETCHING;
            state.getComplaintMail.data = {};
        },
        getComplaintMailSuccess(state, action) {
            state.getComplaintMail.status = STATE_STATUS.FETCHED;
            state.getComplaintMail.data = action.payload;

        },
        getComplaintMailFailure(state, action) {
            state.getComplaintMail.status = STATE_STATUS.FAILED_FETCH;
        },
        getUserByRoleRMRequest(state, action) {
            console.log('getUserByRole action', action);
            state.getUserByRoleRM.status = STATE_STATUS.FETCHING;
            state.getUserByRoleRM.data = {};
        },
        getUserByRoleRMSuccess(state, action) {
            state.getUserByRoleRM.status = STATE_STATUS.FETCHED;
            state.getUserByRoleRM.data = action.payload;
        },
        getUserByRoleRMFailure(state, action) {
            state.getUserByRoleRM.status = STATE_STATUS.FAILED_FETCH;
        },
        getUserByRoleRMSEZRequest(state, action) {
            console.log('getUserByRole action', action);
            state.getUserByRoleRMSEZ.status = STATE_STATUS.FETCHING;
            state.getUserByRoleRMSEZ.data = {};
        },
        getUserByRoleRMSEZSuccess(state, action) {
            state.getUserByRoleRMSEZ.status = STATE_STATUS.FETCHED;
            state.getUserByRoleRMSEZ.data = action.payload;
        },
        getUserByRoleRMSEZFailure(state, action) {
            state.getUserByRoleRMSEZ.status = STATE_STATUS.FAILED_FETCH;
        },
        getUserByRolePMRequest(state, action) {
            console.log('getUserByRole action', action);
            state.getUserByRolePM.status = STATE_STATUS.FETCHING;
            state.getUserByRolePM.data = {};
        },
        getUserByRolePMSuccess(state, action) {
            state.getUserByRolePM.status = STATE_STATUS.FETCHED;
            state.getUserByRolePM.data = action.payload;
        },
        getUserByRolePMFailure(state, action) {
            state.getUserByRolePM.status = STATE_STATUS.FAILED_FETCH;
        },
        getUserByRolePMSEZRequest(state, action) {
            console.log('getUserByRole action', action);
            state.getUserByRolePMSEZ.status = STATE_STATUS.FETCHING;
            state.getUserByRolePMSEZ.data = {};
        },
        getUserByRolePMSEZSuccess(state, action) {
            state.getUserByRolePMSEZ.status = STATE_STATUS.FETCHED;
            state.getUserByRolePMSEZ.data = action.payload;
        },
        getUserByRolePMSEZFailure(state, action) {
            state.getUserByRolePMSEZ.status = STATE_STATUS.FAILED_FETCH;
        },
        getShipmentRequest(state, action) {
            console.log('getShipment action', action);
            state.getShipment.status = STATE_STATUS.FETCHING;
            state.getShipment.data = {};
        },
        getShipmentSuccess(state, action) {
            state.getShipment.status = STATE_STATUS.FETCHED;
            state.getShipment.data = action.payload;

        },
        getShipmentFailure(state, action) {
            state.getShipment.status = STATE_STATUS.FAILED_FETCH;
        },
    },
});

export const {
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
    getUserByRoleSuccess,
} = vocSlice.actions;

export default vocSlice.reducer;
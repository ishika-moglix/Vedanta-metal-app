import { createSlice } from '@reduxjs/toolkit';
import { STATE_STATUS } from '../constants';

const mouSlice = createSlice({
  name: 'mouList',
  initialState: {
    mouList: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
      currentPage: 0,
    },
    approverType: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
    },
    approvedCustomerList: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
    },
    mouApprovedEmailId: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
    },
    mouAllStatus: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
    },
    mouCreatorName: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
    },

    nfaCustomerList: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
    },
    nfaApproverId: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
    },
    nfaList: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
      currentPage: 0,
    },
    getNfa: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
    },
    draftMou: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
    },
    fetchDraftMou: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
    },
  },
  reducers: {
    getMouListRequest(state, action) {
      console.log('mouList action', action);
      const page = action.payload.page || 1;
      console.log('pagae is', page);

      state.mouList.status = STATE_STATUS.FETCHING;
      state.mouList.data = page === 1 ? [] : state.mouList.data;
      state.mouList.currentPage = page;
    },
    getMouListSuccess(state, action) {
      state.mouList.status = STATE_STATUS.FETCHED;
      state.mouList.data = state.mouList.data.concat(action.payload.data);
      state.mouList.totalPages = action.payload.totalPages;
    },
    getMouListFailure(state, action) {
      state.mouList.status = STATE_STATUS.FAILED_FETCH;
    },
    getNFAListRequest(state, action) {
      console.log('nfalist action', action);
      const page = action.payload.page || 1;
      console.log('pagae is', page);

      state.nfaList.status = STATE_STATUS.FETCHING;
      state.nfaList.data = page === 1 ? [] : state.nfaList.data;
      state.nfaList.currentPage = page;
    },
    getNFAListSuccess(state, action) {
      state.nfaList.status = STATE_STATUS.FETCHED;
      state.nfaList.data = state.nfaList.data.concat(action.payload.data);
      state.nfaList.totalPages = action.payload.totalPages;
    },
    getNFAListFailure(state, action) {
      state.nfaList.status = STATE_STATUS.FAILED_FETCH;
    },
    setCurrentTab(state, action) {
      state.currentTab = action.payload;
    },
    getApproverTypeRequest(state, action) {
      state.approverType.status = STATE_STATUS.FETCHING;
      state.approverType.data = {};
    },
    getApproverTypeSuccess(state, action) {
      // console.log(action, '//');

      state.approverType.status = STATE_STATUS.FETCHED;
      state.approverType.data = action.payload;
    },
    getApproverTypeFailure(state, action) {
      state.approverType.status = STATE_STATUS.FAILED_FETCH;
    },
    getApprovedCustomerListRequest(state, action) {
      state.approvedCustomerList.status = STATE_STATUS.FETCHING;
      state.approvedCustomerList.data = {};
    },
    getApprovedCustomerListSuccess(state, action) {
      // console.log(action, '//');

      state.approvedCustomerList.status = STATE_STATUS.FETCHED;
      state.approvedCustomerList.data = action.payload;
    },
    getApprovedCustomerListFailure(state, action) {
      state.approvedCustomerList.status = STATE_STATUS.FAILED_FETCH;
    },
    getMouApprovedEmailIdRequest(state, action) {
      state.mouApprovedEmailId.status = STATE_STATUS.FETCHING;
      state.mouApprovedEmailId.data = {};
    },
    getMouApprovedEmailIdSuccess(state, action) {
      // console.log(action, '//');

      state.mouApprovedEmailId.status = STATE_STATUS.FETCHED;
      state.mouApprovedEmailId.data = action.payload;
    },
    getMouApprovedEmailIdFailure(state, action) {
      state.mouApprovedEmailId.status = STATE_STATUS.FAILED_FETCH;
    },
    getMouAllStatusRequest(state, action) {
      state.mouAllStatus.status = STATE_STATUS.FETCHING;
      state.mouAllStatus.data = {};
    },
    getMouAllStatusSuccess(state, action) {
      // console.log(action, '//');

      state.mouAllStatus.status = STATE_STATUS.FETCHED;
      state.mouAllStatus.data = action.payload;
    },
    getMouAllStatusFailure(state, action) {
      state.mouAllStatus.status = STATE_STATUS.FAILED_FETCH;
    },
    getMouCreatorNameRequest(state, action) {
      state.mouCreatorName.status = STATE_STATUS.FETCHING;
      state.mouCreatorName.data = {};
    },
    getMouCreatorNameSuccess(state, action) {
      //  console.log(action, '');

      state.mouCreatorName.status = STATE_STATUS.FETCHED;
      state.mouCreatorName.data = action.payload;
    },
    getMouCreatorNameFailure(state, action) {
      state.mouCreatorName.status = STATE_STATUS.FAILED_FETCH;
    },
    getNfaCustomerListRequest(state, action) {
      state.nfaCustomerList.status = STATE_STATUS.FETCHING;
      state.nfaCustomerList.data = {};
    },
    getNfaCustomerListSuccess(state, action) {
      state.nfaCustomerList.status = STATE_STATUS.FETCHED;
      state.nfaCustomerList.data = action.payload;
    },
    getNfaCustomerListFailure(state, action) {
      state.nfaCustomerList.status = STATE_STATUS.FAILED_FETCH;
    },
    getNfaApproverIdListRequest(state, action) {
      state.nfaApproverId.status = STATE_STATUS.FETCHING;
      state.nfaApproverId.data = {};
    },
    getNfaApproverIdListSuccess(state, action) {
      state.nfaApproverId.status = STATE_STATUS.FETCHED;
      state.nfaApproverId.data = action.payload;
    },
    getNfaApproverIdListFailure(state, action) {
      state.nfaApproverId.status = STATE_STATUS.FAILED_FETCH;
    },
    getNfaRequest(state, action) {
      state.getNfa.status = STATE_STATUS.FETCHING;
      state.getNfa.data = {};
    },
    getNfaSuccess(state, action) {
      state.getNfa.status = STATE_STATUS.FETCHED;
      state.getNfa.data = action.payload;
    },
    getNfaFailure(state, action) {
      state.getNfa.status = STATE_STATUS.FAILED_FETCH;
    },
    getDraftMouRequest(state, action) {
      state.draftMou.status = STATE_STATUS.FETCHING;
      state.draftMou.data = {};
    },
    getDraftMouSuccess(state, action) {
      state.draftMou.status = STATE_STATUS.FETCHED;
      state.draftMou.data = action.payload;
    },
    getDraftMouFailure(state, action) {
      state.draftMou.status = STATE_STATUS.FAILED_FETCH;
    },
    getFetchDraftMouRequest(state, action) {
      const page = action.payload.page || 1;
      console.log('pagae is', page);

      state.fetchDraftMou.status = STATE_STATUS.FETCHING;
      state.fetchDraftMou.data = page === 1 ? [] : state.fetchDraftMou.data;
      state.fetchDraftMou.currentPage = page;
    },
    getFetchDraftMouSuccess(state, action) {
      state.fetchDraftMou.status = STATE_STATUS.FETCHED;
      state.fetchDraftMou.data = state.fetchDraftMou.data.concat(action.payload.data);
      state.fetchDraftMou.totalPages = action.payload.totalPages;
    },
    getFetchDraftMouFailure(state, action) {
      state.fetchDraftMou.status = STATE_STATUS.FAILED_FETCH;
    },
  },
});

export const {
  getMouListFailure,
  getMouListRequest,
  getMouListSuccess,
  getNFAListFailure,
  getNFAListRequest,
  getNFAListSuccess,
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
  getNfaCustomerListFailure, getNfaCustomerListRequest, getNfaCustomerListSuccess,
  getNfaApproverIdListFailure,
  getNfaApproverIdListRequest,
  getNfaApproverIdListSuccess,
  getNfaFailure,
  getNfaRequest,
  getNfaSuccess,
  getDraftMouRequest,
  getDraftMouSuccess,
  getDraftMouFailure,
  getFetchDraftMouFailure,
  getFetchDraftMouRequest,
  getFetchDraftMouSuccess,
  setCurrentTab,

} = mouSlice.actions;

export default mouSlice.reducer;

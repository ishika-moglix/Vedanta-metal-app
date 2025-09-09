import { createSlice } from '@reduxjs/toolkit';
import { STATE_STATUS } from '../constants';

const customerRegSlice = createSlice({
    name: 'customerRegistration',
    initialState: {
        customerListing: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
            currentPage: 0,
        },
        plantRequests: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },
        getAllByCompany: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },
        getByCompany: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },
        userGet: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },
        companyGet:{
            status: STATE_STATUS.UNFETCHED,
            data: [],
        },
        getDetails: {
            status: STATE_STATUS.UNFETCHED,
            data: [],
        }
    },
    reducers: {
        getCustomerListingRequest(state, action) {
            console.log('customerListing action', action);
            const page = action.payload.page || 1;
            console.log('pagae is', page);
            state.customerListing.status = STATE_STATUS.FETCHING;
            state.customerListing.data = page === 1 ? [] : state.customerListing.data;
            state.customerListing.currentPage = page;
        },
        getCustomerListingSuccess(state, action) {
            state.customerListing.status = STATE_STATUS.FETCHED;
            state.customerListing.data = state.customerListing.data.concat(action.payload.data);
            state.customerListing.totalPages = action.payload.totalPages;
        },
        getCustomerListingFailure(state, action) {
            state.customerListing.status = STATE_STATUS.FAILED_FETCH;
        },
        getPlantRequestsRequest(state, action) {
            console.log('plantRequests action', action);
            state.plantRequests.status = STATE_STATUS.FETCHING;
            state.plantRequests.data = {};
        },
        getPlantRequestsSuccess(state, action) {
            state.plantRequests.status = STATE_STATUS.FETCHED;
            state.plantRequests.data = action.payload;
        },
        getPlantRequestsFailure(state, action) {
            state.plantRequests.status = STATE_STATUS.FAILED_FETCH;
        },
        getAllByCompanyRequest(state, action) {
            console.log('getAllByCompany action', action);
            state.getAllByCompany.status = STATE_STATUS.FETCHING;
            state.getAllByCompany.data = {};
        },
        getAllByCompanySuccess(state, action) {
            state.getAllByCompany.status = STATE_STATUS.FETCHED;
            state.getAllByCompany.data = action.payload;
        },
        getAllByCompanyFailure(state, action) {
            state.getAllByCompany.status = STATE_STATUS.FAILED_FETCH;
        },
        getByCompanyRequest(state, action) {
            console.log('getByCompany action', action);
            const page = action.payload.page || 1;
            console.log('getByCompany page is', page);
            state.getByCompany.status = STATE_STATUS.FETCHING;
            state.getByCompany.data = page === 1 ? [] : state.getByCompany.data;
            state.getByCompany.currentPage = page;
        },
        getByCompanySuccess(state, action) {
            state.getByCompany.status = STATE_STATUS.FETCHED;
            state.getByCompany.data = state.getByCompany.data.concat(action.payload.data);
            state.getByCompany.totalPages = action.payload.totalPages;
        },
        getByCompanyFailure(state, action) {
            state.getByCompany.status = STATE_STATUS.FAILED_FETCH;
        },
        userGetRequest(state, action) {
            console.log('userGet action', action);
            state.userGet.status = STATE_STATUS.FETCHING;
            state.userGet.data = {};
        },
        userGetSuccess(state, action) {
            state.userGet.status = STATE_STATUS.FETCHED;
            state.userGet.data = action.payload;
        },
        userGetFailure(state, action) {
            state.userGet.status = STATE_STATUS.FAILED_FETCH;
        },
        companyGetRequest(state, action) {
            console.log('companyGet action', action);
            state.companyGet.status = STATE_STATUS.FETCHING;
            state.companyGet.data = {};
        },
        companyGetSuccess(state, action) {
            state.companyGet.status = STATE_STATUS.FETCHED;
            state.companyGet.data = action.payload;
        },
        companyGetFailure(state, action) {
            state.companyGet.status = STATE_STATUS.FAILED_FETCH;
        },
        getDetailsRequest(state, action) {
            console.log('getDetailsRequest action', action);
            state.getDetails.status = STATE_STATUS.FETCHING;
            state.getDetails.data = {};
        },
        getDetailsSuccess(state, action) {
            state.getDetails.status = STATE_STATUS.FETCHED;
            state.getDetails.data = action.payload;
        },
        getDetailsFailure(state, action) {
            state.getDetails.status = STATE_STATUS.FAILED_FETCH;
        },
    },
});

export const {
    getCustomerListingFailure,
    getCustomerListingRequest,
    getCustomerListingSuccess,
    getPlantRequestsFailure,
    getPlantRequestsRequest,
    getPlantRequestsSuccess,
    getAllByCompanyFailure,
    getAllByCompanySuccess,
    getByCompanySuccess,
    getAllByCompanyRequest,
    getByCompanyFailure,
    getByCompanyRequest,
    companyGetFailure,
    companyGetRequest,
    companyGetSuccess,
    userGetFailure,
    userGetRequest,
    userGetSuccess,
    getDetailsFailure,
    getDetailsRequest,
    getDetailsSuccess
} = customerRegSlice.actions;

export default customerRegSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';
import { STATE_STATUS } from '../constants';

const dispatchDetailsSlice = createSlice({
  name: 'dispatchdetails',
  initialState: {
    dispatchDetails: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
      currentPage: 0,
    },
    plantsRegion: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
    }
  },
  reducers: {
    getDispatchDetailsRequest(state, action) {
      console.log('dispatch action', action);
      const page = action.payload.page || 1;
      state.dispatchDetails.status = STATE_STATUS.FETCHING;
      state.dispatchDetails.data = page === 1 ? [] : state.dispatchDetails.data;
      state.dispatchDetails.currentPage = page;
    },
    getDispatchDetailsSuccess(state, action) {
      state.dispatchDetails.status = STATE_STATUS.FETCHED;
      state.dispatchDetails.data = state.dispatchDetails.data.concat(
        action.payload.data,
      );
      state.dispatchDetails.totalPages = action.payload.totalPages;
    },
    getDispatchDetailsFailure(state, action) {
      state.dispatchDetails.status = STATE_STATUS.FAILED_FETCH;
    },
    getRegionByPlantsRequest(state, action) {
      state.plantsRegion.status = STATE_STATUS.FETCHING;
      state.plantsRegion.data = {};
    },
    getRegionByPlantsSuccess(state, action) {
      state.plantsRegion.status = STATE_STATUS.FETCHED;
      state.plantsRegion.data = action.payload;
    },
    getRegionByPlantsFailure(state, action) {
      state.plantsRegion.status = STATE_STATUS.FAILED_FETCH;
    },
    setCurrentTab(state, action) {
      state.currentTab = action.payload;
    },
  },
});

export const {
  getDispatchDetailsFailure,
  getDispatchDetailsRequest,
  getDispatchDetailsSuccess,
  getRegionByPlantsFailure,
  getRegionByPlantsRequest,
  getRegionByPlantsSuccess,
  setCurrentTab,
} = dispatchDetailsSlice.actions;

export default dispatchDetailsSlice.reducer;

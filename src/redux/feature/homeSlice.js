import { createSlice } from '@reduxjs/toolkit';
import { STATE_STATUS } from '../constants';

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    wallet: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
    },
    walletLCBG: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
    },
    session: {
      status: STATE_STATUS.UNFETCHED,
      data: [],
    },
    searchPlants: {
      status: STATE_STATUS.UNFETCHED,
      // plantId: 0,
      data: [],
    },
    cartCount: {
      status: STATE_STATUS.UNFETCHED,
      count: 0,
    }
  },
  reducers: {
    getCreditBalanceRequest(state, action) {
      state.wallet.status = STATE_STATUS.FETCHING;
      state.wallet.data = {};
    },
    getCreditBalanceSuccess(state, action) {
      // console.log(action, '//');

      state.wallet.status = STATE_STATUS.FETCHED;
      state.wallet.data = action.payload;
    },
    getCreditBalanceFailure(state, action) {
      state.wallet.status = STATE_STATUS.FAILED_FETCH;
    },
    getLCBGBalanceRequest(state, action) {
      state.walletLCBG.status = STATE_STATUS.FETCHING;
      state.walletLCBG.data = {};
    },
    getLCBGBalanceSuccess(state, action) {
      // console.log(action, '//');

      state.walletLCBG.status = STATE_STATUS.FETCHED;
      state.walletLCBG.data = action.payload;
    },
    getLCBGBalanceFailure(state, action) {
      state.walletLCBG.status = STATE_STATUS.FAILED_FETCH;
    },
    getSessionRequest(state, action) {
      state.session.status = STATE_STATUS.FETCHING;
      state.session.data = {};
    },
    getSessionSuccess(state, action) {
      state.session.status = STATE_STATUS.FETCHED;
      state.session.data = action.payload;
    },
    getSessionFailure(state, action) {
      state.searchPlants.status = STATE_STATUS.FAILED_FETCH;
    },
    getSearchPlantRequest(state, action) {
      state.searchPlants.status = STATE_STATUS.FETCHING;
      // state.searchPlants.plantId = 0;
      state.searchPlants.data = {};
    },
    getSearchPlantSuccess(state, action) {
      console.log(action, 'search plant ');

      state.searchPlants.status = STATE_STATUS.FETCHED;
      // state.searchPlants.plantId = action.payload.plantId;
      state.searchPlants.data = action.payload;
    },
    getSearchPlantFailure(state, action) {
      state.searchPlants.status = STATE_STATUS.FAILED_FETCH;
    },
    // getCartCountRequest(state, action) {
    //   state.cartCount.status = STATE_STATUS.FETCHING;
    //   state.cartCount.data = {};
    // },
    // getCartCountSuccess(state, action) {
    //   state.cartCount.status = STATE_STATUS.FETCHED;
    //   state.cartCount.data = action.payload;
    // },
    // getCartCountFailure(state, action) {
    //   state.cartCount.status = STATE_STATUS.FAILED_FETCH;
    // },
    setCartCount: (state, action) => {
      console.log("cart count state", state, action);
      state.cartCount.status = action?.payload?.status;
      state.cartCount.count = action?.payload?.count;
    },
    resetHomeState(state) {
      state.wallet = {
        status: STATE_STATUS.UNFETCHED,
        data: [],
      };
      state.walletLCBG = {
        status: STATE_STATUS.UNFETCHED,
        data: [],
      };
      state.session = {
        status: STATE_STATUS.UNFETCHED,
        data: [],
      };
      state.searchPlants = {
        status: STATE_STATUS.UNFETCHED,
        data: [],
      };
    },
  }
});

export const {
  getCreditBalanceFailure,
  getCreditBalanceRequest,
  getCreditBalanceSuccess,
  getSessionFailure,
  getSessionRequest,
  getSessionSuccess,
  getSearchPlantFailure,
  getSearchPlantRequest,
  getSearchPlantSuccess,
  getLCBGBalanceFailure,
  getLCBGBalanceRequest,
  getLCBGBalanceSuccess,
  setCartCount,
  resetHomeState
} = homeSlice.actions;
export default homeSlice.reducer;

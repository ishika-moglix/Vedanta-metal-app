import {createSlice} from '@reduxjs/toolkit';
import {STATE_STATUS} from '../constants';
const branchAccessSlice = createSlice({
  name: 'branchAccess',
  initialState: {
    data: {},
    status: STATE_STATUS.UNFETCHED,
    isCustomer: undefined,
  },
  reducers: {
    setBranchAccess: (state, action) => {
      console.log('action branch', action);

      state.status = action?.payload?.status;
      state.data = action?.payload?.data;
      state.isCustomer = action?.payload?.isCustomer;
    },
  },
});

export const {setBranchAccess} = branchAccessSlice.actions;
export default branchAccessSlice?.reducer;

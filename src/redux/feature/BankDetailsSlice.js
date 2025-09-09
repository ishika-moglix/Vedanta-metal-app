import { createSlice } from "@reduxjs/toolkit";
import { STATE_STATUS } from "../constants";
const bankDetailsSlice = createSlice({
    name: "bankDetails",
    initialState: {
      data: {},
      status: STATE_STATUS.UNFETCHED,
    },
    reducers: {
        setBankDetails: (state, action) => {
        state.data = action?.payload?.data;
        state.status = action?.payload?.status;
      },
    },
  });
  
  export const { setBankDetails } = bankDetailsSlice.actions;
  export default bankDetailsSlice?.reducer;
  
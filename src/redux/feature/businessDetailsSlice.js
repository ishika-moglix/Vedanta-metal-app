import { createSlice } from "@reduxjs/toolkit";
import { STATE_STATUS } from "../constants";
import { act } from "react";
const businessDetailsSlice = createSlice({
    name: "businessDetails",
    initialState: {
      data: {},
      status: STATE_STATUS.UNFETCHED,
    },
    reducers: {
      setBusinessDetails: (state, action) => {      
        state.status = action?.payload?.status;
        state.data = action?.payload?.data;
      },
    },
  });
  
  export const { setBusinessDetails } = businessDetailsSlice.actions;
  export default businessDetailsSlice?.reducer;
  
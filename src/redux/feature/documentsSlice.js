import { createSlice } from "@reduxjs/toolkit";
import { STATE_STATUS } from "../constants";
const documentsSlice = createSlice({
    name: "bankDetails",
    initialState: {
      data: {},
      status: STATE_STATUS.UNFETCHED,
    },
    reducers: {
        setDocumentDetails: (state, action) => {
        state.data = action.payload;
        state.status = STATE_STATUS.FETCHED;
      },
    },
  });
  
  export const { setDocumentDetails } = documentsSlice.actions;
  export default documentsSlice?.reducer;
  
import { createSlice } from "@reduxjs/toolkit";
import { STATE_STATUS } from "../constants";
const authSlice = createSlice({
  name: "auth",
  initialState: {   
      data: {},
      status: STATE_STATUS.UNFETCHED,
      isLoggedIn: false,
  },
  reducers: {
    setAuth: (state, action) => {
      state.status = action?.payload?.status;
      state.data = action?.payload?.data;
      state.isLoggedIn = action?.payload?.isLoggedIn;
    },
  },
});


export const { setAuth } = authSlice.actions;
export default authSlice?.reducer;

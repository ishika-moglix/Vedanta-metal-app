import { createSlice } from "@reduxjs/toolkit";
import { STATE_STATUS } from "../constants";
const notificationSlice = createSlice({
  name: "notification",
  initialState: {   
      data: {},
      status: STATE_STATUS.UNFETCHED,
      notiCount: 0,
  },
  reducers: {
    setNotiCount: (state, action) => {
      state.status = action?.payload?.status;
      state.data = action?.payload?.data;
      state.notiCount = action?.payload?.notiCount;
    },
  },
});


export const { setNotiCount } = notificationSlice.actions;
export default notificationSlice?.reducer;

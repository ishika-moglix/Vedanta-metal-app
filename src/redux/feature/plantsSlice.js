import { createSlice } from "@reduxjs/toolkit";
import { STATE_STATUS } from "../constants";
const plantDetailsSlice = createSlice({
  name: 'plantDetails',
  initialState: {
    data: {},
    status: STATE_STATUS.UNFETCHED,
  },
  reducers: {
    setPlantDetails: (state, action) => {
      state.status = action?.payload?.status;
      state.data = action?.payload?.data;
    },
  },
});
  
  export const { setPlantDetails } = plantDetailsSlice.actions;
  export default plantDetailsSlice?.reducer;
  
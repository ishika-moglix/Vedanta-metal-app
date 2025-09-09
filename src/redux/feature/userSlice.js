import { createSlice } from '@reduxjs/toolkit';
import { STATE_STATUS } from '../constants';

const userSlice = createSlice({
  name: "user",
  initialState: {
    status: STATE_STATUS.UNFETCHED, 
    data: null,                   
                   
  },
  reducers: {
    setUser: (state, action) => {
      state.auth.status = action?.payload?.status;
      state.auth.data = action?.payload?.data;
    },
  },
});

export const { setUser} = userSlice.actions;
export default userSlice.reducer;




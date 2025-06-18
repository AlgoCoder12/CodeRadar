import { createSlice } from "@reduxjs/toolkit";

const initialState = { // no user initially 
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth", // require name iniital state and reducer 
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
    },

    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions; // all reducer are called action in the function 

export default authSlice.reducer;

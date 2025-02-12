import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  userId: "67ab741b4ed113b4940fac28", // Make sure this matches your admin user ID
  user: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const { setMode, setUser, setUserId } = globalSlice.actions;

export default globalSlice.reducer;

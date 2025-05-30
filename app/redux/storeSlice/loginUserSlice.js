import { createSlice } from "@reduxjs/toolkit";

export const loginUserSlice = createSlice({
  name: "loginUserSlice",
  initialState: {
    value: { username: "", tableNumber: "" },
  },
  reducers: {
    loginUserRedux: (state, action) => {
      state.value = action.payload;
    },

    updateTableNumberRedux: (state, action) => {
      state.value.tableNumber = action.payload;
    },

    logoutUserRedux: (state, action) => {
      state.value = { username: "", tableNumber: "" };
    },
  },
});

// Action funtion exports
export const { loginUserRedux, logoutUserRedux, updateTableNumberRedux } =
  loginUserSlice.actions;

export default loginUserSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

export const tableSlice = createSlice({
  name: "selectTable",
  initialState: {
    value: [],
  },
  reducers: {
    addItem: (state, action) => {},

    removeItem: (state, action) => {},
  },
});

// Action funtion exports
export const { addItem, removeItem } = tableSlice.actions;

export default tableSlice.reducer;

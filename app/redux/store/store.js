import { configureStore } from "@reduxjs/toolkit";
import tableReducer from "../storeSlice/tableSlice";

export default configureStore({
  reducer: {
    selectedTable: tableReducer,
  },
});

import { configureStore } from "@reduxjs/toolkit";
import loginUserSliceReducer from "../storeSlice/loginUserSlice";

export default configureStore({
  reducer: {
    selectedUser: loginUserSliceReducer,
  },
});

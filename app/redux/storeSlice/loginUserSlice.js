import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  const defaultState = {
    value: { username: "", tableNumber: "" },
    isHydrated: false,
  };

  if (typeof window === "undefined") {
    return defaultState;
  }

  try {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.username && userData.username.trim() !== "") {
        return {
          value: userData,
          isHydrated: true,
        };
      }
    }
  } catch (error) {
    console.error("Error loading user data from localStorage:", error);
  }

  return defaultState;
};

export const loginUserSlice = createSlice({
  name: "loginUserSlice",
  initialState: getInitialState(),
  reducers: {
    loginUserRedux: (state, action) => {
      state.value = action.payload;
      state.isHydrated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },

    updateTableNumberRedux: (state, action) => {
      state.value.tableNumber = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(state.value));
      }
    },

    logoutUserRedux: (state, action) => {
      state.value = { username: "", tableNumber: "" };
      state.isHydrated = true;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },

    hydrateUserRedux: (state, action) => {
      if (
        action.payload &&
        action.payload.username &&
        action.payload.username.trim() !== ""
      ) {
        state.value = action.payload;
      }
      state.isHydrated = true;
    },
  },
});

export const {
  loginUserRedux,
  logoutUserRedux,
  updateTableNumberRedux,
  hydrateUserRedux,
} = loginUserSlice.actions;

export default loginUserSlice.reducer;

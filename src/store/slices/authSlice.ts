import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  adminToken: string | null;
};

const initialState: AuthState = {
  adminToken: localStorage.getItem("adminToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdminToken(state, action: PayloadAction<string>) {
      state.adminToken = action.payload;
      localStorage.setItem("adminToken", action.payload);
    },
    clearAdminToken(state) {
      state.adminToken = null;
      localStorage.removeItem("adminToken");
    },
  },
});

export const { setAdminToken, clearAdminToken } = authSlice.actions;
export default authSlice.reducer;

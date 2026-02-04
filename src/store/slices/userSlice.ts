import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AdminUser = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

type UserState = {
  admin: AdminUser | null;
};

const initialState: UserState = {
  admin: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAdmin(state, action: PayloadAction<AdminUser>) {
      state.admin = action.payload;
    },
    clearAdmin(state) {
      state.admin = null;
    },
  },
});

export const { setAdmin, clearAdmin } = userSlice.actions;
export default userSlice.reducer;

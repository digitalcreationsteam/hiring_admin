import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OnboardingState = {
  step: number;
};

const initialState: OnboardingState = {
  step: 1,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },
    resetOnboarding() {
      return initialState;
    },
  },
});

export const { setStep, resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;

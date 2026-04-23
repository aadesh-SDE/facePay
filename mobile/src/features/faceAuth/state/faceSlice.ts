import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FaceState, VerifyStatus } from "@/features/faceAuth/types/face.types";
import { loadDescriptorThunk, registerFaceThunk } from "@/features/faceAuth/state/faceThunks";

const initialState: FaceState = {
  registered: false,
  descriptor: null,
  verifyStatus: "idle",
  blinkCount: 0,
  attempts: 0,
  maxAttempts: 3,
  error: null,
};

const faceSlice = createSlice({
  name: "face",
  initialState,
  reducers: {
    setVerifyStatus(state, action: PayloadAction<VerifyStatus>) {
      state.verifyStatus = action.payload;
    },
    incrementBlinkCount(state) {
      state.blinkCount++;
    },
    resetBlinkCount(state) {
      state.blinkCount = 0;
    },
    incrementAttempts(state) {
      state.attempts++;
    },
    resetVerification(state) {
      state.verifyStatus = "idle";
      state.blinkCount = 0;
    },
    resetAllFaceState() {
      return { ...initialState };
    },
    clearFaceError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerFaceThunk.pending, (state) => {
        state.verifyStatus = "scanning";
        state.error = null;
      })
      .addCase(registerFaceThunk.fulfilled, (state, action) => {
        state.descriptor = action.payload;
        state.registered = true;
        state.verifyStatus = "success";
        state.error = null;
      })
      .addCase(registerFaceThunk.rejected, (state, action) => {
        state.verifyStatus = "failed";
        state.error = action.payload ?? "Registration failed";
      })
      .addCase(loadDescriptorThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.descriptor = action.payload;
          state.registered = true;
        }
      });
  },
});

export const {
  setVerifyStatus,
  incrementBlinkCount,
  resetBlinkCount,
  incrementAttempts,
  resetVerification,
  resetAllFaceState,
  clearFaceError,
} = faceSlice.actions;
export const faceReducer = faceSlice.reducer;

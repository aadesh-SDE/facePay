import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/state/authSlice";
import faceReducer from "@/features/faceAuth/state/faceSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  face: faceReducer,
});

import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/state/authSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
});

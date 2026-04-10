import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/state/authSlice";
import faceReducer from "@/features/faceAuth/state/faceSlice";
import walletReducer from "@/features/wallet/state/walletSlice";
import homeReducer from "@/features/home/state/homeSlice";
import sendReducer from "@/features/send/state/sendSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  face: faceReducer,
  wallet: walletReducer,
  home: homeReducer,
  send: sendReducer,
});

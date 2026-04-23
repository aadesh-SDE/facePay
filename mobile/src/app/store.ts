import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import { authReducer } from "@/features/auth/state/authSlice";
import { homeReducer } from "@/features/home/state/homeSlice";
import { walletReducer } from "@/features/wallet/state/walletSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  home: homeReducer,
  wallet: walletReducer,
});

const persistConfig = {
  key: "facepay-root",
  storage: AsyncStorage,
  /** Auth token lives in SecureStore only; cache home/wallet for UX (optional). */
  whitelist: ["home", "wallet"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

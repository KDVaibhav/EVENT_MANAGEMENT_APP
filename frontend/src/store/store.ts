import { configureStore } from "@reduxjs/toolkit";
import profileSlice from "../features/profile/profileSlice";
import { profileApi } from "../features/profile/profileApi";
import uiSlice from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    profile: profileSlice,
    ui: uiSlice,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(profileApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

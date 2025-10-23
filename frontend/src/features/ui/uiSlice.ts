import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export enum NotificationType {
  EVENT_CREATION = "EVENT_CREATION",
  EVENT_UPDATION = "EVENT_UPDATION",
  PROFILE_CREATION = "PROFILE_CREATION",
}

export enum Status {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface Notification {
  type: NotificationType;
  description: string;
  status: Status;
}

interface uiState {
  notification: Notification[] | [];
}

const initialState: uiState = {
  notification: [],
};

export const uiSlice = createSlice({
  name: "Ui",
  initialState: initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<Notification>) => {
      state.notification = [action.payload];
    },
    clearNotification: (state) => {
      state.notification = [];
    },
  },
});

export const { setNotification, clearNotification } = uiSlice.actions;

export default uiSlice.reducer;

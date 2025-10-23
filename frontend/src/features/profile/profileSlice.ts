import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Log {
  _id: string;
  dateTime: string;
  description: string;
}

export interface ProfileEvent {
  _id?: string;
  timeZone: string;
  startDateTime: string;
  endDateTime: string;
  profileIds: string[] | Profile[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  _id: string;
  profileName: string;
}

interface ProfileState {
  currentProfile: Profile | null;
  profiles: Profile[] | [];
  profileEvents: ProfileEvent[] | [];
  eventLogs: Log[] | [];
}

const initialState: ProfileState = {
  currentProfile: null,
  profiles: [],
  profileEvents: [],
  eventLogs: [],
};

const profileSlice = createSlice({
  name: "Profile",
  initialState: initialState,
  reducers: {
    setCurrentProfile: (state, action: PayloadAction<{ profile: Profile }>) => {
      state.currentProfile = action.payload.profile;
    },
    addProfiles: (state, action: PayloadAction<Profile[]>) => {
      state.profiles = [...state.profiles, ...action.payload];
    },
    setProfiles: (state, action: PayloadAction<Profile[]>) => {
      state.profiles = action.payload;
    },
    addProfileEvents: (state, action: PayloadAction<ProfileEvent[]>) => {
      state.profileEvents = [...state.profileEvents, ...action.payload];
    },
    setProfileEvents: (state, action: PayloadAction<ProfileEvent[]>) => {
      state.profileEvents = action.payload;
    },
    addEventLogs: (state, action: PayloadAction<Log[]>) => {
      state.eventLogs = [...state.eventLogs, ...action.payload];
    },
    setEventLogs: (state, action: PayloadAction<Log[]>) => {
      state.eventLogs = action.payload;
    },
  },
});

export const {
  setCurrentProfile,
  addProfiles,
  setProfiles,
  addProfileEvents,
  setProfileEvents,
  addEventLogs,
  setEventLogs,
} = profileSlice.actions;
export default profileSlice.reducer;

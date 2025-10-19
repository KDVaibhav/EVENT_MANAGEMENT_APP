import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Log {
  _id: string;
  dateTime: Date;
  description: string;
}

export interface Event {
  _id: string;
  timeZone: string;
  startDateTime: Date;
  EndDateTime: Date;
  ProfileIds: string[];
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
  profileEvents: Event[] | [];
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
    setCurrentProfile: (state, action: PayloadAction<Profile>) => {
      state.currentProfile = action.payload;
    },
    addProfiles: (state, action: PayloadAction<Profile[]>) => {
      state.profiles = [...state.profiles, ...action.payload];
    },
    setProfiles: (state, action: PayloadAction<Profile[]>) => {
      state.profiles = action.payload;
    },
    setProfileEvents: (state, action: PayloadAction<Event[]>) => {
      state.profileEvents = action.payload;
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
  setProfileEvents,
  setEventLogs,
} = profileSlice.actions;
export default profileSlice.reducer;

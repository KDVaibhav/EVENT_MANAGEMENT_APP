import { createApi } from "@reduxjs/toolkit/query/react";
import { rtkBaseQuery } from "../../lib/rtkBaseQuery";
import {
  setProfiles,
  setEventLogs,
  setProfileEvents,
  addProfiles,
  addProfileEvents,
  addEventLogs,
  type ProfileEvent,
} from "./profileSlice";

export const profileApi = createApi({
  reducerPath: "ProfileApi",
  baseQuery: rtkBaseQuery,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getProfiles: builder.query<any, { searchTerm?: string; skip?: number }>({
      query: ({ searchTerm = "", skip = 0 }) =>
        `/profile?searchTerm=${searchTerm}&skip=${skip}&limit=10`,
      async onQueryStarted({ skip }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (skip && skip > 0) dispatch(addProfiles(data.profiles));
          else dispatch(setProfiles(data.profiles));
        } catch (error) {
          console.error("Error fetching Profiles", error);
        }
      },
    }),

    availableProfile: builder.query<boolean, string>({
      query: (name: string) => `/availableProfileName/?searchTerm=${name}`,
      transformResponse: (response: { exists: boolean }) => response.exists,
    }),

    createProfile: builder.mutation<any, string>({
      query: (profileName) => ({
        url: "/profile",
        method: "POST",
        data: { profileName },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProfiles(data.profiles));
        } catch (error) {
          console.error("Error Creating Event", error);
        }
      },
    }),

    getProfileEvents: builder.query<any, any>({
      query: ({ profileId, skip = 0 }) => `/events/${profileId}?skip=${skip}`,
      async onQueryStarted({ skip }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (skip && skip > 0) dispatch(addProfileEvents(data.profileEvents));
          dispatch(setProfileEvents(data.profileEvents));
        } catch (error) {
          console.error("Error fetching Profile Events", error);
        }
      },
    }),

    createEvent: builder.mutation<any, ProfileEvent>({
      query: (data) => ({
        url: `/event`,
        method: "POST",
        data: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProfileEvents(data.profileEvents));
        } catch (error) {
          console.error("Error Updating Event", error);
        }
      },
    }),
    editEvent: builder.mutation<any, any>({
      query: (data) => ({
        url: `/event/${data.eventId}`,
        method: "PUT",
        data: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProfileEvents(data.profileEvents));
        } catch (error) {
          console.error("Error Updating Event", error);
        }
      },
    }),
    getEventLogs: builder.query<any, any>({
      query: ({ eventId, skip = 0 }) => `/event/${eventId}/logs?skip=${skip}`,
      async onQueryStarted({ skip }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (skip && skip > 0) dispatch(addEventLogs(data.eventLogs));
          dispatch(setEventLogs(data.eventLogs));
        } catch (error) {
          console.error("Error Fetching Logs", error);
        }
      },
    }),
  }),
});

export const {
  useGetProfilesQuery,
  useAvailableProfileQuery,
  useCreateProfileMutation,
  useGetProfileEventsQuery,
  useLazyGetProfileEventsQuery,
  useCreateEventMutation,
  useEditEventMutation,
  useGetEventLogsQuery,
} = profileApi;

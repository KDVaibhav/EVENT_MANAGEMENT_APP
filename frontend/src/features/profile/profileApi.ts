import { createApi } from "@reduxjs/toolkit/query/react";
import { rtkBaseQuery } from "../../lib/rtkBaseQuery";
import {
  setProfiles,
  setEventLogs,
  setProfileEvents,
  type Profile,
  addProfiles,
} from "./profileSlice";

export const profileApi = createApi({
  reducerPath: "ProfileApi",
  baseQuery: rtkBaseQuery,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getProfiles: builder.query<any, { searchTerm?: string; skip?: number }>({
      query: ({ searchTerm = "", skip = 0 }) =>
        `/profile?searchTerm=${searchTerm}&skip=${skip}&limit=10`,
      async onQueryStarted({ searchTerm, skip }, { dispatch, queryFulfilled }) {
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
      query: (profileId) => `/profile/events/${profileId}`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProfileEvents(data.events));
        } catch (error) {
          console.error("Error fetching Profile Events", error);
        }
      },
    }),

    createProfileEvent: builder.mutation<any, any>({
      query: (data) => ({
        url: `/events`,
        method: "POST",
        data: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProfileEvents(data.events));
        } catch (error) {
          console.error("Error Updating Event", error);
        }
      },
    }),
    updateProfileEvent: builder.mutation<any, any>({
      query: ({ eventId, data }) => ({
        url: `/events/${eventId}`,
        method: "PUT",
        data: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setProfileEvents(data.events));
        } catch (error) {
          console.error("Error Updating Event", error);
        }
      },
    }),
    getEventLogs: builder.query<any, any>({
      query: (eventId) => `/events/${eventId}/logs`,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setEventLogs(data.logs));
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
  useCreateProfileEventMutation,
  useUpdateProfileEventMutation,
  useGetEventLogsQuery,
} = profileApi;

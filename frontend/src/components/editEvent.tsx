import React, { useEffect, useState } from "react";
import type { ProfileEvent } from "../features/profile/profileSlice";
import { X } from "lucide-react";
import { ProfileDropDown } from "./profileDropDown";
import { useEditEventMutation } from "../features/profile/profileApi";
import { TimeZoneDropDown } from "./timeZoneDropDown";
import { StartDatePicker } from "./startDatePicker";
import { EndDatePicker } from "./endDatePicker";
import { convertTZ, localToTimezone } from "../lib/dateUtils";
import { useDispatch } from "react-redux";
import {
  NotificationType,
  setNotification,
  Status,
} from "../features/ui/uiSlice";
import { useAppSelector } from "../store/hook";

export const EditEvent = ({
  profileEvent,
  setIsEditModalOpen,
}: {
  profileEvent: ProfileEvent;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useDispatch();
  const [editEventError, setEditEventError] = useState("");
  // @ts-ignore
  const profileIds = profileEvent.profileIds.map((profileId) => profileId._id);
  const [selectedProfileIds, setSelectedProfileIds] =
    useState<string[]>(profileIds);
  const [selectedTimeZone, setSelectedTimeZone] = useState(
    profileEvent.timeZone
  );
  const [startDateTime, setStartDateTime] = useState<Date>(
    convertTZ(profileEvent.startDateTime, selectedTimeZone)
  );
  const [endDateTime, setEndDateTime] = useState<Date>(
    convertTZ(profileEvent.endDateTime, selectedTimeZone)
  );
  const [editEvent, { isLoading: editEventLoading }] = useEditEventMutation();
  const currentProfile = useAppSelector(
    (state) => state.profile.currentProfile
  );

  useEffect(() => {
    setStartDateTime(convertTZ(profileEvent.startDateTime, selectedTimeZone));
    setEndDateTime(convertTZ(profileEvent.endDateTime, selectedTimeZone));
  }, [selectedTimeZone]);

  const validateForm = (): string | null => {
    if (selectedProfileIds.length === 0) {
      return "Select at least one profile";
    }

    if (!selectedTimeZone) {
      return "Select a timezone";
    }

    if (!startDateTime || !endDateTime) {
      return "Select both start and end date/time";
    }

    if (startDateTime >= endDateTime) {
      return "End date/time must be after start date/time";
    }

    return null;
  };
  const handleEditEvent = async (e: any) => {
    e.preventDefault();
    setEditEventError("");

    const validationError = validateForm();
    if (validationError) {
      setEditEventError(validationError);
      return;
    }

    const editEventPayload: ProfileEvent = {
      timeZone: selectedTimeZone,
      startDateTime: localToTimezone(startDateTime, selectedTimeZone),
      endDateTime: localToTimezone(endDateTime, selectedTimeZone),
      profileIds: selectedProfileIds,
      createdBy: profileEvent.createdBy,
      createdAt: localToTimezone(
        new Date(profileEvent.createdAt),
        selectedTimeZone
      ),
      updatedAt: localToTimezone(new Date(), selectedTimeZone),
    };

    const payload = {
      eventId: profileEvent._id,
      ...editEventPayload,
      currentProfileId: currentProfile!._id,
    };
    try {
      await editEvent(payload).unwrap();

      dispatch(
        setNotification({
          type: NotificationType.EVENT_UPDATION,
          description: "Event updated successfully",
          status: Status.SUCCESS,
        })
      );
      setEditEventError("");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update events:", error);
      dispatch(
        setNotification({
          type: NotificationType.EVENT_CREATION,
          description: "Error updating Event",
          status: Status.FAILED,
        })
      );
      setEditEventError("Error updating Event");
    }
  };

  return (
    <div className="bg-white max-w-72 p-4 w-screen rounded-md  h-fit sm:max-w-96">
      <div className="flex justify-between items-center">
        <span className="font-bold">Edit Event</span>
        <button
          onClick={() => setIsEditModalOpen(false)}
          className="text-gray-400 p-1 hover:bg-gray-200 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <form className="flex flex-col gap-4 w-full" onSubmit={handleEditEvent}>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Profiles *
          </label>
          <ProfileDropDown
            selectedProfileIds={selectedProfileIds}
            setSelectedProfileIds={setSelectedProfileIds}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Timezone *
          </label>
          <TimeZoneDropDown
            selectedTimeZone={selectedTimeZone}
            setSelectedTimeZone={setSelectedTimeZone}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Start Date & Time *
          </label>
          <StartDatePicker
            startDateTime={startDateTime}
            setStartDateTime={setStartDateTime}
            endDateTime={endDateTime}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            End Date & Time *
          </label>
          <EndDatePicker
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            setEndDateTime={setEndDateTime}
          />
        </div>

        {/* Selection summary */}
        <div className="mt-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-2">
          <div className="space-y-1">
            <div>
              <strong>Duration:</strong>{" "}
              {Math.round(endDateTime.getTime() - startDateTime.getTime()) /
                (1000 * 60)}{" "}
              minutes
            </div>
            {startDateTime >= endDateTime && (
              <div className="text-red-500">
                ⚠️ End time must be after start time
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="w-24 border border-gray-300 shadow rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`text-white gap-2 py-2 px-3 w-32 rounded-lg transition-colors ${
              editEventLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#6952E0] hover:bg-[#7158b0]"
            }`}
            disabled={editEventLoading}
          >
            {editEventLoading ? "Updating Event..." : "Update Event"}
          </button>
        </div>

        {editEventError && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{editEventError}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};


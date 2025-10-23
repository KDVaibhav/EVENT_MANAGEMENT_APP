import { useState } from "react";
import { Plus } from "lucide-react";
import { ProfileDropDown } from "./profileDropDown";

import { TimeZoneDropDown } from "./timeZoneDropDown";
import { StartDatePicker } from "./startDatePicker";
import { EndDatePicker } from "./endDatePicker";
import { useAppSelector } from "../store/hook";
import { useCreateEventMutation } from "../features/profile/profileApi";
import type { ProfileEvent } from "../features/profile/profileSlice";
import { useDispatch } from "react-redux";
import {
  NotificationType,
  setNotification,
  Status,
} from "../features/ui/uiSlice";
import { localToTimezone } from "../lib/dateUtils";

export const CreateEvent = () => {
  const dispatch = useDispatch();
  const startDate = new Date();
  const [createEvent, { isLoading: createEventLoading }] =
    useCreateEventMutation();
  const [createEventError, setCreateEventError] = useState("");
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[] | []>(
    []
  );
  const [selectedTimeZone, setSelectedTimeZone] = useState("");
  const [startDateTime, setStartDateTime] = useState<Date>(startDate);
  const [endDateTime, setEndDateTime] = useState<Date>(
    new Date(startDate.getTime() + 60 * 60 * 1000)
  );

  const currentProfile = useAppSelector(
    (state) => state.profile.currentProfile
  );

  // Validation function
  const validateForm = (): string | null => {
    if (!currentProfile || !currentProfile._id) {
      return "Select Current Profile";
    }

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

    return null; // No errors
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateEventError("");

    // Validate form before submission
    const validationError = validateForm();
    if (validationError) {
      setCreateEventError(validationError);
      return;
    }

    const payload: ProfileEvent = {
      timeZone: selectedTimeZone,
      startDateTime: localToTimezone(startDateTime, selectedTimeZone),
      endDateTime: localToTimezone(endDateTime, selectedTimeZone),
      profileIds: selectedProfileIds,
      createdBy: currentProfile!._id,
      createdAt: localToTimezone(new Date(), selectedTimeZone),
      updatedAt: localToTimezone(new Date(), selectedTimeZone),
    };

    try {
      await createEvent(payload).unwrap();
      // Reset form on success
      dispatch(
        setNotification({
          type: NotificationType.EVENT_CREATION,
          description: "Event created successfully",
          status: Status.SUCCESS,
        })
      );
      setSelectedProfileIds([]);
      setSelectedTimeZone("Asia/Kolkata");
      setStartDateTime(startDate);
      setEndDateTime(new Date(startDate.getTime() + 60 * 60 * 1000));
      setCreateEventError(""); // Clear any previous errors
    } catch (error) {
      console.error("Failed to create events:", error);
      dispatch(
        setNotification({
          type: NotificationType.EVENT_CREATION,
          description: "Error Creating Event",
          status: Status.FAILED,
        })
      );
      setCreateEventError("Error Creating Event");
    }
  };

  return (
    <div className="bg-white w-full md:w-1/2 p-4 rounded-lg">
      <div className="font-semibold text-xl">Create Event</div>

      <form className="flex flex-col gap-4 w-full" onSubmit={handleCreateEvent}>
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
              {Math.round(
                (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60)
              )}{" "}
              minutes
            </div>
            {startDateTime >= endDateTime && (
              <div className="text-red-500">
                ⚠️ End time must be after start time
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`flex items-center w-full text-white gap-2 justify-center p-2 rounded-lg transition-colors ${
            createEventLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#6952E0] hover:bg-[#7158b0]"
          }`}
          disabled={createEventLoading}
        >
          <Plus className="w-4" />
          <span>
            {createEventLoading ? "Creating Event..." : "Create Event"}
          </span>
        </button>

        {createEventError && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{createEventError}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

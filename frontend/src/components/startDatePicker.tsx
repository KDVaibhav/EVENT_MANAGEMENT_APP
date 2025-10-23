import { Calendar, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import classNames from "react-day-picker/style.module.css";
import "react-day-picker/style.css";
import {
  formatDisplayDate,
  formatDisplayTime,
  formatTimeForInput,
} from "../lib/dateUtils";

export const StartDatePicker = ({
  startDateTime,
  setStartDateTime,
  endDateTime,
  timeZone,
}: {
  startDateTime: Date;
  setStartDateTime: React.Dispatch<React.SetStateAction<Date>>;
  endDateTime: Date;
  timeZone?: string;
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const timePickerRef = useRef<HTMLDivElement | null>(null);
  // console.log("startDatePicker", startDateTime);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(event.target as Node)
      ) {
        setIsTimePickerOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDatePickerOpen(false);
        setIsTimePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    let newStartDate = new Date(date);

    // If start date and end date are same
    if (date.toDateString() === endDateTime.toDateString()) {
      const currentStartTime = new Date(startDateTime);

      // If current start time is after end time, then adjust it to end time - 1 minute
      if (currentStartTime >= endDateTime) {
        const defaultTime = new Date(endDateTime);
        defaultTime.setMinutes(defaultTime.getMinutes() - 1);
        newStartDate.setHours(defaultTime.getHours(), defaultTime.getMinutes());
      } else {
        newStartDate.setHours(
          currentStartTime.getHours(),
          currentStartTime.getMinutes()
        );
      }
    } else {
      // For different days, set a default time (9:00 AM)
      newStartDate.setHours(9, 0);
    }

    setStartDateTime(newStartDate);
    setIsDatePickerOpen(false);
  };

  // Handle time selection from dropdown
  const handleTimeSelect = (hours: number, minutes: number) => {
    const newStartDateTime = new Date(startDateTime);
    newStartDateTime.setHours(hours, minutes);

    // Validate if same day
    if (
      startDateTime.toDateString() === endDateTime.toDateString() &&
      newStartDateTime >= endDateTime
    ) {
      // Auto-correct to end time - 1 minute
      const correctedTime = new Date(endDateTime);
      correctedTime.setMinutes(correctedTime.getMinutes() - 1);
      newStartDateTime.setHours(
        correctedTime.getHours(),
        correctedTime.getMinutes()
      );
    }

    setStartDateTime(newStartDateTime);
    setIsTimePickerOpen(false);
  };

  // Generate time slots with proper filtering
  const generateTimeSlots = () => {
    const slots = [];
    const isSameDay =
      startDateTime.toDateString() === endDateTime.toDateString();

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // 30-minute intervals
        const timeDate = new Date(startDateTime);
        timeDate.setHours(hour, minute);

        const isDisabled = isSameDay && timeDate >= endDateTime;
        const isSelected =
          startDateTime.getHours() === hour &&
          startDateTime.getMinutes() === minute;

        slots.push({
          hours: hour,
          minutes: minute,
          label: `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`,
          disabled: isDisabled,
          selected: isSelected,
        });
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Handle manual time input
  const handleManualTimeChange = (timeString: string) => {
    if (!timeString) return;

    const [hours, minutes] = timeString.split(":").map(Number);

    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return;
    }

    const newDateTime = new Date(startDateTime);
    newDateTime.setHours(hours, minutes);

    // Validate if same day
    if (
      startDateTime.toDateString() === endDateTime.toDateString() &&
      newDateTime >= endDateTime
    ) {
      // Auto-correct to end time - 1 minute
      const correctedTime = new Date(endDateTime);
      correctedTime.setMinutes(correctedTime.getMinutes() - 1);
      newDateTime.setHours(
        correctedTime.getHours(),
        correctedTime.getMinutes()
      );
    }

    setStartDateTime(newDateTime);
  };

  const disabledDays = [{ after: endDateTime }];
  const isValidSelection = startDateTime < endDateTime;

  return (
    <div className="relative w-full">
      <div className="flex gap-2 items-center">
        {/* Date Picker */}
        <div className="flex relative w-2/3" ref={dropDownRef}>
          <button
            type="button"
            onClick={() => {
              setIsDatePickerOpen(!isDatePickerOpen);
              setIsTimePickerOpen(false);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors ${
              !isValidSelection
                ? "border-red-300 bg-red-50 text-red-900"
                : "border-gray-300 hover:border-gray-400 bg-[#F6F7F9]"
            }`}
          >
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs truncate">
              {formatDisplayDate(startDateTime.toISOString(), timeZone)}
            </span>
          </button>

          {isDatePickerOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-4 z-50 border min-w-[280px]">
              <DayPicker
                mode="single"
                selected={startDateTime}
                onSelect={handleDateSelect}
                disabled={disabledDays}
                required
                classNames={classNames}
                modifiers={{ disabled: disabledDays }}
                footer={
                  <div className="mt-3 pt-3 border-t text-xs text-gray-500 space-y-1">
                    <div>End: {endDateTime.toLocaleDateString()}</div>
                    <div className="font-medium">
                      Selected: {startDateTime.toLocaleDateString()}
                    </div>
                  </div>
                }
              />
            </div>
          )}
        </div>

        {/* Time Picker */}
        <div className="flex w-1/3 relative" ref={timePickerRef}>
          <button
            type="button"
            onClick={() => {
              setIsTimePickerOpen(!isTimePickerOpen);
              setIsDatePickerOpen(false);
            }}
            className={`w-full flex items-center gap-2 px-2 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors ${
              !isValidSelection
                ? "border-red-300 bg-red-50 text-red-900"
                : "border-gray-300 hover:border-gray-300 bg-[#F6F7F9]"
            }`}
          >
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs">
              {formatDisplayTime(startDateTime.toISOString(), timeZone)}
            </span>
          </button>

          {isTimePickerOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-3 z-50 border min-w-[120px] max-h-60 overflow-y-auto">
              <div className=" mb-1 pb-1 border-b">
                <input
                  type="time"
                  value={formatTimeForInput(startDateTime)}
                  onChange={(e) => handleManualTimeChange(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-200"
                  step="300"
                />
              </div>
              <div className="space-y-1">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.label}
                    type="button"
                    onClick={() =>
                      !slot.disabled &&
                      handleTimeSelect(slot.hours, slot.minutes)
                    }
                    disabled={slot.disabled}
                    className={`w-full px-3 py-2 text-xs rounded text-left transition-colors ${
                      slot.selected
                        ? "bg-[#6952E0] text-white"
                        : slot.disabled
                        ? "text-gray-300 cursor-not-allowed bg-gray-100"
                        : "hover:bg-[#6952E0] text-gray-700 hover:text-white"
                    }`}
                  >
                    {`${slot.hours.toString().padStart(2, "0")}:${slot.minutes
                      .toString()
                      .padStart(2, "0")}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Validation and information */}
      {!isValidSelection && (
        <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>Start time must be before end time</span>
          </div>
        </div>
      )}
    </div>
  );
};

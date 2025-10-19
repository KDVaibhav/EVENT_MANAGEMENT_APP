import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import classNames from "react-day-picker/style.module.css";

export const EndDatePicker = ({
  startDateTime,
  endDateTime,
  setEndDateTime,
}: {
  startDateTime: Date;
  endDateTime: Date;
  setEndDateTime: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleClickEsc = (event: KeyboardEvent) => {
      if (modalRef.current && event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideModal);
    document.addEventListener("keydown", handleClickEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
      document.removeEventListener("keydown", handleClickEsc);
    };
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (date.toDateString() === startDateTime.toDateString()) {
      const newDateTime = new Date(date);
      newDateTime.setHours(endDateTime.getHours(), endDateTime.getMinutes());

      if (newDateTime <= startDateTime) {
        newDateTime.setHours(
          endDateTime.getHours() - 1,
          endDateTime.getMinutes()
        );
      }
      setEndDateTime(newDateTime);
    } else {
      setEndDateTime(date);
    }
    setOpen(false);
  };

  const handleTimeChange = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const newDateTime = new Date(startDateTime);
    newDateTime.setHours(hours, minutes);

    if (newDateTime > startDateTime) {
      setEndDateTime(newDateTime);
    }
  };

  const disabledDays = { before: startDateTime };

  const formatTimeForInput = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getMaxTime = (): string => {
    if (startDateTime.toDateString() === endDateTime.toDateString()) {
      // If same day, max time is endDateTime's time
      return formatTimeForInput(startDateTime);
    }
    return "23:59";
  };

  return (
    <div className="relative flex text-sm items-center gap-4">
      <div
        className="w-2/3 border-[0.5px] h-6 rounded cursor-pointer"
        ref={modalRef}
        onClick={() => setOpen(!open)}
      >
        <div className="flex gap-2 items-center px-4">
          <Calendar className="w-4" />
          <span>{endDateTime.toLocaleDateString()}</span>
        </div>
        {open && (
          <div className="absolute bg-white shadow rounded-lg p-2 z-50">
            <DayPicker
              animate
              mode="single"
              selected={endDateTime}
              onSelect={handleDateSelect}
              disabled={disabledDays}
              required
              classNames={classNames}
            />
          </div>
        )}
      </div>
      <div className="w-1/3 border-[0.5px] h-6 rounded">
        <input
          type="time"
          value={formatTimeForInput(endDateTime)}
          onChange={(e) => handleTimeChange(e.target.value)}
          max={getMaxTime()}
          className="w-full h-full px-2 rounded"
          // Add visual indication when time input is constrained
          style={{
            backgroundColor:
              startDateTime.toDateString() === endDateTime.toDateString()
                ? "#f8f9fa"
                : "white",
          }}
          title={
            startDateTime.toDateString() === endDateTime.toDateString()
              ? `Time must be before ${endDateTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Select time"
          }
        />
      </div>
    </div>
  );
};

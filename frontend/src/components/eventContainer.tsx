import { Calendar, Clock, Edit, Logs, Users } from "lucide-react";
import type { ProfileEvent } from "../features/profile/profileSlice";
import { formatDisplayDate, formatDisplayTime, toTZ } from "../lib/dateUtils";
import { useEffect, useMemo, useRef, useState } from "react";
import { EditEvent } from "./editEvent";
import { LogModal } from "./logModal";

export const EventContainer = ({
  profileEvent,
  timeZone,
}: {
  profileEvent: ProfileEvent;
  timeZone: string;
}) => {
  const startDateTime = profileEvent.startDateTime;
  const endDateTime = profileEvent.endDateTime;
  const createdAt = profileEvent.createdAt;
  const updatedAt = profileEvent.updatedAt;
  // console.log(timeZone);
  // console.log("1", profileEvent.createdAt);
  const {
    startDate,
    endDate,
    startTime,
    endTime,
    createdDate,
    createdTime,
    updatedDate,
    updatedTime,
  } = useMemo(() => {
    const start = toTZ(new Date(startDateTime), timeZone);
    const end = toTZ(new Date(endDateTime), timeZone);
    const created = toTZ(new Date(createdAt), timeZone);
    const updated = toTZ(new Date(updatedAt), timeZone);

    return {
      startDate: formatDisplayDate(start, timeZone), // Pass timezone
      endDate: formatDisplayDate(end, timeZone),
      startTime: formatDisplayTime(start, timeZone),
      endTime: formatDisplayTime(end, timeZone),
      createdDate: formatDisplayDate(created, timeZone),
      createdTime: formatDisplayTime(created, timeZone),
      updatedDate: formatDisplayDate(updated, timeZone),
      updatedTime: formatDisplayTime(updated, timeZone),
    };
  }, [startDateTime, endDateTime, createdAt, updatedAt, timeZone]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const editModalRef = useRef<HTMLDivElement | null>(null);
  const logModalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      const clickedOutsideEdit =
        editModalRef.current &&
        !editModalRef.current.contains(event.target as Node);
      const clickedOutsideLog =
        logModalRef.current &&
        !logModalRef.current.contains(event.target as Node);

      if (clickedOutsideEdit && clickedOutsideLog) {
        setIsEditModalOpen(false);
        setIsLogModalOpen(false);
      }
    };
    const handleClickEsc = (event: KeyboardEvent) => {
      if (editModalRef.current && event.key === "Escape") {
        setIsEditModalOpen(false);
        setIsLogModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideModal);
    document.addEventListener("keydown", handleClickEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
      document.removeEventListener("keydown", handleClickEsc);
    };
  }, []);
  // console.log(typeof endDateTime);
  // console.log(profileEvent);
  return (
    <div className="flex flex-col gap-2 border border-gray-200 shadow rounded p-3">
      <div className="flex items-center text-xs font-semibold gap-2">
        <Users className="text-[#6952E0] h-4 w-4" />
        <div>
          {profileEvent.profileIds.map((profileId, index) =>
            index === 0 ? (
              // @ts-ignore
              <span key={profileId._id}>{profileId.profileName}</span>
            ) : (
              // @ts-ignore
              <span key={profileId._id}>, {profileId.profileName}</span>
            )
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <Calendar className="w-4 h-4" />
        <div className="flex flex-col">
          <span>Start: {startDate}</span>
          <span className="flex items-center text-gray-400 gap-1">
            <Clock className="w-3 h-3" />
            {startTime}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <Calendar className="w-4 h-4" />
        <div className="flex flex-col">
          <span>End: {endDate}</span>
          <span className="flex items-center text-gray-400 gap-1">
            <Clock className="w-3 h-3" />
            {endTime}
          </span>
        </div>
      </div>
      <div className="border border-gray-200"></div>
      <div className="text-gray-400 text-xs">
        Created: {createdDate} at {createdTime}
      </div>
      <div className="text-gray-400 text-xs">
        Updated: {updatedDate} at {updatedTime}
      </div>
      <div className="flex gap-2">
        <button
          className="flex items-center bg-[#F6F7F9] w-1/2 py-1 justify-center text-xs gap-1 rounded border border-gray-200 hover:bg-gray-300"
          onClick={() => setIsEditModalOpen(true)}
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
        <button
          className="flex items-center bg-[#F6F7F9] w-1/2 py-1 justify-center text-xs gap-1 rounded border border-gray-200 hover:bg-gray-300"
          onClick={() => setIsLogModalOpen(true)}
        >
          <Logs className="w-4 h-4" />
          <span>View Logs</span>
        </button>
      </div>
      {isEditModalOpen && (
        <div className="fixed inset-0 h-screen w-screen opacity-100 bg-black/50 flex z-100 items-center justify-center">
          <div ref={editModalRef} className="">
            <EditEvent
              profileEvent={profileEvent}
              setIsEditModalOpen={setIsEditModalOpen}
            />
          </div>
        </div>
      )}
      {isLogModalOpen && (
        <div className="fixed inset-0 h-screen w-screen opacity-100 bg-black/50 flex z-100 items-center justify-center">
          <div ref={logModalRef} className="">
            <LogModal
              profileEvent={profileEvent}
              setIsLogModalOpen={setIsLogModalOpen}
              timeZone={timeZone}
            />
          </div>
        </div>
      )}
    </div>
  );
};

import { Clock, X } from "lucide-react";
import { useGetEventLogsQuery } from "../features/profile/profileApi";
import type { Log, ProfileEvent } from "../features/profile/profileSlice";
import {
  convertTZ,
  formatDisplayDate,
  formatDisplayTime,
  toTZ,
} from "../lib/dateUtils";
import { useRef, useState } from "react";

export const LogModal = ({
  profileEvent,
  setIsLogModalOpen,
  timeZone,
}: {
  profileEvent: ProfileEvent;
  setIsLogModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  timeZone: string;
}) => {
  const [skip, setSkip] = useState(0);
  const { data: response, isLoading } = useGetEventLogsQuery(
    {
      eventId: profileEvent._id,
      skip,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const eventLogs = response?.eventLogs || [];
  const hasMore = response?.hasMore || false;
  const scrollContentRef = useRef<HTMLDivElement | null>(null);
  // console.log(eventLogs);
  const handleScroll = () => {
    if (!scrollContentRef.current || isLoading || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContentRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setSkip((prev) => prev + 10);
    }
  };
  return (
    <div className="bg-white max-w-72 p-4 w-screen rounded-md  h-fit sm:max-w-96">
      <div className="flex justify-between items-center">
        <span className="font-bold">Event Update History</span>
        <button
          onClick={() => setIsLogModalOpen(false)}
          className="text-gray-400 p-1 hover:bg-gray-200 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div>
        {isLoading && <p className="">Loading...</p>}
        <div
          ref={scrollContentRef}
          onScroll={handleScroll}
          className="space-y-1 mt-2 max-h-400"
        >
          {eventLogs && eventLogs.length > 0 ? (
            eventLogs.map((log: Log) => {
              const logDateTime = convertTZ(log.dateTime, timeZone);
              return (
                <div
                  key={log._id}
                  className="border border-gray-200 p-2 text-xs rounded space-y-1"
                >
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="">
                      {formatDisplayDate(logDateTime.toISOString())} at{" "}
                      {formatDisplayTime(logDateTime.toISOString())}
                    </span>
                  </div>
                  <span>{log.description}</span>
                </div>
              );
            })
          ) : (
            <div className="mt-2 text-center">No updates yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

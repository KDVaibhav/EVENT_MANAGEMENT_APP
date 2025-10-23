import { useCallback, useEffect, useRef, useState } from "react";
import { TimeZoneDropDown } from "./timeZoneDropDown";
import { useAppSelector } from "../store/hook";
import { EventContainer } from "./eventContainer";
import { useLazyGetProfileEventsQuery } from "../features/profile/profileApi";
import type { ProfileEvent } from "../features/profile/profileSlice";

export const ShowEvents = () => {
  const [timeZone, setTimeZone] = useState("Asia/Kolkata");
  const currentProfile = useAppSelector(
    (state) => state.profile.currentProfile
  );
  const [skip, setSkip] = useState(0);
  const [getProfileEvents, isLoading] = useLazyGetProfileEventsQuery();
  let profileEvents = useAppSelector((state) => state.profile.profileEvents);
  let hasMore = false;
  const scrollContentRef = useRef<HTMLDivElement | null>(null);
  const handleScroll = useCallback(async () => {
    if (!scrollContentRef.current || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContentRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setSkip((prev) => prev + 10);
      const data = await getProfileEvents({
        profileId: currentProfile!._id,
        skip,
      }).unwrap();
      profileEvents = data.profileEvents;
      hasMore = data.hasMore;
    }
  }, [hasMore]);

  useEffect(() => {
    setSkip(0);
  }, [currentProfile?._id]);

  return (
    <div className="bg-white w-full md:w-1/2 p-4 rounded-lg ">
      <div className="font-semibold text-xl">Events</div>
      <div>
        <div className="text-xs mb-1">View in TimeZone</div>
        <TimeZoneDropDown
          selectedTimeZone={timeZone}
          setSelectedTimeZone={setTimeZone}
        />
      </div>
      <div className="overflow-y-scroll max-h-[350px]">
        {isLoading && profileEvents.length === 0 && !currentProfile ? (
          <p className="flex h-full mt-2 justify-center">Select a Profile.</p>
        ) : (
          <div
            ref={scrollContentRef}
            onScroll={handleScroll}
            className="space-y-1 mt-2 max-h-400"
          >
            {profileEvents && profileEvents.length > 0 ? (
              <div className="space-y-2 mt-3">
                {profileEvents.map((profileEvent: ProfileEvent) => (
                  <EventContainer
                    key={profileEvent._id}
                    profileEvent={profileEvent}
                    timeZone={timeZone}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full mt-2 justify-center">
                {" "}
                No events found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

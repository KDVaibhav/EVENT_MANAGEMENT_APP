import { useEffect, useState } from "react";

import { SelectProfileDropDown } from "./components/selectProfileDropDown";
import { Plus } from "lucide-react";
import { ProfileDropDown } from "./components/profileDropDown";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TimeZoneDropDown } from "./components/timeZoneDropDown";
import { StartDatePicker } from "./components/startDatePicker";
import { EndDatePicker } from "./components/endDatePicker";
dayjs.extend(utc);
dayjs.extend(timezone);

function App() {
  const startDate = new Date();
  const [selectedProfileIds, setSelectedProfileIds] = useState([""]);
  const [selectedTimeZone, setSelectedTimeZone] = useState("");
  const [startDateTime, setStartDateTime] = useState<Date>(startDate);
  const [endDateTime, setEndDateTime] = useState<Date>(startDate);
  useEffect(() => {
    setStartDateTime(startDate);
  }, []);
  const handleCreateEvent = () => {};

  return (
    <div className="bg-[#F6F7F9] p-3 sm:p-6 md:p-9 lg:px-15 h-screen">
      <div className="flex justify-between items-center ">
        <div className="">
          <div className="font-bold text-3xl">Event Management</div>
          <div className="font-extralight text-xs font pt-1">
            Create and manage events across multiple timezones
          </div>
        </div>
        <SelectProfileDropDown />
      </div>
      <div className="flex flex-col sm:flex-row mt-4 gap-4">
        <div className="bg-white w-full md:w-1/2 p-4 ">
          <div className="font-semibold text-xl">Create Event</div>
          <form
            className="flex flex-col gap-2 w-full"
            onSubmit={handleCreateEvent}
          >
            <div>
              <label>Profiles</label>
              <ProfileDropDown
                selectedProfileIds={selectedProfileIds}
                setSelectedProfileIds={setSelectedProfileIds}
              />
            </div>
            <div>
              <label>Timezone</label>
              <TimeZoneDropDown
                selectedTimeZone={selectedTimeZone}
                setSelectedTimeZone={setSelectedTimeZone}
              />
            </div>
            <div>
              <label>Start Date & Time</label>

              <div>
                <StartDatePicker
                  startDateTime={startDateTime}
                  setStartDateTime={setStartDateTime}
                  endDateTime={endDateTime}
                />
              </div>
            </div>
            <div>
              <label>End Date & Time</label>
              <EndDatePicker
                startDateTime={startDateTime}
                endDateTime={endDateTime}
                setEndDateTime={setEndDateTime}
              />
            </div>
            <button
              type="submit"
              className="flex items-center w-full text-white gap-2 justify-center p-2 rounded-lg hover:bg-[#7158b0] bg-[#6952E0]"
            >
              <Plus className="w-4" /> <span>Create Event</span>
            </button>
          </form>
        </div>
        <div className="bg-white w-full md:w-1/2 p-4">
          <div>Events</div>
        </div>
      </div>
    </div>
  );
}

export default App;

// const debounce = (fn: () => void, input: string[]) => {
//   const intervalRef = useRef<number | null>;
//   const debouncedValue = useCallback(() => {
//     setTimeout(() => {});
//   }, [input]);
//   return debouncedValue;
// };

// const TextInput = () => {
//   const [input, setInput] = useState("");
//   const [debouncedValue, setDebouncedValue] = useState("");
//   const intervalRef = useRef<number | null>(null);
//   useEffect(() => {
//     intervalRef.current = window.setTimeout(() => {
//       debounce(setDebouncedValue, input);
//       console.log(input);
//     }, 1000);
//     return () => clearTimeout(intervalRef.current!);
//   }, [input]);
//   return (
//     <div>
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />
//       <div>{input}</div>
//     </div>
//   );
// };

// const DebouncedSearch = () => {
//   const [input, setInput] = useState("");
//   const [debounceValue, setDebouncedValue] = useState("");
//   const timeoutRef = useRef<number | null>(null);

//   useEffect(() => {
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     timeoutRef.current = window.setTimeout(() => {
//       setDebouncedValue(input);
//       console.log(input);
//     }, 1000);
//     return () => clearInterval(timeoutRef.current!);
//   }, [input]);

//   return (
//     <div>
//       <input
//         placeholder="Enter value to search..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         className="border m-2"
//       />
//     </div>
//   );
// };

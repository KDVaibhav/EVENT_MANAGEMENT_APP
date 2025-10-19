import { useEffect, useRef, useState } from "react";
import { ChevronsUpDown } from "lucide-react";

import moment from "moment-timezone";

export const TimeZoneDropDown = ({
  selectedTimeZone,
  setSelectedTimeZone,
}: {
  selectedTimeZone: string;
  setSelectedTimeZone: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [timeZone, setTimeZone] = useState([""]);
  const [open, setOpen] = useState(false);
  const allTimezones = moment.tz.names();
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setTimeZone(
      allTimezones.filter((timeZone) => timeZone.includes(searchValue))
    );
  }, [searchValue]);
  useEffect(() => {
    setSelectedTimeZone("Asia/Kolkata");

    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearchValue("");
      }
    };
    const handleClickEsc = (event: KeyboardEvent) => {
      if (dropDownRef.current && event.key === "Escape") {
        setOpen(false);
        setSearchValue("");
      }
    };
    document.addEventListener("mousedown", handleClickOutsideModal);
    document.addEventListener("keydown", handleClickEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
      document.removeEventListener("keydown", handleClickEsc);
    };
  }, []);

  return (
    <div
      className="w-full border-[0.5px] rounded relative"
      ref={dropDownRef}
    >
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center px-3 sm:px-4 "
      >
        <div className="text-xs">{selectedTimeZone}</div>
        <ChevronsUpDown className="w-4" />
      </div>
      {open && (
        <div className="absolute bg-white rounded z-50 shadow w-40 sm:w-50 mt-2 border-[0.5px]">
          <div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              placeholder="Search TimeZone ..."
            />
          </div>
          <div className="max-h-30 overflow-y-auto">
            {allTimezones.map((timeZone: string, index) => (
              <div
                key={index}
                onClick={() => setSelectedTimeZone(timeZone)}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
              >
                {timeZone}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

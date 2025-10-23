import { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import moment from "moment-timezone";

export const TimeZoneDropDown = ({
  selectedTimeZone,
  setSelectedTimeZone,
}: {
  selectedTimeZone: string;
  setSelectedTimeZone: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [timeZones, setTimeZones] = useState([""]);
  const [open, setOpen] = useState(false);
  const allTimezones = moment.tz.names();
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setTimeZones(
      allTimezones.filter((timeZone) => timeZone.includes(searchValue))
    );
  }, [searchValue]);

  useEffect(() => {
    setSelectedTimeZone(selectedTimeZone || "Asia/Kolkata");

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
      className="w-full border text-xs border-gray-300 bg-[#F6F7F9] rounded relative"
      ref={dropDownRef}
    >
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center px-3 sm:px-4 "
      >
        <div className="">{selectedTimeZone}</div>
        <ChevronsUpDown className="w-4" />
      </div>
      {open && (
        <div className="absolute bg-white rounded text-xs shadow w-45 sm:w-55 mt-1 border z-50 border-gray-300 p-1">
          <div className="flex gap-1 pl-2 hover:outline-none hover:ring-2 mb-1 hover:ring-purple-200 rounded">
            <Search className="w-4 g-4" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              placeholder="Search TimeZone ..."
              className=" w-full focus:outline-none focus:ring-0"
            />
          </div>
          <div className="max-h-30 overflow-y-auto space-y-1">
            {timeZones.length > 0 ? (
              timeZones.map((timeZone: string, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedTimeZone(timeZone);
                    setOpen(false);
                  }}
                  className={`px-2 py-1 hover:bg-[#6952E0] hover:text-white cursor-pointer rounded ${
                    selectedTimeZone === timeZone && "bg-[#6952E0] text-white"
                  } `}
                >
                  <span className="flex items-center gap-1">
                    {selectedTimeZone === timeZone ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <div className="w-4"></div>
                    )}
                    {timeZone}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center p-2 border-t border-gray-300">
                No TimeZone Found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import { useEffect, useRef, useState } from "react";
import {
  useAvailableProfileQuery,
  useCreateProfileMutation,
  useGetProfilesQuery,
} from "../features/profile/profileApi";
import {
  setCurrentProfile,
  type Profile,
} from "../features/profile/profileSlice";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { ChevronsUpDown } from "lucide-react";

export const SelectProfileDropDown = () => {
  const dispatch = useAppDispatch();
  const selectedProfile = useAppSelector(
    (state) => state.profile.currentProfile
  );
  const [searchValue, setSearchValue] = useState("");
  const [debounceSearchValue, setDebounceSearchValue] = useState("");
  const [newProfile, setNewProfile] = useState("");
  const [debounceNewProfile, setDebounceNewProfile] = useState("");
  const [open, setOpen] = useState(false);
  const [skip, setSkip] = useState(0);

  let { data: profiles, isLoading } = useGetProfilesQuery(
    { searchTerm: debounceSearchValue, skip },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [createProfile, { isLoading: isCreateProfileLoading }] =
    useCreateProfileMutation();
  const { data: exists, isLoading: isAvailableProfileLoading } =
    useAvailableProfileQuery(debounceNewProfile);
  const dropDownContentRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  profiles = useAppSelector((state) => state.profile.profiles);
  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      setDebounceSearchValue(searchValue);
      setSkip(0);
    }, 400);
    return () => {
      clearTimeout(timeoutRef.current!);
    };
  }, [searchValue]);

  useEffect(() => {
    if (newProfile === "") return;
    timeoutRef.current = window.setTimeout(() => {
      setDebounceNewProfile(newProfile);
    }, 400);
    return () => clearTimeout(timeoutRef.current!);
  }, [newProfile]);

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
        setDebounceNewProfile("");
        setSkip(0);
        setNewProfile("");
        setSearchValue("");
        setDebounceSearchValue("");
      }
    };
    const handleClickEsc = (event: KeyboardEvent) => {
      if (dropDownRef.current && event.key === "Escape") {
        setOpen(false);
        setDebounceNewProfile("");
        setSkip(0);
        setNewProfile("");
        setSearchValue("");
        setDebounceSearchValue("");
      }
    };
    document.addEventListener("mousedown", handleClickOutsideModal);
    document.addEventListener("keydown", handleClickEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
      document.removeEventListener("keydown", handleClickEsc);
    };
  }, []);

  const handleScroll = () => {
    if (!dropDownContentRef.current || isLoading) return;
    const { scrollTop, scrollHeight, clientHeight } =
      dropDownContentRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setSkip((prev) => prev + 10);
    }
  };

  const handleSelectProfile = (profile: Profile) => {
    dispatch(setCurrentProfile(profile));
    setOpen(false);
    setSearchValue("");
  };

  const handleCreateProfile = async () => {
    try {
      await createProfile(debounceNewProfile).unwrap();
      setNewProfile("");
      setDebounceNewProfile("");
    } catch (error) {
      console.error("Failed to create profile:", error);
    }
  };

  return (
    <div
      className="w-40 sm:w-50 border-[0.5px] rounded relative"
      ref={dropDownRef}
    >
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center px-3 sm:px-4 "
      >
        <div className="text-xs">
          {selectedProfile
            ? selectedProfile.profileName
            : "Select current profile..."}
        </div>
        <ChevronsUpDown className="w-4" />
      </div>
      {open && (
        <div className="absolute bg-white rounded shadow w-40 sm:w-50 mt-2 border-[0.5px]">
          <div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              placeholder="Search profiles ..."
            />
          </div>
          <div>
            {isLoading && <p className="">Loading...</p>}
            <div
              ref={dropDownContentRef}
              onScroll={handleScroll}
              className="max-h-30 overflow-y-auto"
            >
              {profiles?.length > 0 &&
                profiles.map((profile: Profile) => (
                  <div
                    key={profile._id}
                    onClick={() => handleSelectProfile(profile)}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    {profile.profileName}
                  </div>
                ))}
            </div>
          </div>
          {/* Create New Profile */}
          <div>
            <div className="flex">
              <input
                value={newProfile}
                placeholder="Create Profile"
                onChange={(e) => setNewProfile(e.target.value)}
                className={`border ${exists && "border-red-500"} w-full`}
              />

              <button
                onClick={handleCreateProfile}
                className="border bg-gray-200 disabled:bg-gray-500 w-1/3 hover:bg-gray-300"
                disabled={
                  exists || isCreateProfileLoading || isAvailableProfileLoading
                }
              >
                Add
              </button>
            </div>
            <div className="text-red-500">
              {exists && "Profile name not available"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// <select
// value={selectedProfile}
// onFocus={() => setOpen(true)}
// onBlur={() => setOpen(false)}
// className="border-[0.5px] rounded "
// onChange={(e) => setSelectedProfile(e.target.value)}
// >
// <option value="">Select</option>
// {profiles &&
//   profiles.map((profile: Profile) => (
//     <option key={profile.id} value={profile.id}>
//       {profile.profileName}
//     </option>
//   ))}
// <option value="admin">Admin</option>
// </select>
// {open && (
// <input
//   type="text"
//   placeholder="Search Profile"
//   value={searchValue}
//   onChange={(e) => setSearchValue(e.target.value)}
//   className="border rounded h-8 px-2 w-full"
// />
// )}

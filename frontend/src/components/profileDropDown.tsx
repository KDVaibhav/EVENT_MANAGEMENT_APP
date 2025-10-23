import { useEffect, useRef, useState } from "react";
import {
  useAvailableProfileQuery,
  useCreateProfileMutation,
  useGetProfilesQuery,
} from "../features/profile/profileApi";
import { type Profile } from "../features/profile/profileSlice";
import { useAppSelector } from "../store/hook";
import { Check, ChevronsUpDown, Search } from "lucide-react";

export const ProfileDropDown = ({
  selectedProfileIds,
  setSelectedProfileIds,
}: {
  selectedProfileIds: string[];
  setSelectedProfileIds: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const currentProfile = useAppSelector(
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
    if (selectedProfileIds.includes(profile._id)) {
      setSelectedProfileIds(
        selectedProfileIds.filter(
          (selectedProfileId) => selectedProfileId !== profile._id
        )
      );
    } else {
      setSelectedProfileIds([...selectedProfileIds, profile._id]);
    }
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
      className="w-full border border-gray-300 bg-[#F6F7F9] rounded relative"
      ref={dropDownRef}
    >
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center px-3 sm:px-4 "
      >
        <div className="text-xs">
          {selectedProfileIds.length > 0
            ? `${selectedProfileIds.length} profiles selected`
            : "Select profiles..."}
        </div>
        <ChevronsUpDown className="w-4" />
      </div>
      {open && (
        <div className="absolute bg-white text-xs rounded shadow z-50 w-45 sm:w-55 mt-1 border border-gray-300 p-1">
          <div className="flex gap-1 pl-2 hover:outline-none hover:ring-2 mb-1 hover:ring-purple-200 rounded">
            <Search className="w-4 g-4 " />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              placeholder="Search profiles ..."
              className="focus:outline-none focus:ring-0"
            />
          </div>
          <div>
            {isLoading && <p className="">Loading...</p>}
            <div
              ref={dropDownContentRef}
              onScroll={handleScroll}
              className="max-h-30 overflow-y-auto space-y-1"
            >
              {profiles?.length > 0 &&
                profiles.map((profile: Profile) => (
                  <div
                    key={profile._id}
                    onClick={() => handleSelectProfile(profile)}
                    className={`px-2 py-1 hover:bg-[#6952E0] hover:text-white cursor-pointer rounded ${
                      selectedProfileIds.includes(profile._id) &&
                      "bg-[#6952E0] text-white"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {selectedProfileIds.includes(profile._id) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <div className="w-4"></div>
                      )}
                      {profile.profileName}
                    </span>{" "}
                  </div>
                ))}
            </div>
          </div>
          {/* Create New Profile */}
          {currentProfile?.profileName === "admin" && (
            <div>
              <div className="flex p-1 gap-1 border-t border-gray-300">
                <input
                  value={newProfile}
                  placeholder="Create Profile"
                  onChange={(e) => setNewProfile(e.target.value)}
                  className={`border border-gray-300 hover:ring-purple-200 rounded px-2 py-1 ${
                    exists && "border-red-500"
                  } w-full`}
                />

                <button
                  onClick={handleCreateProfile}
                  className="border bg-[#6952E0] text-white rounded disabled:bg-gray-300 w-1/3 hover:bg-gray-300"
                  disabled={
                    exists ||
                    isCreateProfileLoading ||
                    isAvailableProfileLoading
                  }
                >
                  Add
                </button>
              </div>
              <div className="text-red-500 text-xs px-1">
                {exists && "name already taken"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

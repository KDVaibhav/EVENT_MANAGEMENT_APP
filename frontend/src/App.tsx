import { CreateEvent } from "./components/createEvent";
import { ShowEvents } from "./components/showEvents";
import { NotificationModal } from "./components/notificationModal";
import { SelectProfileDropDown } from "./components/selectProfileDropDown";

function App() {
  // const learn = dayjs("2019-01-25");
  // console.log(typeof learn);
  return (
    <div className="bg-[#F6F7F9] p-3 sm:p-6 md:py-9 md:px-20 h-screen">
      <div className="flex justify-between items-center ">
        <div className="">
          <div className="font-bold text-3xl">Event Management</div>
          <div className="font-light text-xs font pt-1 text-gray-500">
            Create and manage events across multiple timezones
          </div>
        </div>
        <SelectProfileDropDown />
      </div>
      <div className="flex flex-col sm:flex-row mt-4 gap-4 sm:max-h-[500px]">
        <CreateEvent />
        <ShowEvents />
      </div>
      <NotificationModal />
      <div></div>
    </div>
  );
}

export default App;

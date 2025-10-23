import { CircleCheckBig, X } from "lucide-react";
import {
  clearNotification,
  Status,
  type Notification,
} from "../features/ui/uiSlice";
import { useAppSelector } from "../store/hook";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const NotificationModal = () => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const notification: Notification[] = useAppSelector(
    (state) => state.ui.notification
  );
  useEffect(() => {
    if (notification && notification.length > 0) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          dispatch(clearNotification());
        }, 300);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);
  if (!notification || notification.length === 0) return null;
  return (
    <div
      className={` absolute p-2 bottom-4 right-4 shadow-xl border border-gray-500 bg-white rounded-lg flex items-center gap-2 transition-transform duration-300 ease-in-out ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <span>
        {notification[0].status === Status.SUCCESS ? (
          <CircleCheckBig className="text-green-600 w-5 h-5" />
        ) : (
          <X className="text-red-500 w-5 h-5" />
        )}
      </span>
      <span>{notification[0].description}</span>
    </div>
  );
};

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const toTZ = (date: Date, tz: string): string => {
  return dayjs.utc(date).tz(tz).format();
};
export const toUTC = (date: Date, tz: string) => {
  return dayjs(date, tz).tz(tz).toDate();
};

export const formatDisplayTime = (dateString: string, tz?: string): string => {
  if (tz) {
    return dayjs.utc(dateString).tz(tz).format("hh:mm A");
  }
  return dayjs(dateString).format("hh:mm A");
};

export const formatDisplayDate = (dateString: string, tz?: string): string => {
  if (tz) {
    return dayjs.utc(dateString).tz(tz).format("MMMM DD, YYYY");
  }
  return dayjs(dateString).format("MMMM DD, YYYY");
};

export const formatTimeForInput = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const localToTimezone = (
  localDate: Date,
  targetTimezone: string
): string => {
  // Extract components from local date
  const year = localDate.getFullYear();
  const month = (localDate.getMonth() + 1).toString().padStart(2, "0");
  const day = localDate.getDate().toString().padStart(2, "0");
  const hours = localDate.getHours().toString().padStart(2, "0");
  const minutes = localDate.getMinutes().toString().padStart(2, "0");
  const seconds = localDate.getSeconds().toString().padStart(2, "0");

  // Create ISO-like string without timezone
  const isoLikeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  // Parse as the target timezone
  return toTZ(
    dayjs.tz(isoLikeString, "YYYY-MM-DD HH:mm:ss", targetTimezone).toDate(),
    targetTimezone
  );
};

export const convertTZ = (date: string, tz: string) => {
  return new Date(new Date(date).toLocaleString("en-US", { timeZone: tz }));
};


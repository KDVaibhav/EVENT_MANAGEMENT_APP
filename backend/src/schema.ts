import mongoose from "mongoose";
import z from "zod";

const profileSchema = new mongoose.Schema(
  {
    profileName: { type: String, required: true },
  },
  { timestamps: true }
);

export const eventZodSchema = z.object({
  timeZone: z.string(),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  profileIds: z.array(z.string()),
  logIds: z.array(z.string()).optional(),
  createdBy: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type EventInput = z.infer<typeof eventZodSchema>;

const eventSchema = new mongoose.Schema({
  timeZone: { type: String, required: true },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  profileIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  logIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Log" }],
  createdBy: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

export const logZodSchema = z.object({
  eventId: z.string(),
  description: z.string(),
  dateTime: z.coerce.date(),
});
export type LogInput = z.infer<typeof logZodSchema>;

const logSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  description: { type: String, required: true },
  dateTime: { type: Date, required: true },
});

const Profile = mongoose.model("Profile", profileSchema);
const Event = mongoose.model("Event", eventSchema);
const Log = mongoose.model("Log", logSchema);

export { Profile, Event, Log };

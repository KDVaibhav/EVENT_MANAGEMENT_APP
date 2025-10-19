import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    profileName: { type: String, required: true },
  },
  { timestamps: true }
);

const eventSchema = new mongoose.Schema(
  {
    timeZone: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    profileIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
    logIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Log" }],
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

const logSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    description: { type: String, required: true },
    dateTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
const Event = mongoose.model("Event", eventSchema);
const Log = mongoose.model("Log", logSchema);

export { Profile, Event, Log };

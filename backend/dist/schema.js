"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.Event = exports.Profile = exports.logZodSchema = exports.eventZodSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = __importDefault(require("zod"));
const profileSchema = new mongoose_1.default.Schema({
    profileName: { type: String, required: true },
}, { timestamps: true });
exports.eventZodSchema = zod_1.default.object({
    timeZone: zod_1.default.string(),
    startDateTime: zod_1.default.coerce.date(),
    endDateTime: zod_1.default.coerce.date(),
    profileIds: zod_1.default.array(zod_1.default.string()),
    logIds: zod_1.default.array(zod_1.default.string()).optional(),
    createdBy: zod_1.default.string(),
    createdAt: zod_1.default.coerce.date(),
    updatedAt: zod_1.default.coerce.date(),
});
const eventSchema = new mongoose_1.default.Schema({
    timeZone: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    profileIds: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Profile" }],
    logIds: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Log" }],
    createdBy: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
});
exports.logZodSchema = zod_1.default.object({
    eventId: zod_1.default.string(),
    description: zod_1.default.string(),
    dateTime: zod_1.default.coerce.date(),
});
const logSchema = new mongoose_1.default.Schema({
    eventId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Event" },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
});
const Profile = mongoose_1.default.model("Profile", profileSchema);
exports.Profile = Profile;
const Event = mongoose_1.default.model("Event", eventSchema);
exports.Event = Event;
const Log = mongoose_1.default.model("Log", logSchema);
exports.Log = Log;

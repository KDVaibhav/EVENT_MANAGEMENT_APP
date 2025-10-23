import { Router } from "express";
import { eventZodSchema, Profile, Event, Log } from "./schema.js";
import mongoose from "mongoose";
const router = Router();
router.get("/profile", async (req, res) => {
    const { searchTerm = "", skip = 0, limit = 10 } = req.query;
    const skipNumber = Number(skip);
    const limitNumber = Number(limit);
    try {
        const profiles = await Profile.find({
            profileName: { $regex: searchTerm, $options: "i" },
        })
            .skip(skipNumber)
            .limit(limitNumber);
        const totalCount = await Profile.countDocuments({
            profileName: { $regex: searchTerm, $options: "i" },
        });
        const hasMore = skipNumber + limitNumber < totalCount;
        return res.status(200).json({ profiles: profiles, hasMore });
    }
    catch (error) {
        console.error("Error fetching Profiles", error);
        return res.status(500).json({ message: "Error fetching profiles" });
    }
});
router.post("/profile", async (req, res) => {
    const { profileName } = req.body;
    if (typeof profileName !== "string") {
        return res.status(400).json({ message: "Invalid profileName" });
    }
    try {
        await Profile.create({
            profileName: profileName,
        });
        const profiles = await Profile.find().sort({ profileName: 1 }).limit(10);
        const totalCount = await Profile.countDocuments();
        const hasMore = 10 < totalCount;
        return res.status(201).json({ profiles, hasMore });
    }
    catch (error) {
        console.error("Error fetching Profiles", error);
        return res.status(500).json({ message: "Error fetching profiles" });
    }
});
router.get("/availableProfileName", async (req, res) => {
    const { searchTerm = "" } = req.query;
    try {
        const exists = await Profile.exists({
            profileName: { $regex: `^${searchTerm}$`, $options: "i" },
        });
        return res.status(200).json({ exists: !!exists });
    }
    catch (error) {
        console.error("Error fetching Profiles", error);
        return res.status(500).json({ message: "Error fetching profiles" });
    }
});
router.get("/events/:profileId", async (req, res) => {
    const { profileId } = req.params;
    const { skip = 0, limit = 10 } = req.query;
    const skipNumber = Number(skip);
    const limitNumber = Number(limit);
    if (typeof profileId !== "string") {
        return res.status(400).json({ message: "Invalid profileId" });
    }
    try {
        const profileEvents = await Event.find({
            profileIds: new mongoose.Types.ObjectId(profileId),
        })
            .populate("profileIds", "profileName")
            .sort({ startDateTime: 1 })
            .skip(skipNumber)
            .limit(limitNumber);
        const totalCount = await Event.countDocuments({
            profileIds: new mongoose.Types.ObjectId(profileId),
        });
        const hasMore = skipNumber + limitNumber < totalCount;
        return res.status(200).json({ profileEvents, hasMore });
    }
    catch (error) {
        console.error("Error Fetching Events", error);
        return res.status(500).json({ message: "Error Fetching Events" });
    }
});
router.post("/event", async (req, res) => {
    const parsed = eventZodSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error });
    }
    try {
        const profileId = parsed.data.createdBy;
        await Event.create(parsed.data);
        const profileEvents = await Event.find({
            profileIds: new mongoose.Types.ObjectId(profileId),
        })
            .populate("profileIds", "profileName")
            .sort({ startDateTime: 1 })
            .limit(10);
        const totalCount = await Event.countDocuments({
            profileIds: new mongoose.Types.ObjectId(profileId),
        });
        const hasMore = 10 < totalCount;
        return res.status(201).json({ profileEvents, hasMore });
    }
    catch (error) {
        console.error("Error Creating Events", error);
        return res.status(500).json({ message: "Error Creating Event" });
    }
});
router.delete("/event", async (req, res) => {
    const [eventId] = req.body;
    if (typeof eventId !== "string") {
        return res.status(400).json({ message: "Invalid eventId" });
    }
    try {
        await Event.deleteOne({ eventId });
        return res.status(200).json({ message: "Event Deleted Successfully" });
    }
    catch (error) {
        console.error("Error Deleting Events", error);
        return res.status(500).json({ message: "Error Deleting Events" });
    }
});
router.put("/event/:eventId", async (req, res) => {
    const { eventId } = req.params;
    const parsed = eventZodSchema.safeParse(req.body);
    const currentProfileId = req.body.currentProfileId;
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error });
    }
    try {
        let oldEvent = await Event.findById(eventId).populate("profileIds", "profileName");
        if (!oldEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        let newEvent = await Event.findByIdAndUpdate(eventId, parsed.data, {
            new: true,
        }).populate("profileIds", "profileName");
        if (!newEvent) {
            return res.status(404).json({ message: "Event not found after update" });
        }
        const descriptions = compareEvents(newEvent, oldEvent);
        if (descriptions && descriptions.length > 0) {
            const logPromises = descriptions.map(async (description) => {
                await Log.create({
                    eventId: newEvent._id,
                    description: description,
                    dateTime: parsed.data.updatedAt,
                });
            });
            await Promise.all(logPromises);
        }
        const profileEvents = await Event.find({
            profileIds: { $in: [currentProfileId] },
        })
            .populate("profileIds", "profileName")
            .sort({ startDateTime: 1 })
            .limit(10);
        const totalCount = await Event.countDocuments({
            profileIds: { $in: [currentProfileId] },
        });
        const hasMore = 10 < totalCount;
        return res.status(200).json({ profileEvents, hasMore });
    }
    catch (error) {
        console.error("Error updating Event", error);
        return res.status(500).json({ message: "Error updating events" });
    }
});
const compareEvents = (newEvent, oldEvent) => {
    let logDescription = [];
    const description = compareProfiles(oldEvent.profileIds, newEvent.profileIds);
    if (description)
        logDescription.push(description);
    if (newEvent.timeZone !== oldEvent.timeZone) {
        logDescription.push("TimeZone updated");
    }
    if (newEvent.startDateTime.toString() !== oldEvent.startDateTime.toString()) {
        logDescription.push("Start date/time updated");
    }
    if (newEvent.endDateTime.toString() !== oldEvent.endDateTime.toString()) {
        logDescription.push("End date/time updated");
    }
    console.log(logDescription);
    return logDescription;
};
const compareProfiles = (oldProfileIds, newProfileIds) => {
    const oldNames = oldProfileIds
        .map((p) => p.profileName)
        .sort()
        .join(", ");
    const newNames = newProfileIds
        .map((p) => p.profileName)
        .sort()
        .join(", ");
    if (oldNames !== newNames) {
        return `Profiles changed from to ${newNames}`;
    }
    return null;
};
router.get("/event/:eventId/logs", async (req, res) => {
    const { eventId } = req.params;
    const { skip = 0, limit = 10 } = req.query;
    const skipNumber = Number(skip);
    const limitNumber = Number(limit);
    if (typeof eventId !== "string") {
        return res.status(400).json({ message: "Invalid EventId" });
    }
    try {
        const eventLogs = await Log.find({
            eventId: new mongoose.Types.ObjectId(eventId),
        })
            .sort({ createdAt: -1 })
            .skip(skipNumber)
            .limit(limitNumber);
        const totalCount = await Log.countDocuments({
            eventId: new mongoose.Types.ObjectId(eventId),
        });
        const hasMore = skipNumber + limitNumber < totalCount;
        return res.status(200).json({ eventLogs, hasMore });
    }
    catch (error) {
        console.error("Error Fetching Logs", error);
        return res.status(500).json({ message: "Error Fetching Logs" });
    }
});
export default router;

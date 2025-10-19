import { Router } from "express";
import { Profile } from "./schema";
const router: Router = Router();

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
  } catch (error) {
    console.error("Error fetching Profiles", error);
    return res.status(500).json({ message: "Error fetching profiles" });
  }
});

router.post("/profile", async (req, res) => {
  const { profileName } = req.body;

  try {
    await Profile.create({
      profileName: profileName,
    });

    const profiles = await Profile.find().limit(10);
    return res.status(201).json({ profiles });
  } catch (error) {
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
  } catch (error) {
    console.error("Error fetching Profiles", error);
    return res.status(500).json({ message: "Error fetching profiles" });
  }
});

router.post("/event", async (req, res) => {
  const { profileName } = req.body;

  try {
    await Profile.create({
      profileName: profileName,
    });

    const profiles = await Profile.find().limit(10);
    return res.status(201).json({ profiles });
  } catch (error) {
    console.error("Error fetching Profiles", error);
    return res.status(500).json({ message: "Error fetching profiles" });
  }
});

export default router;

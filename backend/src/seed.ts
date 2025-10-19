import { Profile } from "./schema";

export const seedData = async () => {
  const admin = await Profile.findOne({
    profileName: "admin",
  });
  if (!admin) {
    try {
      await Profile.create({
        profileName: "admin",
      });
      console.log("Admin Seeded Successfully");
      return;
    } catch (error) {
      console.error("Error Seeding Admin", error);
    }
  }
  console.log("Admin Already Seeded");
};

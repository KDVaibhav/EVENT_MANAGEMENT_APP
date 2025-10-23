"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedData = void 0;
const schema_1 = require("./schema");
const seedData = async () => {
    const admin = await schema_1.Profile.findOne({
        profileName: "admin",
    });
    if (!admin) {
        try {
            await schema_1.Profile.create({
                profileName: "admin",
            });
            console.log("Admin Seeded Successfully");
            return;
        }
        catch (error) {
            console.error("Error Seeding Admin", error);
        }
    }
    console.log("Admin Already Seeded");
};
exports.seedData = seedData;

import mongoose from "mongoose";
let cachedConnection = null;
const connectDb = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }
    const connectionString = process.env.MONGO_URI;
    try {
        const client = await mongoose.connect(connectionString, {
            bufferCommands: false,
        });
        console.log("Server connected to DB");
        cachedConnection = client;
        return client;
    }
    catch (error) {
        console.error("Error Connecting MongoDB", error);
    }
};
export default connectDb;

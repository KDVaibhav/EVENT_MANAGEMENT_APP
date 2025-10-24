import mongoose from "mongoose";
let cachedConnection: any = null;

const connectDb = async () => {
  if (cachedConnection) {
    console.log("Using existing database connection");
    return cachedConnection;
  }
  const connectionString = process.env.MONGO_URI;

  console.log("🔧 Attempting database connection...");
  console.log("Connection string exists:", !!connectionString);

  if (!connectionString) {
    throw new Error(
      "MongoDB connection string is not defined. " +
        "Checked MONGODB_URI and MONGO_URI environment variables."
    );
  }

  try {
    const client = await mongoose.connect(connectionString!);
    console.log("Server connected to DB");
    cachedConnection = client;
    return client;
  } catch (error) {
    console.error("Error Connecting MongoDB", error);
    throw error;
  }
};

export default connectDb;

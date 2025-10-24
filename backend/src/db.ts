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
    console.log("✅ MongoDB Connected:", client.connection.host);
    console.log("✅ Database Name:", client.connection.name);
    cachedConnection = client;
    return client;
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.name === "MongooseServerSelectionError") {
      console.error("🔍 This usually means:");
      console.error("1. IP not whitelisted in MongoDB Atlas");
      console.error("2. Wrong connection string");
      console.error("3. Network issues");
    }
    throw error;
  }
};

export default connectDb;

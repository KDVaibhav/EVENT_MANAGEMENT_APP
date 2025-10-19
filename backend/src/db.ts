import mongoose from "mongoose";

const connectDb = async () => {
  const connectionString = process.env.MONGO_URI;

  try {
    const client = await mongoose.connect(connectionString!);
    console.log("Server connected to DB");
    return client;
  } catch (error) {
    console.error("Error Connecting MongoDB", error);
  }
};

export default connectDb;

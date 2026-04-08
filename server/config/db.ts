import mongoose from "mongoose";
import config from "./config";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("Mongodb connected successfully");
  } catch (error) {
    console.error("Error connecting to Mongodb:", error);
    process.exit(1);
  }
};

export default connectDB;

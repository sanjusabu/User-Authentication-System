import mongoose from "mongoose";
import { config } from "dotenv";

config();

const connectToDatabase = async () => {
  const dbUrl =
    "mongodb+srv://" +
    process.env.USERR +
    ":" +
    process.env.PASSWORD +
    "@cluster0.f8yjf.mongodb.net/" +
    process.env.DATABASE +
    "?retryWrites=true&w=majority";

  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
  }
};

export default connectToDatabase;

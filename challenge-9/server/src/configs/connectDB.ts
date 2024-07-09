import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("connected to DB"))
  .catch(() => console.log("failed to connect"));

import mongoose from "mongoose";
import { MONGO_URI } from "../../config/config.service.js";

const checkConnectionDB = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("failed to connect to database", error);
    });
};

export default checkConnectionDB;

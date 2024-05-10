import dotenv from "dotenv";
import express from 'express';
import connectDB from "./db/index.js";

// Initialize Express app
const app = express();

dotenv.config({
  path: "/.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB CONNECTION FAILED ", error);
  });

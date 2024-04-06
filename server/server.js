import express from "express";
import configRoutes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
import { handleCrash, handleRejection } from "./services/crashHandler.js";
dotenv.config();
import { createRoom, joinRoom, findRoom, updateSettings, removePlayer } from "./db/roomModule.js";
// await createRoom("Aidan", false, 5);
// await joinRoom("Joe", "TGNTGQ");
// await updateSettings("16be9e12-e105-4baa-8a3f-fbe4b2c49811", "XEanZd3HYibLagkVuwC9", true, 6);
// await removePlayer("16be9e12-e105-4baa-8a3f-fbe4b2c49811", "16be9e12-e105-4baa-8a3f-fbe4b2c49811", "XEanZd3HYibLagkVuwC9");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

process.on("uncaughtException", handleCrash);
process.on("unhandledRejection", handleRejection);

configRoutes(app);
app.listen(3000, async () => {
  console.log("We now have a server!");
});

import express from "express";
import configRoutes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
import { handleCrash, handleRejection } from "./services/crashHandler.js";
dotenv.config();
import { createRoom, joinRoom, findRoom, updateSettings, removePlayer, startGame } from "./db/roomModule.js";
import { createDecks, getDeck, getCard } from "./db/cardsModule.js";
import { drivePlayer } from "./db/gameModule.js";
// await createRoom("Aidan", false, 5);
// await joinRoom("Joe", "PVGLMU");
// await startGame("dd1c6afc-98e5-4556-8c51-71ebdcbbbf78", "5Z2spcFnF5PMXrxJEzdn");
// await drivePlayer("dd1c6afc-98e5-4556-8c51-71ebdcbbbf78", "5Z2spcFnF5PMXrxJEzdn", "Babbio");
// await updateSettings("16be9e12-e105-4baa-8a3f-fbe4b2c49811", "XEanZd3HYibLagkVuwC9", true, 6);
// await removePlayer("16be9e12-e105-4baa-8a3f-fbe4b2c49811", "16be9e12-e105-4baa-8a3f-fbe4b2c49811", "XEanZd3HYibLagkVuwC9");
// await createDecks();
// console.log(await getDeck("infection"));
// console.log(await getDeck("player"));
// console.log(await getCard("player", 1));


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

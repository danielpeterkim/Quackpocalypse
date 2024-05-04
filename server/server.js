import express from "express";
import configRoutes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
import { handleCrash, handleRejection } from "./services/crashHandler.js";
dotenv.config();
import { createRoom, joinRoom, findRoom, updateSettings, removePlayer, startGame } from "./db/roomModule.js";
import { createDecks, getDeck, getCard } from "./db/cardsModule.js";
import { drivePlayer, endTurn, drawPlayerCards, discardPlayerCards, resolveEpidemic } from "./db/gameModule.js";
// await createRoom("Aidan", false, 5);
// await joinRoom("Joe", "MWSFSO");
// await startGame("82c847a4-a561-4356-85d8-9bc08b36c044", "f9Gvb6TKAdcTCwtlYNiB");
// await drivePlayer("92943f00-ea8e-4829-af26-2cf4b647c2ae", "IfODjNkJnG1KS6GDCiZ2", "Burchard");
// await drawPlayerCards("b546741c-2256-45a4-9a25-5bce83c82336", "f9Gvb6TKAdcTCwtlYNiB");
// await discardPlayerCards("b546741c-2256-45a4-9a25-5bce83c82336", "f9Gvb6TKAdcTCwtlYNiB", [36, 26]);
// await resolveEpidemic("b546741c-2256-45a4-9a25-5bce83c82336", "f9Gvb6TKAdcTCwtlYNiB");
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

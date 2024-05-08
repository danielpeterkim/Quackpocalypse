import express from "express";
import configRoutes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
import { handleCrash, handleRejection } from "./services/crashHandler.js";
dotenv.config();
import { createRoom, joinRoom, findRoom, updateSettings, removePlayer, startGame, getRoomData} from "./db/roomModule.js";
import { createDecks, getDeck, getCard } from "./db/cardsModule.js";
import { takeAction, endTurn, drawPlayerCards, discardPlayerCards, resolveEpidemic, getDiseaseColors, getLegalActions} from "./db/gameModule.js";
// await createRoom("Dan", false, 5);
// await joinRoom("Joe", "UMYKDJ");
// await startGame("9e5eb63f-3dff-41d6-9569-5684bc4d3a5c", "uMzUBbDnVQUDxRnkxeb5");
// await takeAction("4c9eb41b-a229-4412-bea1-710d51fbb892", "rXZWjcOUmzyRNAghJ5mE", {action: "drive", location: "Burchard"});
// await takeAction("4c9eb41b-a229-4412-bea1-710d51fbb892", "rXZWjcOUmzyRNAghJ5mE", {action: "direct flight", index: 0})
// await drawPlayerCards("4c9eb41b-a229-4412-bea1-710d51fbb892", "rXZWjcOUmzyRNAghJ5mE");
// await endTurn("4c9eb41b-a229-4412-bea1-710d51fbb892", "rXZWjcOUmzyRNAghJ5mE");
// await createDecks();

// await takeAction("9cf6bcac-d782-4b5e-a8b5-a4369b82c039", "rXZWjcOUmzyRNAghJ5mE", {action: "shuttleFlight", location: "Duck Bistro"});
// await takeAction("9cf6bcac-d782-4b5e-a8b5-a4369b82c039", "rXZWjcOUmzyRNAghJ5mE", {action: "directFlight", index: 0});
// await takeAction("9cf6bcac-d782-4b5e-a8b5-a4369b82c039", "rXZWjcOUmzyRNAghJ5mE", {action: "drive", location: "Soccer Field"});
// await takeAction("9cf6bcac-d782-4b5e-a8b5-a4369b82c039", "rXZWjcOUmzyRNAghJ5mE", {action: "drive", location: "Baseball Field"});
// await takeAction("9cf6bcac-d782-4b5e-a8b5-a4369b82c039", "rXZWjcOUmzyRNAghJ5mE", {action: "shuttle flight", location: "Duck Bistro"});
// await takeAction("9cf6bcac-d782-4b5e-a8b5-a4369b82c039", "rXZWjcOUmzyRNAghJ5mE", {action: "build"})
// await takeAction("9cf6bcac-d782-4b5e-a8b5-a4369b82c039", "rXZWjcOUmzyRNAghJ5mE", {action: "treat", color: "blue"})
// await takeAction("9cf6bcac-d782-4b5e-a8b5-a4369b82c039", "rXZWjcOUmzyRNAghJ5mE", {action: "share", playerId: "4c9eb41b-a229-4412-bea1-710d51fbb892", cardIndex: 0})
// await takeAction("9cf6bcac-d782-4b5e-a8b5-a4369b82c039", "rXZWjcOUmzyRNAghJ5mE", {action: "cure", cardIndices: [0, 1, 2, 3, 5]});

// console.log(await getLegalActions("9cf6bcac-d782-4b5e-a8b5-a4369b82c039", "rXZWjcOUmzyRNAghJ5mE"));

// await discardPlayerCards("b546741c-2256-45a4-9a25-5bce83c82336", "f9Gvb6TKAdcTCwtlYNiB", [36, 26]);
// await resolveEpidemic("9e5eb63f-3dff-41d6-9569-5684bc4d3a5c", "uMzUBbDnVQUDxRnkxeb5");
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
  console.log("We now have a server at http://localhost:3000/ !");
});

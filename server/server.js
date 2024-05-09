import express from "express";
import configRoutes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
import { handleCrash, handleRejection } from "./services/crashHandler.js";
dotenv.config();
import { createRoom, joinRoom, findRoom, updateSettings, removePlayer, startGame, getRoomData } from "./db/roomModule.js";
import { createDecks, getDeck, getCard } from "./db/cardsModule.js";
import { takeAction, endTurn, drawPlayerCards, discardPlayerCards, resolveEpidemic, getDiseaseColors, getLegalActions } from "./db/gameModule.js";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

process.on("uncaughtException", handleCrash);
process.on("unhandledRejection", handleRejection);

configRoutes(app);
const server = app.listen(3000, async () => {
    console.log("We now have a server at http://localhost:3000/ !");
});

// const io = new Server(server, {
//     cors: {
//         origin: "*", // Adjust this to match your client URL
//         methods: ["GET", "POST"],
//     },
// });

// io.on("connection", (socket) => {
//     console.log("New client connected");

//     socket.on("join-room", (roomId) => {
//         socket.join(roomId);
//         console.log(`Client joined room: ${roomId}`);
//     });

//     socket.on("offer", (roomId, offer) => {
//         socket.to(roomId).emit("offer", offer);
//     });

//     socket.on("answer", (roomId, answer) => {
//         socket.to(roomId).emit("answer", answer);
//     });

//     socket.on("ice-candidate", (roomId, candidate) => {
//         socket.to(roomId).emit("ice-candidate", candidate);
//     });

//     socket.on("send-message", (roomId, message) => {
//         console.log("Received message:", message);
//         socket.to(roomId).emit("message", message);
//     });

//     socket.on("disconnect", () => {
//         console.log("Client disconnected");
//     });
// }
// );
console.log("Hello world")
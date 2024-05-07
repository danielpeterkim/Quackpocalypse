import express from 'express';
import { createRoom, joinRoom, findRoom, startGame } from "../db/roomModule.js";
import { getRoomData } from "../db/roomModule.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("This is a server!");
});

router.post('/create-room', async (req, res) => {
    try {
        const { name, hiddenHands, epidemicCards } = req.body;
        const roomId = await createRoom(name, hiddenHands, epidemicCards);
        res.json({ roomId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/join-room', async (req, res) => {
    try {
        const { name, roomCode } = req.body;
        const roomId = await joinRoom(name, roomCode);
        res.json({ roomId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/room-data', async(req, res) => {
  try {
    const { roomId } = req.body;
    const info = await getRoomData(roomId);
    res.json(info);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

router.post('/start-game', async(req, res) => {
  try {
    const { playerId, roomId } = req.body;
    // console.log(name);
    // console.log(roomCode);
    console.log(playerId);
    console.log(roomId);
    const info = await startGame(playerId, roomId);
    console.log(info)
    res.json(info);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

const setupRoutes = (app) => {
  app.use("/", router);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default setupRoutes;

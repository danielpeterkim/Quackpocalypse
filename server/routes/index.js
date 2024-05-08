import express from "express";
import { createRoom, joinRoom, findRoom, startGame, removePlayer } from "../db/roomModule.js";
import { getRoomData } from "../db/roomModule.js";
import { checkPlayer, endTurn, takeAction, drawPlayerCards, discardPlayerCards, resolveEpidemic, getDiseaseColors, getLegalActions } from "../db/gameModule.js";
import { getCard } from "../db/cardsModule.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send("This is a server!");
});

router.post("/create-room", async (req, res) => {
    try {
        const { name, hiddenHands, epidemicCards } = req.body;
        const roomId = await createRoom(name, hiddenHands, epidemicCards);
        res.json({ roomId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/join-room", async (req, res) => {
    try {
        const { name, roomCode } = req.body;
        const roomId = await joinRoom(name, roomCode);
        res.json({ roomId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/room-data", async (req, res) => {
    try {
        const { roomId } = req.body;
        const info = await getRoomData(roomId);
        res.json(info);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/start-game", async (req, res) => {
    try {
        const { playerId, roomId } = req.body;
        // console.log(name);
        // console.log(roomCode);
        // console.log(playerId);
        const info = await startGame(playerId, roomId);
        // console.log(info)
        res.json(info);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/remove-player", async(req,res) => {
  try{
    const { creatorId, userId, roomId } = req.body;
    const id = await removePlayer(creatorId, userId, roomId);
    res.json(id);
  } catch(error){
    res.status(400).json({ error: error.message });
  }
})

router.post('/take-action', async(req,res) => {
  try{
    const {playerId, roomId, args} = req.body;
    // console.log(playerId);
    // console.log(roomId);
    // console.log(args);
    await takeAction(playerId, roomId, args);
  } catch (error){ 
    res.status(400).json({ error: error.message });
  }
})
router.get('/get-card', async (req, res) => {
  const { deckType, cardId } = req.query;
  try {
      const card = await getCard(deckType, parseInt(cardId));
      if (card) {
          res.json(card);
      } else {
          res.status(404).json({ error: "Card not found" });
      }
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

router.post("/draw-card", async (req, res) => {
    const {playerId, roomId} = req.body;
    try {
        await drawPlayerCards(playerId, roomId);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/end-turn", async (req, res) => {
    const { playerId, roomId } = req.body;
    try {
        await endTurn(playerId, roomId);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/discard-cards", async (req, res) => {
    const { playerId, roomId, cards } = req.body;
    try {
        await discardPlayerCards(playerId, roomId, cards);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/resolve-epidemic", async (req, res) => {
    const { playerId, roomId } = req.body;
    try {
        await resolveEpidemic(playerId, roomId);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/draw-card", async (req, res) => {
    const { playerId, roomId } = req.body;
    try {
        await drawPlayerCards(playerId, roomId);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/end-turn", async (req, res) => {
    const { playerId, roomId } = req.body;
    try {
        await endTurn(playerId, roomId);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/discard-cards", async (req, res) => {
    const { playerId, roomId, cards } = req.body;
    try {
        await discardPlayerCards(playerId, roomId, cards);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/resolve-epidemic", async (req, res) => {
    const { playerId, roomId } = req.body;
    try {
        await resolveEpidemic(playerId, roomId);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const setupRoutes = (app) => {
    app.use("/", router);

    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

export default setupRoutes;

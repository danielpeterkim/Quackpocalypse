import express from "express";
import { createRoom, joinRoom, findRoom, startGame, removePlayer } from "../db/roomModule.js";
import { getRoomData } from "../db/roomModule.js";
import { checkPlayer, endTurn, takeAction, drawPlayerCards, discardPlayerCards, resolveEpidemic, getDiseaseColors, getLegalActions } from "../db/gameModule.js";
import { getCard } from "../db/cardsModule.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import verifyToken from "./middleware.js";
dotenv.config();
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send("This is a server!");
});

router.post("/create-room", async (req, res) => {
    try {
        const { name, hiddenHands, epidemicCards } = req.body;
        const [roomId, playerId] = await createRoom(name, hiddenHands, epidemicCards);
        const token = jwt.sign({ name, roomId, playerId }, process.env.JWT_SECRET);
        res.json({ roomId, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/join-room", async (req, res) => {
    try {
        const { name, roomCode } = req.body;
        const [roomId, playerId] = await joinRoom(name, roomCode);
        const token = jwt.sign({ name, roomId, playerId }, process.env.JWT_SECRET);
        res.json({ roomId, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/room-data", verifyToken, async (req, res) => {
    try {
        const { roomId } = req.body;
        if (!roomId) {
            throw new Error("Room ID is required");
        }
        if (!req.token) {
            return res.status(403).json({
                error: "Access Denied",
            });
        }
        if (req.token.roomId !== roomId) {
            return res.status(403).json({
                error: "Access Denied",
            });
        }
        const info = await getRoomData(roomId);
        res.json(info);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/start-game", verifyToken, async (req, res) => {
    try {
        const { playerId, roomId } = req.body;
        // console.log(name);
        // console.log(roomCode);
        // console.log(playerId);
        if (!roomId) {
            throw new Error("Room ID is required");
        }
        if (!req.token) {
            return res.status(403).json({
                error: "Access Denied",
            });
        }
        if (req.token.roomId !== roomId) {
            return res.status(403).json({
                error: "Access Denied",
            });
        }
        if (!playerId) {
            throw new Error("Player ID is required");
        }
        if (playerId !== req.token.playerId) {
            return res.status(403).json({
                error: "Access Denied",
            });
        }
        const info = await startGame(playerId, roomId);
        // console.log(info)
        res.json(info);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/remove-player", verifyToken, async (req, res) => {
    try {
        const { creatorId, userId, roomId } = req.body;
        if (!roomId || !userId || !creatorId) {
            throw new Error("IDs are required");
        }
        if (!req.token) {
            return res.status(403).json({
                error: "Access Denied",
            });
        }
        if (req.token.roomId !== roomId) {
            return res.status(403).json({
                error: "Access Denied",
            });
        }
        if (creatorId !== req.token.playerId) {
            return res.status(403).json({
                error: "Access Denied",
            });
        }
        const id = await removePlayer(creatorId, userId, roomId);
        res.json(id);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/take-action", verifyToken, async (req, res) => {
    try {
        const { playerId, roomId, args } = req.body;
        if (!roomId || !playerId || !args) {
            throw new Error("Missing required fields");
        }
        if (!req.token) {
            throw new Error("Invalid token");
        }
        if (req.token.roomId !== roomId) {
            throw new Error("Token does not match room ID");
        }
        if (req.token.playerId !== playerId) {
            return res.status(403).json({
                error: "Access Denied",
            });
        }
        // console.log(playerId);
        // console.log(roomId);
        await takeAction(playerId, roomId, args);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get("/get-card", async (req, res) => {
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

router.post("/draw-card", verifyToken, async (req, res) => {
    const { playerId, roomId } = req.body;
    if (!playerId || !roomId) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (!req.token) {
        return res.status(403).json({ error: "Invalid token" });
    }
    if (req.token.roomId !== roomId) {
        return res.status(403).json({ error: "Token does not match room ID" });
    }
    if (req.token.playerId !== playerId) {
        return res.status(403).json({ error: "Access Denied" });
    }
    try {
        await drawPlayerCards(playerId, roomId);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/end-turn", verifyToken, async (req, res) => {
    const { playerId, roomId } = req.body;
    if (!playerId || !roomId) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (!req.token) {
        return res.status(403).json({ error: "Invalid token" });
    }
    if (req.token.roomId !== roomId) {
        return res.status(403).json({ error: "Token does not match room ID" });
    }
    if (req.token.playerId !== playerId) {
        return res.status(403).json({ error: "Access Denied" });
    }
    try {
        await endTurn(playerId, roomId);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/discard-cards", verifyToken, async (req, res) => {
    const { playerId, roomId, cards } = req.body;
    if (!playerId || !roomId || !cards) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (!req.token) {
        return res.status(403).json({ error: "Invalid token" });
    }
    if (req.token.roomId !== roomId) {
        return res.status(403).json({ error: "Token does not match room ID" });
    }
    if (req.token.playerId !== playerId) {
        return res.status(403).json({ error: "Access Denied" });
    }
    try {
        await discardPlayerCards(playerId, roomId, cards);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/resolve-epidemic", verifyToken, async (req, res) => {
    const { playerId, roomId } = req.body;
    if (!playerId || !roomId) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (!req.token) {
        return res.status(403).json({ error: "Invalid token" });
    }
    if (req.token.roomId !== roomId) {
        return res.status(403).json({ error: "Token does not match room ID" });
    }
    if (req.token.playerId !== playerId) {
        return res.status(403).json({ error: "Access Denied" });
    }
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

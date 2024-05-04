import { db } from "../config/firebase-config.js";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, query, where, getDocs } from "firebase/firestore";
import validation from "../services/validation.js";
import helpers from "../services/helpers.js";
const { shuffleArray, generateRoomCode, locationsInit, infectionDeckInit, playerDeckInit } = helpers;
import { v4 as uuidv4 } from "uuid";
import { getCard } from "./cardsModule.js";
const roomCollection = collection(db, "rooms");

const createRoom = async (name, hiddenHands, epidemicCards) => {
    try {
        if (!validation.nameValidation(name)) {
            throw new Error("Invalid name");
        }
        if (hiddenHands !== true && hiddenHands !== false) {
            throw new Error("Invalid hidden hands");
        }
        if (epidemicCards < 4 || epidemicCards > 6) {
            throw new Error("Invalid epidemic cards");
        }
        let locations = locationsInit;
        const userId = uuidv4();

        const roomDoc = {
            roomCode: generateRoomCode(),
            roomCreator: userId,
            createdAt: serverTimestamp(),
            players: {
                [userId]: {
                    name: name,
                    location: "Babbio",
                    role: null,
                    hand: [],
                    actionsRemaining: 4,
                    drewCards: false,
                },
            },
            gameStatus: "waiting",
            locations: locations,
            outbreakCounter: 0,
            cureMarkers: {
                red: false,
                yellow: false,
                blue: false,
                black: false,
            },
            infectionRate: 2,
            gameSettings: {
                hiddenHands: hiddenHands,
                epidemicCards: epidemicCards,
            },
            infectionDeck: infectionDeckInit,
            playerDeck: playerDeckInit,
            infectionDiscard: [],
            playerDiscard: [],
            turnOrder: [],
        };

        const docRef = await addDoc(roomCollection, roomDoc);
        return docRef.id;
    } catch (error) {
        throw new Error("Error Creating Room: " + error.message);
    }
};

const findRoom = async (roomcode) => {
    try {
        const roomQuery = query(roomCollection, where("roomCode", "==", roomcode));
        const roomQuerySnapshot = await getDocs(roomQuery);
        if (roomQuerySnapshot.empty) {
            throw new Error("Room does not exist");
        }
        const roomId = roomQuerySnapshot.docs[0].id;
        return roomId;
    } catch (error) {
        throw new Error("Error Finding Room: " + error.message);
    }
};

const joinRoom = async (name, roomCode) => {
    try {
        const userId = uuidv4();
        const roomId = await findRoom(roomCode);
        if (!validation.nameValidation(name)) {
            throw new Error("Invalid name");
        }

        const room = doc(db, "rooms", roomId);
        const roomInfo = await getDoc(room);
        if (!roomInfo.exists()) {
            throw new Error("Room does not exist");
        }
        const roomData = roomInfo.data();
        if (roomData.roomCode !== roomCode) {
            throw new Error("Invalid room code");
        }
        if (roomData.players.length >= 4) {
            throw new Error("Room is full");
        }
        if (roomData.gameStatus !== "waiting") {
            throw new Error("Game has already started");
        }
        if (Object.values(roomData.players).some((player) => player.name === name)) {
            throw new Error("Name already taken");
        }
        const playerData = {
            name: name,
            location: "Babbio",
            role: null,
            hand: {},
            actionsRemaining: 4,
            drewCards: false,
        };
        await updateDoc(room, {
            [`players.${userId}`]: playerData,
        });
        return roomId;
    } catch (error) {
        throw new Error("Error Joining Room: " + error.message);
    }
};

const updateSettings = async (userId, roomId, hiddenHands, epidemicCards) => {
    try {
        if (hiddenHands !== true && hiddenHands !== false) {
            throw new Error("Invalid hidden hands");
        }
        if (epidemicCards < 4 || epidemicCards > 6) {
            throw new Error("Invalid epidemic cards");
        }
        const room = doc(db, "rooms", roomId);
        const roomInfo = await getDoc(room);
        if (!roomInfo.exists()) {
            throw new Error("Room does not exist");
        }
        const roomData = roomInfo.data();
        if (roomData.roomCreator !== userId) {
            throw new Error("User is not the room host");
        }
        await updateDoc(room, {
            gameSettings: {
                hiddenHands: hiddenHands,
                epidemicCards: epidemicCards,
            },
        });
        return roomId;
    } catch (error) {
        throw new Error("Error Updating Settings: " + error.message);
    }
};

const removePlayer = async (creatorId, userId, roomId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomInfo = await getDoc(room);
        if (!roomInfo.exists()) {
            throw new Error("Room does not exist");
        }
        const roomData = roomInfo.data();
        if (roomData.roomCreator !== creatorId) {
            throw new Error("User is not the room host");
        }
        if (!roomData.players[userId]) {
            throw new Error("Player does not exist");
        }
        if (creatorId === userId) {
            throw new Error("Cannot remove the room host");
        }
        const updatedPlayers = { ...roomData.players };
        delete updatedPlayers[userId];

        await updateDoc(room, {
            players: updatedPlayers,
        });
        return roomId;
    } catch (error) {
        throw new Error("Error Removing Player: " + error.message);
    }
};

const startGame = async (userId, roomId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomInfo = await getDoc(room);
        if (!roomInfo.exists()) {
            throw new Error("Room does not exist");
        }
        const roomData = roomInfo.data();
        if (roomData.roomCreator !== userId) {
            throw new Error("User is not the room host");
        }
        if (Object.keys(roomData.players).length < 2) {
            throw new Error("Not enough players");
        }
        if (roomData.gameStatus !== "waiting") {
            throw new Error("Game has already started");
        }

        // shuffle decks
        let infectionDeck = roomData.infectionDeck;
        shuffleArray(infectionDeck);
        let playerDeck = roomData.playerDeck;
        shuffleArray(playerDeck);


        // deal cards, randomly assign roles, and determine turn order
        const roles = ["Dispatcher", "Medic", "Scientist", "Researcher", "Operations Expert", "Contingency Planner"];
        shuffleArray(roles);
        let cardsPerPlayer = 0;
        const playerCount = Object.keys(roomData.players).length;
        if (playerCount === 2) {
            cardsPerPlayer = 4;
        } else if (playerCount === 3) {
            cardsPerPlayer = 3;
        } else if (playerCount === 4) {
            cardsPerPlayer = 2;
        }
        let updatePayload = {};
        let turnOrder = [];
        for (const player in roomData.players) {
            let playerHand = [];
            for (let i = 0; i < cardsPerPlayer; i++) {
                playerHand.push(playerDeck.pop());
            }
            turnOrder.push(player);
            let role = roles.pop();
            updatePayload[`players.${player}.role`] = role;
            updatePayload[`players.${player}.hand`] = playerHand;
        }
        shuffleArray(turnOrder);

        // add epidemics to player deck
        const epidemicCards = roomData.gameSettings.epidemicCards;
        const pileSize = Math.floor(playerDeck.length / epidemicCards);
        let playerDeckWithEpidemics = [];
        for (let i = 0; i < epidemicCards; i++) {
            let pile = playerDeck.splice(0, pileSize); 
            pile.push('epidemic');
            shuffleArray(pile);
            playerDeckWithEpidemics = playerDeckWithEpidemics.concat(pile);
        }

        // initial infection
        let infectionDiscard = [];
        for (let i = 0; i < 3; i++) {
            let cardId = infectionDeck.pop();
            let card = await getCard("infection", cardId);
            let location = card.location;
            let color = card.color;
            updatePayload[`locations.${location}.diseaseCubes.${color}`] = 3;
            infectionDiscard.push(cardId);
        }
        for (let i = 0; i < 3; i++) {
            let cardId = infectionDeck.pop();
            let card = await getCard("infection", cardId);
            let location = card.location;
            let color = card.color;
            updatePayload[`locations.${location}.diseaseCubes.${color}`] = 2;
            infectionDiscard.push(cardId);
        }
        for (let i = 0; i < 3; i++) {
            let cardId = infectionDeck.pop();
            let card = await getCard("infection", cardId);
            let location = card.location;
            let color = card.color;
            updatePayload[`locations.${location}.diseaseCubes.${color}`] = 1;
            infectionDiscard.push(cardId);
        }

        // update room document
        let gameStateUpdates = {
            ...updatePayload,
            infectionDeck: infectionDeck,
            playerDeck: playerDeckWithEpidemics,
            gameStatus: "playing",
            infectionDiscard: infectionDiscard,
            turnOrder: turnOrder,
        };
        await updateDoc(room, gameStateUpdates);

        return roomId;
    } catch (error) {
        throw new Error("Error Starting Game: " + error.message);
    }
};

export { createRoom, joinRoom, findRoom, updateSettings, removePlayer, startGame };

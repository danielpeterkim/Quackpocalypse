import { db } from "../config/firebase-config.js";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, query, where, getDocs } from "firebase/firestore";
import validation from "../services/validation.js";
import { v4 as uuidv4 } from "uuid";

// shuffle city cards
// when game starts randomly select 1 city card and add 3 disease cubes of the color on the card to that city, repeat for 3 total cities
// repeat 3 more times with 2 disease cubes
// repeat 3 more times with 1 disease cube
// randomly assign a role to each player
// give cards to each player, 4 for 2 players, 3 for 3 players, 2 for 4 players
// depending on how many epidemic cards are in the deck and how many players are in the game, split the deck into that many piles and shuffle an epidemic card into each pile
// highest city population goes first

const generateRoomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const roomCollection = collection(db, "rooms");

const diseaseCubeInit = {
    red: 0,
    yellow: 0,
    blue: 0,
    black: 0,
}

const locationsInit  =  {
            Babbio: { diseaseCubes: diseaseCubeInit, researchStation: true },
            Carnegie: { diseaseCubes: diseaseCubeInit, researchStation: false },
            Burchard: { diseaseCubes: diseaseCubeInit, researchStation: false },
            McLean: { diseaseCubes: diseaseCubeInit, researchStation: false },
            Howe: { diseaseCubes: diseaseCubeInit, researchStation: false },
            Schaefer: { diseaseCubes: diseaseCubeInit, researchStation: false },
            Tech: { diseaseCubes: diseaseCubeInit, researchStation: false },
            Walker: { diseaseCubes: diseaseCubeInit, researchStation: false },
            "Davis Hall": { diseaseCubes: diseaseCubeInit, researchStation: false },
            "Edwin A. Stevens": { diseaseCubes: diseaseCubeInit, researchStation: false },
            "Howe Center": { diseaseCubes: diseaseCubeInit, researchStation: false },
            Library: { diseaseCubes: diseaseCubeInit, researchStation: false },
            "Jonas Hall": { diseaseCubes: diseaseCubeInit, researchStation: false },
        };

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
        const docRef = await addDoc(roomCollection, {
            roomCode: generateRoomCode(),
            roomCreator: userId,
            createdAt: serverTimestamp(),
            players: {
                [userId]: {
                    name: name,
                    location: "atlanta",
                    role: null,
                    hand: {},
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
        });
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
            location: "atlanta",
            role: null,
            hand: {},
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

// const startGame = async (userId, roomId) => {
//     try {
//         const room = doc(db, "rooms", roomId);
//         const roomInfo = await getDoc(room);
//         if (!roomInfo.exists()) {
//             throw new Error("Room does not exist");
//         }
//         const roomData = roomInfo.data();
//         if (roomData.roomCreator !== userId) {
//             throw new Error("User is not the room host");
//         }
//         if (Object.keys(roomData.players).length < 2) {
//             throw new Error("Not enough players");
//         }
//         if (roomData.gameStatus !== "waiting") {
//             throw new Error("Game has already started");
//         }
//         return roomId;
//     } catch (error) {
//         throw new Error("Error Starting Game: " + error.message);
//     }
// };

export { createRoom, joinRoom, findRoom, updateSettings, removePlayer };

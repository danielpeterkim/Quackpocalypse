import { db } from "../config/firebase-config.js";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, query, where, getDocs } from "firebase/firestore";

const checkPlayer = async (playerId, roomId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomInfo = await getDoc(room);
        if (!roomInfo.exists()) {
            throw new Error("Room does not exist");
        }
        const roomData = roomInfo.data();
        if (!roomData.players[playerId]) {
            throw new Error("Player does not exist");
        }
        if (roomData.gameStatus !== "playing") {
            throw new Error("Game has not started or has ended");
        }
        if (roomData.turnOrder[0] !== playerId) {
            throw new Error("Not player's turn");
        }
        if (roomData.players[playerId].actionsRemaining < 1) {
            throw new Error("No actions left");
        }
        return roomData;
    } catch (error) {
        throw new Error("Error Checking Player: " + error.message);
    }
};

const endTurn = async (playerId, roomId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomInfo = await getDoc(room);
        if (!roomInfo.exists()) {
            throw new Error("Room does not exist");
        }
        const roomData = roomInfo.data();
        const turnOrder = roomData.turnOrder;
        const nextPlayer = turnOrder.shift();
        turnOrder.push(nextPlayer);
        const actionsRemaining = 4;
        // ! TO DO: Draw player cards and anything else that happens at the end of a turn
        await updateDoc(room, {
            turnOrder: turnOrder,
            [`players.${playerId}.actionsRemaining`]: actionsRemaining,
        });
    } catch (error) {
        throw new Error("Error Ending Turn: " + error.message);
    }
};

const drivePlayer = async (playerId, roomId, newLocation) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        const playerLocation = roomData.players[playerId].location;
        const playerLocationObject = roomData.locations[playerLocation];
        const adjacentLocations = playerLocationObject.adjacent;
        if (!adjacentLocations.includes(newLocation)) {
            throw new Error("Location is not adjacent to player's current location");
        }
        let actionsRemaining = roomData.players[playerId].actionsRemaining - 1;
        await updateDoc(room, {
            [`players.${playerId}.location`]: newLocation,
            [`players.${playerId}.actionsRemaining`]: actionsRemaining,
        });
        if (actionsRemaining < 1) {
            await endTurn(playerId, roomId);
        }
    } catch (error) {
        throw new Error("Error Driving Player: " + error.message);
    }
};

export { checkPlayer, endTurn, drivePlayer };

import { db } from "../config/firebase-config.js";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, query, where, getDocs } from "firebase/firestore";
import { getCard, getLocationId } from "./cardsModule.js";

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
        if (turnOrder[0] !== playerId) {
            throw new Error("Not player's turn");
        }
        const playerHand = roomData.players[playerId].hand;
        if (playerHand.length > 7) {
            throw new Error("Player must discard cards before ending turn.");
        }
        if (roomData.players[playerId].drewCards === false) {
            throw new Error("Player must draw cards before ending turn.");
        }
        const nextPlayer = turnOrder.shift();
        turnOrder.push(nextPlayer);
        const actionsRemaining = 4;
        await updateDoc(room, {
            turnOrder: turnOrder,
            [`players.${playerId}.actionsRemaining`]: actionsRemaining,
            [`players.${playerId}.drewCards`]: false,
        });
    } catch (error) {
        throw new Error("Error Ending Turn: " + error.message);
    }
};

const drawPlayerCards = async (playerId, roomId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomInfo = await getDoc(room);
        if (!roomInfo.exists()) {
            throw new Error("Room does not exist");
        }
        const roomData = roomInfo.data();
        const playerDeck = roomData.playerDeck;
        if (playerDeck.length < 2) {
            throw new Error("Not enough cards in player deck");
            // ! END GAME, THEY LOSE
        }
        if (roomData.players[playerId].drewCards === true) {
            throw new Error("Player has already drawn cards this turn");
        }
        const newPlayerCards = playerDeck.splice(0, 2);
        const playerCards = roomData.players[playerId].hand.concat(newPlayerCards);
        await updateDoc(room, {
            [`players.${playerId}.hand`]: playerCards,
            playerDeck: playerDeck,
            [`players.${playerId}.drewCards`]: true,
        });
    } catch (error) {
        throw new Error("Error Drawing Player Cards: " + error.message);
    }
};

const resolveEpidemic = async (playerId, roomId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        let playerHand = roomData.players[playerId].hand;
        if (!playerHand.includes("epidemic")) {
            throw new Error("Player does not have an epidemic card to resolve");
        }
        let infectionDeck = roomData.infectionDeck;
        let infectionDiscard = roomData.infectionDiscard;
        const lastCard = infectionDeck.pop();
        console.log(lastCard);
        infectionDiscard.push(lastCard);
        const card = await getCard("infection", lastCard);
        console.log(card);
        const location = card.location;
        const color = card.color;
        playerHand = playerHand.filter((card) => card !== "epidemic");
        if (roomData.cureMarkers[color] === false) {
            const locationObject = roomData.locations;
            let locationDisease = locationObject[location].diseaseCubes[color];
            if (locationDisease === 1) {
                await Outbreak(location, color, locationObject);
            } else {
                locationDisease = 3;
            }
            console.log(locationDisease);
            await updateDoc(room, {
                infectionRate: roomData.infectionRate + 1,
                [`locations.${location}.diseaseCubes.${color}`]: locationDisease,
                infectionDeck: infectionDeck,
                infectionDiscard: infectionDiscard,
                [`players.${playerId}.hand`]: playerHand,
            });
        } else {
            await updateDoc(room, {
                infectionRate: roomData.infectionRate + 1,
                [`players.${playerId}.hand`]: playerHand,
            });
        }
    } catch (error) {
        throw new Error("Error Resolving Epidemic: " + error.message);
    }
};

const Outbreak = async (location, color, locationObject) => {
    // ! TO DO
    try {
    } catch (error) {
    }
};

const discardPlayerCards = async (playerId, roomId, cards) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomInfo = await getDoc(room);
        if (!roomInfo.exists()) {
            throw new Error("Room does not exist");
        }
        const roomData = roomInfo.data();
        const playerHand = roomData.players[playerId].hand;
        if (cards.length > 2) {
            throw new Error("Cannot discard more than 2 cards");
        }
        if (cards.length < 1) {
            throw new Error("Must discard at least 1 card");
        }
        if (playerHand.some((card) => card === "epidemic")) {
            throw new Error("Epidemic card(s) must be resolved before anything else.");
        }
        if (playerHand.length < 8) {
            throw new Error("Player does not have enough cards to discard");
        }
        if (cards.some((card) => !playerHand.includes(card))) {
            throw new Error("Player does not have one or more of the cards to discard");
        }
        console.log(playerHand);
        console.log(cards);
        const newHand = playerHand.filter((card) => !cards.includes(card));
        console.log(newHand);
        await updateDoc(room, {
            [`players.${playerId}.hand`]: newHand,
        });
    } catch (error) {
        throw new Error("Error Discarding Player Cards: " + error.message);
    }
};

const takeAction = async(playerId, roomId, args) => {
    if (args.action === "drive") {
        return await actionDrive(playerId, roomId, args.location);
    }
    if (args.action === "direct flight") {
        return await actionDirectFlight(playerId, roomId, args.index);
    }
    if (args.action === "shuttle flight") {
        return await actionShuttleFlight(playerId, roomId, args.location);
    }
    throw new Error("Acion not found");
}

const actionDrive = async (playerId, roomId, newLocation) => {
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
    } catch (error) {
        throw new Error("Error Driving Player: " + error.message);
    }
};

const actionDirectFlight = async (playerId, roomId, cardIndex) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        const playerData = roomData.players[playerId];
        const playerHand = playerData.hand;
        const selectedCard = await getCard("player", playerHand[cardIndex]);
        if (selectedCard.type !== "location") {
            throw new Error("You can only fly to locations!");
        }
        const newLocation = selectedCard.location;
        const newHand = playerHand.splice(cardIndex, 1);
        let actionsRemaining = roomData.players[playerId].actionsRemaining - 1;
        await updateDoc(room, {
            [`players.${playerId}.location`]: newLocation,
            [`players.${playerId}.actionsRemaining`]: actionsRemaining,
            [`players.${playerId}.hand`]: playerHand
        });
    } catch (error) {
        throw new Error("Error Flying Player: " + error.message);
    }
}

const actionShuttleFlight = async (playerId, roomId, newLocation) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        const playerData = roomData.players[playerId];
        const playerHand = playerData.hand;

        const currentLocationId = await getLocationId(playerData.location);

        if (!playerHand.includes(currentLocationId)) {
            throw new Error("You do not have your own location card in hand!");
        }
        
        const newHand = playerHand.splice(playerHand.indexOf(currentLocationId), 1);
        let actionsRemaining = roomData.players[playerId].actionsRemaining - 1;
        await updateDoc(room, {
            [`players.${playerId}.location`]: newLocation,
            [`players.${playerId}.actionsRemaining`]: actionsRemaining,
            [`players.${playerId}.hand`]: playerHand
        });
    } catch (error) {
        throw new Error("Error Flying Player: " + error.message);
    }
}

export { checkPlayer, endTurn, takeAction, drawPlayerCards, discardPlayerCards, resolveEpidemic };

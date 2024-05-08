import { db } from "../config/firebase-config.js";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, query, where, getDocs } from "firebase/firestore";
import { getCard, getLocationId } from "./cardsModule.js";
import { getRoomData } from "./roomModule.js";

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
        // if (roomData.turnOrder[0] !== playerId) {
        //     throw new Error("Not player's turn");
        // }
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
    let playerData;
    try{
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        playerData = roomData.players[playerId];
    } catch (error) {
        throw new Error(error.message);
    }
    if (playerData.actionsRemaining <= 0) throw new Error("Player is out of actions!");
    if (args.action === "drive") return await actionDrive(playerId, roomId, args.location);
    if (args.action === "directFlight") return await actionDirectFlight(playerId, roomId, args.index);
    if (args.action === "charterFlight") return await actionCharterFlight(playerId, roomId, args.location);
    if (args.action === "shuttleFlight") return await actionShuttleFlight(playerId, roomId, args.location);
    if (args.action === "build") return await actionBuildResearchStation(playerId, roomId);
    if (args.action === "treat") return await actionTreatDisease(playerId, roomId, args.color);
    if (args.action === "share") return await actionShareKnowledge(playerId, roomId, args.playerId, args.cardIndex);
    if (args.action === "cure") return await actionDiscoverCure(playerId, roomId, args.cardIndices);

    throw new Error("Action not found");
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

const actionCharterFlight = async (playerId, roomId, newLocation) => {
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

const actionShuttleFlight = async(playerId, roomId, newLocation) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        const playerData = roomData.players[playerId];
        const playerLocationObject = roomData[playerData.location];
        const newLocationObject = roomData[playerData.location];

        if (newLocation === playerData.location) throw new Error("You are already there!");
        if (!playerLocationObject.researchStation) throw new Error("There is no research station in your location!");
        if (!newLocationObject.researchStation) throw new Error("There is no research station in that location!");

        let actionsRemaining = roomData.players[playerId].actionsRemaining - 1;
        await updateDoc(room, {
            [`players.${playerId}.location`]: newLocation,
            [`players.${playerId}.actionsRemaining`]: actionsRemaining
        });
        
    } catch (error) {
        throw new Error("Error Flying Player: " + error.message);
    }
    
}

const actionBuildResearchStation = async(playerId, roomId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        const playerData = roomData.players[playerId];
        const playerLocation = playerData.location;
        const playerLocationObject = roomData.locations[playerLocation];
        const playerHand = playerData.hand;

        if (playerLocationObject.researchStation) {
            throw new Error("That location already has a research station!");
        }

        if (!playerHand.includes(playerLocationObject.id)) {
            throw new Error("You do not have your own location card in hand!");
        }

        const newHand = playerHand.splice(playerHand.indexOf(playerLocationObject.id), 1);
        let actionsRemaining = roomData.players[playerId].actionsRemaining - 1;
        await updateDoc(room, {
            [`players.${playerId}.actionsRemaining`]: actionsRemaining,
            [`players.${playerId}.hand`]: playerHand,
            [`locations.${playerLocation}.researchStation`]: true
        });

        
    } catch (error) {
        throw new Error("Error Building Research Station: " + error.message);
    }
}

const actionTreatDisease = async(playerId, roomId, color) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        const playerData = roomData.players[playerId];
        const playerLocation = roomData.locations[playerData.location];

        if (!(['black', 'red', 'blue', 'yellow'].includes(color))) {
            throw new Error("Invalid color!")
        }

        if (playerLocation.diseaseCubes[color] <= 0) {
            throw new Error("There is no disease of that color there!")
        }

        const diseaseCubes = playerLocation.diseaseCubes;

        if (roomData.cureMarkers[color]) {
            diseaseCubes[color] = 0;
        } else {
            diseaseCubes[color] -= 1
        }

        let actionsRemaining = playerData.actionsRemaining-1
        await updateDoc(room, {
            [`players.${playerId}.actionsRemaining`]: actionsRemaining,
            [`locations.${playerData.location}.diseaseCubes`]: diseaseCubes
        })
    } catch (error) {
        throw new Error("Error Treating Disease: " + error.message);
    }
}

const actionShareKnowledge = async(playerId1, roomId, playerId2, cardIndex) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId1, roomId);
        const playerData1 = roomData.players[playerId1];
        const playerData2 = roomData.players[playerId2];
        const player1Hand = playerData1.hand;
        const player2Hand = playerData2.hand;
        const selectedCard = await getCard("player", player1Hand[cardIndex]);
        if (selectedCard.type !== "location") {
            throw new Error("You can only share location cards!");
        }
        const shareLocation = selectedCard.location;
        const player1Location = playerData1.location;
        const player2Location = playerData2.location;
        if (player1Location !== shareLocation) {
            throw new Error("You must be in the location matching the given card!");
        }
        if (player2Location !== shareLocation) {
            throw new Error("The receiving player must be in the location matching the given card!");
        }
        const newHand2 = player2Hand.push(player1Hand[cardIndex]);
        const newHand1 = player1Hand.splice(cardIndex, 1);
        
        let actionsRemaining = roomData.players[playerId1].actionsRemaining - 1;
        await updateDoc(room, {
            [`players.${playerId1}.actionsRemaining`]: actionsRemaining,
            [`players.${playerId1}.hand`]: player1Hand,
            [`players.${playerId2}.hand`]: player2Hand
        });
    } catch (error) {
        throw new Error("Error Sharing Knowledge: " + error.message);
    }
}

const actionDiscoverCure = async(playerId, roomId, cardIndices) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        const playerData = roomData.players[playerId];
        const playerLocation = playerData.location;
        const playerHand = playerData.hand;

        if (!(roomData.locations[playerLocation].researchStation)) {
            throw new Error("You must be at a research station!")
        }

        if (cardIndices.length !== 5) {
            throw new Error("You must use 5 cards!")
        }

        let color;

        let newHand = playerHand;

        for (let i=0; i < 5; i++) {
            const cardIndex = cardIndices[i];
            if (cardIndices.slice(0, i).includes(cardIndex)) throw new Error("Duplicate card indices!")
            if (cardIndex < 0) throw new Error("Card indices must be positive!");
            if (cardIndex >= playerHand.length) throw new Error("Card index exceeds hand size!");

            const card = await getCard("player", playerHand[cardIndex])
            if (card.type !== 'location') {
                throw new Error("Only location cards may be used to discover a cure!");
            }
            if (i === 0) {
                color = card.color;
            } else if (card.color !== color) {
                throw new Error("Card colors do not match!")
            }

            newHand = newHand.toSpliced(newHand.indexOf(playerHand[cardIndex]), 1);
        }

        if (roomData.cureMarkers[color]) {
            throw new Error("The cure for that color already exists!");
        }

        let actionsRemaining = roomData.players[playerId].actionsRemaining - 1;
        await updateDoc(room, {
            [`players.${playerId}.actionsRemaining`]: actionsRemaining,
            [`players.${playerId}.hand`]: newHand,
            [`cureMarkers.${color}`]: true
        });

    } catch (error) {
        throw new Error("Error Discovering a cure: " + error.message)
    }
}

const getDiseaseColors = async(playerId, roomId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        const playerData = roomData.players[playerId];
        const playerLocation = playerData.location;
        const colors = []
        for (const color of ['black', 'blue', 'red', 'yellow']) {
            if (playerLocation.diseaseCubes[color] > 0) {
                colors.push(color)
            }
        }
        return colors
    } catch (error) {
        throw new Error("Error Getting Disease Colors: " + error.message);
    }
}

const getLegalActions = async(roomData) => {
    let playerData;
    let playerLocation;
    let playerLocationId;
    let playerLocationObject;
    let playerPossibleCures;
    let researchStationLocations;
    try {
        playerData = roomData.players[playerId];
        playerLocation = playerData.location;
        playerLocationId = await getLocationId(playerLocation)
        playerLocationObject = roomData.locations[playerLocation];
        playerPossibleCures = await getPossibleCures(roomId, playerId);
        researchStationLocations = await getResearchStationLocations(roomId);
    } catch (error) {
        throw new Error(error.message);
    }

    if (playerData.actionsRemaining <= 0 || roomData.turnOrder[0] !== playerId) {
        return {
            "drive": false,
            "directFlight": false,
            "charterFlight": false,
            "shuttleFlight": false,
            "build": false,
            "treat": false,
            "share": false,
            "cure": false
        }
    }
    

    return {
        "drive": true,
        "directFlight": playerData.hand.length > 0,
        "charterFlight": playerData.hand.includes(playerLocationId),
        "shuttleFlight": playerLocationObject.researchStation && researchStationLocations.length > 1,
        "build": playerData.hand.includes(playerLocationId) && researchStationLocations.length < 6 && 
            !(playerLocationObject.researchStation),
        "treat": Object.values(playerLocationObject.diseaseCubes).some(x => x > 0),
        "share": Object.keys(roomData.players).some(playerId2 =>
                playerId !== playerId2 && roomData.players[playerId2].location === playerLocation &&
                (playerData.hand.includes(playerLocationId) || roomData.players[playerId2].hand.includes(playerLocationId))),
        "cure": playerPossibleCures.length > 0 && playerLocationObject.researchStation
    }
}

const getResearchStationLocations = async(roomId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomInfo = await getDoc(room);
        if (!roomInfo.exists()) {
            throw new Error("Room does not exist");
        }
        const roomData = roomInfo.data();
        return Object.keys(roomData.locations).filter(location => roomData.locations[location].researchStation);
    } catch (error) {
        throw new Error("Error fetching Research Station Locations: " + error.message);
    }
    
}

const getPossibleCures = async(roomId, playerId) => {
    const room = doc(db, "rooms", roomId);
    const roomData = await checkPlayer(playerId, roomId);
    const playerData = roomData.players[playerId];
    const playerHand = playerData.hand

    const colors = {'black': 0, 'blue': 0, 'red': 0, 'yellow': 0}
    for (const cardId of playerHand) {
        const card = await getCard("player", cardId)
        if (card.type === "location") {
            colors[card.color] += 1
        }
    }

    return Object.keys(colors).filter(color => colors[color] >= 5 && !roomData.cureMarkers[color]);
}



export { checkPlayer, endTurn, takeAction, drawPlayerCards, discardPlayerCards, resolveEpidemic, getDiseaseColors, getLegalActions};


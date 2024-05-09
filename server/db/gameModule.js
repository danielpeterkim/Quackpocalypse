import { db } from "../config/firebase-config.js";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, query, where, getDocs } from "firebase/firestore";
import { getCard, getLocationId } from "./cardsModule.js";
import { getRoomData } from "./roomModule.js";
import helpers from "../services/helpers.js";
const { shuffleArray } = helpers;

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
        // if (roomData.players[playerId].actionsRemaining < 1) {
        //     throw new Error("No actions left");
        // }
        return roomData;
    } catch (error) {
        throw new Error(error.message);
    }
};

const endTurn = async (playerId, roomId) => {
    try {
        await resolveEpidemic(playerId, roomId);
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
        let infectionRate = roomData.infectionRate;
        let infectionDeck = roomData.infectionDeck;
        let infectionDiscard = roomData.infectionDiscard;
        let realInfectionRate = 0;
        if (infectionRate === 0 || infectionRate === 1 || infectionRate === 2) {
            realInfectionRate = 2;
        } else if (infectionRate === 3 || infectionRate === 4) {
            realInfectionRate = 3;
        } else {
            realInfectionRate = 4;
        }
        let outBreakCounterValue = roomData.outbreakCounter;
        let locationObject = roomData.locations;
        for (let i = 0; i < realInfectionRate; i++) {
            const card = infectionDeck.shift();
            infectionDiscard.push(card);
            const cardData = await getCard("infection", card);
            const location = cardData.location;
            const color = cardData.color;
            // console.log("Check Color")
            // console.log("Disease cubes")
            // console.log(locationObject[cardData.location].diseaseCubes)
            if (roomData.eradicationMarkers[color] === false) {
                if ((locationObject[location].diseaseCubes[color] == 3)) {
                    console.log("outbreak occurred");
                    [locationObject, outBreakCounterValue] = await Outbreak(location, color, locationObject, outBreakCounterValue);
                    // console.log(locationObject);
                } else {
                    locationObject[location].diseaseCubes[color] += 1;
                }
                let totalCubes = Object.values(locationObject).reduce((total, location) => total + location.diseaseCubes[color], 0);
                if (totalCubes >= 24) {
                    await endGame(roomId, "Lost");
                    throw new Error("Game Lost: Too many disease cubes of one color");
                }
            }
        }
        console.log(outBreakCounterValue);
        const nextPlayer = turnOrder.shift();
        turnOrder.push(nextPlayer);
        const actionsRemaining = 4;
        await updateDoc(room, {
            turnOrder: turnOrder,
            [`players.${playerId}.actionsRemaining`]: actionsRemaining,
            [`players.${playerId}.drewCards`]: false,
            infectionDeck: infectionDeck,
            infectionDiscard: infectionDiscard,
            outbreakCounter: outBreakCounterValue,
            locations: locationObject,
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
            await endGame(roomId, "Lost");
            throw new Error("Not enough player cards to draw");
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
            [`players.${playerId}.actionsRemaining`]: 0
        });
    } catch (error) {
        throw new Error("Error Drawing Player Cards: " + error.message);
    }
};

const endGame = async (roomId, result) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomInfo = await getDoc(room);
        if (!roomInfo.exists()) {
            throw new Error("Room does not exist");
        }
        await updateDoc(room, {
            gameStatus: result,
        });
    } catch (error) {
        throw new Error("Error Ending Game: " + error.message);
    }
};

const resolveEpidemic = async (playerId, roomId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        let playerHand = roomData.players[playerId].hand;
        if (!playerHand.includes("epidemic")) {
            return;
        }
        let infectionDeck = roomData.infectionDeck;
        let infectionDiscard = roomData.infectionDiscard;
        let outBreakCounterValue = roomData.outbreakCounter;
        const lastCard = infectionDeck.pop();
        // console.log(lastCard);
        infectionDiscard.push(lastCard);
        shuffleArray(infectionDiscard);
        infectionDeck = infectionDiscard.concat(infectionDeck);
        infectionDiscard = [];
        const card = await getCard("infection", lastCard);
        // console.log(card);
        const location = card.location;
        const color = card.color;
        playerHand = playerHand.filter((item) => item !== "epidemic");
        if (roomData.eradicationMarkers[color] === false) {
            let locationObject = roomData.locations;
            if (locationObject[location].diseaseCubes[color] == 3) {
                console.log("outbreak occurred");
                [locationObject, outBreakCounterValue] = await Outbreak(location, color, locationObject, outBreakCounterValue);
                // console.log(locationObject);
            } else {
                locationObject[location].diseaseCubes[color] += 1;
            }
            // if total num of cubes of a color is 24, game is lost
            let totalCubes = Object.values(locationObject).reduce((total, location) => total + location.diseaseCubes[color], 0);
            if (totalCubes >= 24) {
                await endGame(roomId, "Lost");
                throw new Error("Game Lost: Too many disease cubes of one color");
            }
            // console.log(locationDisease);
            await updateDoc(room, {
                infectionRate: roomData.infectionRate + 1,
                locations: locationObject,
                infectionDeck: infectionDeck,
                outbreakCounter: outBreakCounterValue,
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

const Outbreak = async (location, color, locationObject, outBreakCounterValue, outbreakChain = new Set()) => {
    try {
        if (outbreakChain.has(location)) {
            return [locationObject, outBreakCounterValue];
        }   
        outbreakChain.add(location);
        // console.log(outbreakChain);
        outBreakCounterValue += 1;
        if (outBreakCounterValue >= 8) {
            await endGame(roomId, "Lost");
            throw new Error("Game Lost: Too many outbreaks");
        }
        const adjacentLocations = locationObject[location].adjacent;
        for (const adjacentLocation of adjacentLocations) {
            if (outbreakChain.has(adjacentLocation)) {
                continue;
            } else {
                if (locationObject[adjacentLocation].diseaseCubes[color] < 3) {
                    locationObject[adjacentLocation].diseaseCubes[color] += 1;
                    // console.log(locationObject[adjacentLocation].diseaseCubes[color]);
                if (!outbreakChain.has(adjacentLocation) && locationObject[adjacentLocation].diseaseCubes[color] >= 3) {
                    [locationObject, outBreakCounterValue] = await Outbreak(adjacentLocation, color, {...locationObject}, outBreakCounterValue, new Set([...outbreakChain]));
                } else {
                    locationObject = await Outbreak(adjacentLocation, color, locationObject, outbreakChain);
                    locationObject[adjacentLocation].diseaseCubes[color] = Math.min(locationObject[adjacentLocation].diseaseCubes[color] + 1, 3);
                }
            }
        }}
        return [locationObject, outBreakCounterValue];
    } catch (error) {
        throw new Error("Error Outbreaking: " + error.message);
    }
};


const discardPlayerCards = async (playerId, roomId, cardId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomInfo = await getDoc(room);
        if (!roomInfo.exists()) {
            throw new Error("Room does not exist");
        }
        const roomData = roomInfo.data();
        const playerHand = roomData.players[playerId].hand;
        if (cardId.length > 2) {
            throw new Error("Cannot discard more than 2 cards");
        }
        if (cardId.length < 1) {
            throw new Error("Must discard at least 1 card");
        }
        if (playerHand.some((card) => card === "epidemic")) {
            throw new Error("Epidemic card(s) must be resolved before anything else.");
        }
        if (playerHand.length < 8) {
            throw new Error("Player does not have enough cards to discard");
        }
        if (cardId.some((card) => !playerHand.includes(card))) {
            throw new Error("Player does not have one or more of the cards to discard");
        }
        // console.log(playerHand);
        // console.log(cards);
        const newHand = playerHand.filter((card) => !cardId.includes(card));
        // console.log(newHand);
        await updateDoc(room, {
            [`players.${playerId}.hand`]: newHand,
        });
    } catch (error) {
        throw new Error("Error Discarding Player Cards: " + error.message);
    }
};

const takeAction = async (playerId, roomId, args) => {
    let playerData;
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        playerData = roomData.players[playerId];
    } catch (error) {
        throw new Error(error.message);
    }
    if (playerData.actionsRemaining <= 0) throw new Error("Player is out of actions!");
    if (args.action === "drive") return await actionDrive(playerId, roomId, args.location);
    if (args.action === "directFlight") return await actionDirectFlight(playerId, roomId, args.cardId);
    if (args.action === "charterFlight") return await actionCharterFlight(playerId, roomId, args.location);
    if (args.action === "shuttleFlight") return await actionShuttleFlight(playerId, roomId, args.location);
    if (args.action === "build") return await actionBuildResearchStation(playerId, roomId);
    if (args.action === "treat") return await actionTreatDisease(playerId, roomId, args.color);
    if (args.action === "share") return await actionShareKnowledge(playerId, roomId, args.playerId, args.cardId);
    if (args.action === "cure") return await actionDiscoverCure(playerId, roomId, args.cardIds);

    throw new Error("Action not found");
};

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

const actionDirectFlight = async (playerId, roomId, cardId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        const playerData = roomData.players[playerId];
        const playerHand = playerData.hand;
        const selectedCard = await getCard("player", cardId);
        if (selectedCard.type !== "location") {
            throw new Error("You can only fly to locations!");
        }
        const newLocation = selectedCard.location;
        const cardIndex = getCardIndex(cardId, playerHand);
        const newHand = playerHand.toSpliced(cardIndex, 1);
        let actionsRemaining = roomData.players[playerId].actionsRemaining - 1;
        await updateDoc(room, {
            [`players.${playerId}.location`]: newLocation,
            [`players.${playerId}.actionsRemaining`]: actionsRemaining,
            [`players.${playerId}.hand`]: newHand,
        });
    } catch (error) {
        throw new Error("Error Flying Player: " + error.message);
    }
};

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
            [`players.${playerId}.hand`]: playerHand,
        });
    } catch (error) {
        throw new Error("Error Flying Player: " + error.message);
    }
};

const actionShuttleFlight = async (playerId, roomId, newLocation) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        const playerData = roomData.players[playerId];
        const playerLocation = playerData.location;
        const playerLocationObject = roomData.locations[playerLocation];
        const newLocationObject = roomData.locations[newLocation];

        if (newLocation === roomData.players[playerId].location) throw new Error("You are already there!");
        if (!playerLocationObject.researchStation) throw new Error("There is no research station in your location!");
        if (!newLocationObject.researchStation) throw new Error("There is no research station in that location!");

        let actionsRemaining = roomData.players[playerId].actionsRemaining - 1;
        await updateDoc(room, {
            [`players.${playerId}.location`]: newLocation,
            [`players.${playerId}.actionsRemaining`]: actionsRemaining,
        });
    } catch (error) {
        throw new Error("Error Flying Player: " + error.message);
    }
};

const actionBuildResearchStation = async (playerId, roomId) => {
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
            [`locations.${playerLocation}.researchStation`]: true,
        });
    } catch (error) {
        throw new Error("Error Building Research Station: " + error.message);
    }
};

const actionTreatDisease = async (playerId, roomId, color) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        const playerData = roomData.players[playerId];
        const playerLocation = roomData.locations[playerData.location];
        const eradicationMarkers = roomData.eradicationMarkers;

        if (!["purple", "red", "blue", "green"].includes(color)) {
            throw new Error("Invalid color!");
        }

        if (playerLocation.diseaseCubes[color] <= 0) {
            throw new Error("There is no disease of that color there!");
        }

        const diseaseCubes = playerLocation.diseaseCubes;

        if (roomData.cureMarkers[color]) {
            diseaseCubes[color] = 0;
            const isEradicated = Object.values(roomData.locations).every((location) => location.diseaseCubes[color] === 0);
            if (isEradicated) {
                eradicationMarkers[color] = true;
            }
        } else {
            diseaseCubes[color] -= 1;
        }

        let actionsRemaining = playerData.actionsRemaining - 1;
        await updateDoc(room, {
            [`players.${playerId}.actionsRemaining`]: actionsRemaining,
            [`locations.${playerData.location}.diseaseCubes`]: diseaseCubes,
            eradicationMarkers: eradicationMarkers,
        });
    } catch (error) {
        throw new Error("Error Treating Disease: " + error.message);
    }
};

const actionShareKnowledge = async (playerId1, roomId, playerId2, cardId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId1, roomId);
        const playerData1 = roomData.players[playerId1];
        const playerData2 = roomData.players[playerId2];
        const player1Hand = playerData1.hand;
        const player2Hand = playerData2.hand;

        let giver;
        let receiver;

        let cardIndex = getCardIndex(cardId, player1Hand);
        if (cardIndex === -1) {
            cardIndex = getCardIndex(cardId, player2Hand)
            giver = playerId2;
            receiver = playerId1;
        } else {
            giver = playerId1;
            receiver = playerId2;
        }

        if (cardIndex === -1) {
            throw new Error(`Neither player has that card!`)
        }

        const giverHand = roomData.players[giver].hand;
        const receiverHand = roomData.players[receiver].hand;

        const selectedCard = await getCard("player", cardId);
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
            throw new Error("The selected player must be in the location matching the given card!");
        }

        const newGiverHand = giverHand.toSpliced(cardIndex, 1);
        const newReceiverHand = [...receiverHand, giverHand[cardIndex]];

        let actionsRemaining = roomData.players[playerId1].actionsRemaining - 1;
        await updateDoc(room, {
            [`players.${playerId1}.actionsRemaining`]: actionsRemaining,
            [`players.${giver}.hand`]: newGiverHand,
            [`players.${receiver}.hand`]: newReceiverHand,
        });
    } catch (error) {
        throw new Error("Error Sharing Knowledge: " + error.message);
    }
};

const actionDiscoverCure = async (playerId, roomId, cardIds) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        const playerData = roomData.players[playerId];
        const playerLocation = playerData.location;
        const playerHand = playerData.hand;

        if (!roomData.locations[playerLocation].researchStation) {
            throw new Error("You must be at a research station!");
        }

        if (cardIds.length !== 5) {
            throw new Error("You must use 5 cards!");
        }

        let color;

        let newHand = playerHand;

        for (let i = 0; i < 5; i++) {
            const cardId = cardIds[i];
            if (cardIds.slice(0, i).includes(cardId)) throw new Error("Duplicate cards!");
            if (cardId < 0) throw new Error("Card ids cannot be negative!");

            const card = await getCard("player", cardId);
            if (card.type !== "location") {
                throw new Error("Only location cards may be used to discover a cure!");
            }
            if (i === 0) {
                color = card.color;
            } else if (card.color !== color) {
                throw new Error("Card colors do not match!");
            }

            if (!newHand.includes(cardId)) {
                throw new Error(`Card (id=${cardId}) not found in player's hand!`)
            }

            newHand = newHand.toSpliced(newHand.indexOf(cardId), 1);
        }

        if (roomData.cureMarkers[color]) {
            throw new Error("The cure for that color already exists!");
        }
        let cureMarkers = roomData.cureMarkers;
        cureMarkers[color] = true;

        if (Object.values(cureMarkers).every((cure) => cure)) {
            await endGame(roomId, "Won");
            throw new Error("Game Won: All cures discovered!");
        }

        let actionsRemaining = roomData.players[playerId].actionsRemaining - 1;
        await updateDoc(room, {
            [`players.${playerId}.actionsRemaining`]: actionsRemaining,
            [`players.${playerId}.hand`]: newHand,
            cureMarkers: cureMarkers,
        });
    } catch (error) {
        throw new Error("Error Discovering a cure: " + error.message);
    }
};

const getDiseaseColors = async (playerId, roomId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomData = await checkPlayer(playerId, roomId);
        const playerData = roomData.players[playerId];
        const playerLocation = playerData.location;
        const colors = [];
        for (const color of ["purple", "blue", "red", "green"]) {
            if (playerLocation.diseaseCubes[color] > 0) {
                colors.push(color);
            }
        }
        return colors;
    } catch (error) {
        throw new Error("Error Getting Disease Colors: " + error.message);
    }
};

const getLegalActions = async (roomData) => {
    let playerData;
    let playerLocation;
    let playerLocationId;
    let playerLocationObject;
    let playerPossibleCures;
    let researchStationLocations;
    try {
        playerData = roomData.players[playerId];
        playerLocation = playerData.location;
        playerLocationId = await getLocationId(playerLocation);
        playerLocationObject = roomData.locations[playerLocation];
        playerPossibleCures = await getPossibleCures(roomId, playerId);
        researchStationLocations = await getResearchStationLocations(roomId);
    } catch (error) {
        throw new Error(error.message);
    }

    if (playerData.actionsRemaining <= 0 || roomData.turnOrder[0] !== playerId) {
        return {
            drive: false,
            directFlight: false,
            charterFlight: false,
            shuttleFlight: false,
            build: false,
            treat: false,
            share: false,
            cure: false,
        };
    }

    return {
        drive: true,
        directFlight: playerData.hand.length > 0,
        charterFlight: playerData.hand.includes(playerLocationId),
        shuttleFlight: playerLocationObject.researchStation && researchStationLocations.length > 1,
        build: playerData.hand.includes(playerLocationId) && researchStationLocations.length < 6 && !playerLocationObject.researchStation,
        treat: Object.values(playerLocationObject.diseaseCubes).some((x) => x > 0),
        share: Object.keys(roomData.players).some(
            (playerId2) =>
                playerId !== playerId2 &&
                roomData.players[playerId2].location === playerLocation &&
                (playerData.hand.includes(playerLocationId) || roomData.players[playerId2].hand.includes(playerLocationId))
        ),
        cure: playerPossibleCures.length > 0 && playerLocationObject.researchStation,
    };
};

const getResearchStationLocations = async (roomId) => {
    try {
        const room = doc(db, "rooms", roomId);
        const roomInfo = await getDoc(room);
        if (!roomInfo.exists()) {
            throw new Error("Room does not exist");
        }
        const roomData = roomInfo.data();
        return Object.keys(roomData.locations).filter((location) => roomData.locations[location].researchStation);
    } catch (error) {
        throw new Error("Error fetching Research Station Locations: " + error.message);
    }
};

const getPossibleCures = async (roomId, playerId) => {
    const room = doc(db, "rooms", roomId);
    const roomData = await checkPlayer(playerId, roomId);
    const playerData = roomData.players[playerId];
    const playerHand = playerData.hand;

    const colors = { purple: 0, blue: 0, red: 0, green: 0 };
    for (const cardId of playerHand) {
        const card = await getCard("player", cardId);
        if (card.type === "location") {
            colors[card.color] += 1;
        }
    }

    return Object.keys(colors).filter((color) => colors[color] >= 5 && !roomData.cureMarkers[color]);
};

const getCardIndex = (cardId, playerHand) => {
    return playerHand.findIndex((card) => card === cardId);
}

export { checkPlayer, endTurn, takeAction, drawPlayerCards, discardPlayerCards, resolveEpidemic, getDiseaseColors, getLegalActions };

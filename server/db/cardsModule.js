import { db } from "../config/firebase-config.js";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, query, where, getDocs } from "firebase/firestore";
const cardCollection = collection(db, "cards");

// CARDS SUBJECT TO CHANGE
const infectionDeck = [
    {id: 1,  location: 'Carnegie', color: 'blue'},
    {id: 2,  location: 'Gateway', color: 'blue'},
    {id: 3,  location: 'River Terrace', color: 'blue'},
    {id: 4,  location: 'ABS', color: 'blue'},
    {id: 5,  location: 'Burchard', color: 'blue'},
    {id: 6,  location: 'Sig Ep', color: 'blue'},
    {id: 7,  location: 'EAS Lawn', color: 'blue'},
    {id: 8,  location: 'EAS', color: 'blue'},
    {id: 9,  location: 'McLean Labs', color: 'blue'},
    {id: 10,  location: 'McLean', color: 'blue'},
    {id: 11,  location: 'Babbio Steps', color: 'blue'},
    {id: 12,  location: 'Stevens Park', color: 'blue'},
    {id: 13,  location: 'McLean Lot', color: 'green'},
    {id: 14,  location: 'Babbio Garage', color: 'green'},
    {id: 15,  location: 'Babbio', color: 'green'},
    {id: 16,  location: 'Pier Soccer Field', color: 'green'},
    {id: 17,  location: 'Pier', color: 'green'},
    {id: 18,  location: 'Morton', color: 'green'},
    {id: 19,  location: 'Pierce', color: 'green'},
    {id: 20,  location: 'Kidde', color: 'green'},
    {id: 21,  location: 'Davis', color: 'green'},
    {id: 22,  location: 'Walker Gym', color: 'green'},
    {id: 23,  location: 'Debaun Athletic Complex', color: 'green'},
    {id: 24,  location: 'Griffith', color: 'green'},
    {id: 25,  location: 'Schaefer', color: 'purple'},
    {id: 26,  location: 'Baseball Field', color: 'purple'},
    {id: 27,  location: 'Library', color: 'purple'},
    {id: 28,  location: 'Schaefer Lawn', color: 'purple'},
    {id: 29,  location: 'UCC South Tower', color: 'purple'},
    {id: 30,  location: 'UCC North Tower', color: 'purple'},
    {id: 31,  location: '8th Street Lot', color: 'purple'},
    {id: 32,  location: 'Howe', color: 'purple'},
    {id: 33,  location: 'Howe Circle', color: 'purple'},
    {id: 34,  location: 'Statue', color: 'purple'},
    {id: 35,  location: 'Palmer', color: 'purple'},
    {id: 36,  location: 'Howe Lot', color: 'purple'},
    {id: 37,  location: 'Chi Phi', color: 'red'},
    {id: 38,  location: 'Piskies', color: 'red'},
    {id: 39,  location: 'Jonas', color: 'red'},
    {id: 40,  location: 'Humphreys', color: 'red'},
    {id: 41,  location: 'Volleyball Courts', color: 'red'},
    {id: 42,  location: 'Martha', color: 'red'},
    {id: 43,  location: 'Castle Point', color: 'red'},
    {id: 44,  location: 'Student Wellness Center', color: 'red'},
    {id: 45,  location: 'Lodge', color: 'red'},
    {id: 46,  location: 'Tennis Courts', color: 'red'},
    {id: 47,  location: 'Skate Park', color: 'red'},
    {id: 48,  location: 'Castle Point Lot', color: 'red'},
];

const playerDeck = [
    // location cards
    {id: 1, type: 'location', location: 'Carnegie', color: 'blue'},
    {id: 2, type: 'location', location: 'Gateway', color: 'blue'},
    {id: 3, type: 'location', location: 'River Terrace', color: 'blue'},
    {id: 4, type: 'location', location: 'ABS', color: 'blue'},
    {id: 5, type: 'location', location: 'Burchard', color: 'blue'},
    {id: 6, type: 'location', location: 'Sig Ep', color: 'blue'},
    {id: 7, type: 'location', location: 'EAS Lawn', color: 'blue'},
    {id: 8, type: 'location', location: 'EAS', color: 'blue'},
    {id: 9, type: 'location', location: 'McLean Labs', color: 'blue'},
    {id: 10, type: 'location', location: 'McLean', color: 'blue'},
    {id: 11, type: 'location', location: 'Babbio Steps', color: 'blue'},
    {id: 12, type: 'location', location: 'Stevens Park', color: 'blue'},
    {id: 13, type: 'location', location: 'McLean Lot', color: 'green'},
    {id: 14, type: 'location', location: 'Babbio Garage', color: 'green'},
    {id: 15, type: 'location', location: 'Babbio', color: 'green'},
    {id: 16, type: 'location', location: 'Pier Soccer Field', color: 'green'},
    {id: 17, type: 'location', location: 'Pier', color: 'green'},
    {id: 18, type: 'location', location: 'Morton', color: 'green'},
    {id: 19, type: 'location', location: 'Pierce', color: 'green'},
    {id: 20, type: 'location', location: 'Kidde', color: 'green'},
    {id: 21, type: 'location', location: 'Davis', color: 'green'},
    {id: 22, type: 'location', location: 'Walker Gym', color: 'green'},
    {id: 23, type: 'location', location: 'Debaun Athletic Complex', color: 'green'},
    {id: 24, type: 'location', location: 'Griffith', color: 'green'},
    {id: 25, type: 'location', location: 'Schaefer', color: 'purple'},
    {id: 26, type: 'location', location: 'Baseball Field', color: 'purple'},
    {id: 27, type: 'location', location: 'Library', color: 'purple'},
    {id: 28, type: 'location', location: 'Schaefer Lawn', color: 'purple'},
    {id: 29, type: 'location', location: 'UCC South Tower', color: 'purple'},
    {id: 30, type: 'location', location: 'UCC North Tower', color: 'purple'},
    {id: 31, type: 'location', location: '8th Street Lot', color: 'purple'},
    {id: 32, type: 'location', location: 'Howe', color: 'purple'},
    {id: 33, type: 'location', location: 'Howe Circle', color: 'purple'},
    {id: 34, type: 'location', location: 'Statue', color: 'purple'},
    {id: 35, type: 'location', location: 'Palmer', color: 'purple'},
    {id: 36, type: 'location', location: 'Howe Lot', color: 'purple'},
    {id: 37, type: 'location', location: 'Chi Phi', color: 'red'},
    {id: 38, type: 'location', location: 'Piskies', color: 'red'},
    {id: 39, type: 'location', location: 'Jonas', color: 'red'},
    {id: 40, type: 'location', location: 'Humphreys', color: 'red'},
    {id: 41, type: 'location', location: 'Volleyball Courts', color: 'red'},
    {id: 42, type: 'location', location: 'Martha', color: 'red'},
    {id: 43, type: 'location', location: 'Castle Point', color: 'red'},
    {id: 44, type: 'location', location: 'Student Wellness Center', color: 'red'},
    {id: 45, type: 'location', location: 'Lodge', color: 'red'},
    {id: 46, type: 'location', location: 'Tennis Courts', color: 'red'},
    {id: 47, type: 'location', location: 'Skate Park', color: 'red'},
    {id: 48, type: 'location', location: 'Castle Point Lot', color: 'red'},
    { id: 49, type: "event", name: "Airlift" },
    { id: 50, type: "event", name: "Government Grant" },
    { id: 51, type: "event", name: "One Quiet Night" },
    { id: 52, type: "event", name: "Resilient Population" },
    { id: 53, type: "event", name: "Forecast" },
];

const createDecks = () => {
    try {
        const infectionDeckRef = addDoc(cardCollection, {
            deckType: "infection",
            cards: infectionDeck,
        });
        const playerDeckRef = addDoc(cardCollection, {
            deckType: "player",
            cards: playerDeck,
        });
        return { infectionDeckRef, playerDeckRef };
    } catch (error) {
        throw new Error("Error Creating Decks: " + error.message);
    }
};

const getDeck = async (deckType) => {
    try {
        if (deckType !== "infection" && deckType !== "player") {
            throw new Error("Invalid deck type");
        }
        const q = query(cardCollection, where("deckType", "==", deckType));
        const querySnapshot = await getDocs(q);
        let deck = [];
        querySnapshot.forEach((doc) => {
            deck = doc.data().cards;
        });
        return deck;
    } catch (error) {
        throw new Error("Error Getting Deck: " + error.message);
    }
};

const getCard = async (deckType, cardId) => {
    try {
        if (deckType !== "infection" && deckType !== "player") {
            throw new Error("Invalid deck type");
        }
        if (typeof cardId !== "number") {
            throw new Error("Invalid card id");
        }
        if (cardId < 1) {
            throw new Error("Invalid card id");
        }
        if (deckType === "infection" && cardId > 48) {
            throw new Error("Invalid card id");
        }
        if (deckType === "player" && cardId > 53) {
            throw new Error("Invalid card id");
        }
        const deck = await getDeck(deckType);
        return deck.find((card) => card.id === cardId);
    } catch (error) {
        throw new Error("Error Getting Card: " + error.message);
    }
};

const getLocationId = async(location) => {
    for (const card of playerDeck) {
        if (card.type === "location" && card.location === location) {
            return card.id
        }
    }
    throw new Error(`Location ${location} not found.`)
}

export { createDecks, getDeck, getCard, getLocationId };

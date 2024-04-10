import { db } from "../config/firebase-config.js";
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, query, where, getDocs } from "firebase/firestore";
const cardCollection = collection(db, "cards");

// CARDS SUBJECT TO CHANGE
const infectionDeck = [
    { id: 1, location: "Babbio", color: "blue" },
    { id: 2, location: "Burchard", color: "blue" },
    { id: 3, location: "Carnegie", color: "blue" },
    { id: 4, location: "McLean", color: "blue" },
    { id: 5, location: "Schaefer", color: "blue" },
    { id: 6, location: "Walker", color: "blue" },
    { id: 7, location: "EAS", color: "blue" },
    { id: 8, location: "Gateway", color: "blue" },
    { id: 9, location: "Morton", color: "blue" },
    { id: 10, location: "Peirce", color: "blue" },
    { id: 11, location: "Lieberman", color: "blue" },
    { id: 12, location: "Davidson Lab", color: "blue" },
    { id: 13, location: "Jonas", color: "yellow" },
    { id: 14, location: "Palmer", color: "yellow" },
    { id: 15, location: "Davis", color: "yellow" },
    { id: 16, location: "Hayden", color: "yellow" },
    { id: 17, location: "Humphreys", color: "yellow" },
    { id: 18, location: "Lore-El", color: "yellow" },
    { id: 19, location: "Caffe Marche", color: "yellow" },
    { id: 20, location: "Pierce Dining", color: "yellow" },
    { id: 21, location: "Colonel John's", color: "yellow" },
    { id: 22, location: "Red and Gray Café", color: "yellow" },
    { id: 23, location: "America's Cup", color: "yellow" },
    { id: 24, location: "Duck Bistro", color: "yellow" },
    { id: 25, location: "Howe", color: "black" },
    { id: 26, location: "Wesley J. Howe Center", color: "black" },
    { id: 27, location: "Samuel C. Williams Library", color: "black" },
    { id: 28, location: "Student Center", color: "black" },
    { id: 29, location: "Schaeberle", color: "black" },
    { id: 30, location: "Griffith", color: "black" },
    { id: 31, location: "Ruesterholz Admissions Center", color: "black" },
    { id: 32, location: "Altorfer", color: "black" },
    { id: 33, location: "Alexander House", color: "black" },
    { id: 34, location: "President's House", color: "black" },
    { id: 35, location: "Castle Point Hall", color: "black" },
    { id: 36, location: "Jacobus", color: "black" },
    { id: 37, location: "Schaefer Athletic Center", color: "red" },
    { id: 38, location: "DeBaun Athletic Complex", color: "red" },
    { id: 39, location: "Walker Gym", color: "red" },
    { id: 40, location: "Tennis Courts", color: "red" },
    { id: 41, location: "Canavan Arena", color: "red" },
    { id: 42, location: "Outdoor Track and Field", color: "red" },
    { id: 43, location: "Soccer Field", color: "red" },
    { id: 44, location: "Baseball Field", color: "red" },
    { id: 45, location: "Duck Pond", color: "red" },
    { id: 46, location: "Babbio Garage", color: "red" },
    { id: 47, location: "Stevens Park", color: "red" },
    { id: 48, location: "Castle Point Skatepark", color: "red" },
];

const playerDeck = [
    // location cards
    { id: 1, type: "location", location: "Babbio", color: "blue" },
    { id: 2, type: "location", location: "Burchard", color: "blue" },
    { id: 3, type: "location", location: "Carnegie", color: "blue" },
    { id: 4, type: "location", location: "McLean", color: "blue" },
    { id: 5, type: "location", location: "Schaefer", color: "blue" },
    { id: 6, type: "location", location: "Walker", color: "blue" },
    { id: 7, type: "location", location: "EAS", color: "blue" },
    { id: 8, type: "location", location: "Gateway", color: "blue" },
    { id: 9, type: "location", location: "Morton", color: "blue" },
    { id: 10, type: "location", location: "Peirce", color: "blue" },
    { id: 11, type: "location", location: "Lieberman", color: "blue" },
    { id: 12, type: "location", location: "Davidson Lab", color: "blue" },
    { id: 13, type: "location", location: "Jonas", color: "yellow" },
    { id: 14, type: "location", location: "Palmer", color: "yellow" },
    { id: 15, type: "location", location: "Davis", color: "yellow" },
    { id: 16, type: "location", location: "Hayden", color: "yellow" },
    { id: 17, type: "location", location: "Humphreys", color: "yellow" },
    { id: 18, type: "location", location: "Lore-El", color: "yellow" },
    { id: 19, type: "location", location: "Caffe Marche", color: "yellow" },
    { id: 20, type: "location", location: "Pierce Dining", color: "yellow" },
    { id: 21, type: "location", location: "Colonel John's", color: "yellow" },
    { id: 22, type: "location", location: "Red and Gray Café", color: "yellow" },
    { id: 23, type: "location", location: "America's Cup", color: "yellow" },
    { id: 24, type: "location", location: "Duck Bistro", color: "yellow" },
    { id: 25, type: "location", location: "Howe", color: "black" },
    { id: 26, type: "location", location: "Wesley J. Howe Center", color: "black" },
    { id: 27, type: "location", location: "Samuel C. Williams Library", color: "black" },
    { id: 28, type: "location", location: "Student Center", color: "black" },
    { id: 29, type: "location", location: "Schaeberle", color: "black" },
    { id: 30, type: "location", location: "Griffith", color: "black" },
    { id: 31, type: "location", location: "Ruesterholz Admissions Center", color: "black" },
    { id: 32, type: "location", location: "Altorfer", color: "black" },
    { id: 33, type: "location", location: "Alexander House", color: "black" },
    { id: 34, type: "location", location: "President's House", color: "black" },
    { id: 35, type: "location", location: "Castle Point Hall", color: "black" },
    { id: 36, type: "location", location: "Jacobus", color: "black" },
    { id: 37, type: "location", location: "Schaefer Athletic Center", color: "red" },
    { id: 38, type: "location", location: "DeBaun Athletic Complex", color: "red" },
    { id: 39, type: "location", location: "Walker Gym", color: "red" },
    { id: 40, type: "location", location: "Tennis Courts", color: "red" },
    { id: 41, type: "location", location: "Canavan Arena", color: "red" },
    { id: 42, type: "location", location: "Outdoor Track and Field", color: "red" },
    { id: 43, type: "location", location: "Soccer Field", color: "red" },
    { id: 44, type: "location", location: "Baseball Field", color: "red" },
    { id: 45, type: "location", location: "Duck Pond", color: "red" },
    { id: 46, type: "location", location: "Babbio Garage", color: "red" },
    { id: 47, type: "location", location: "Stevens Park", color: "red" },
    { id: 48, type: "location", location: "Castle Point Skatepark", color: "red" },
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

export { createDecks, getDeck, getCard };

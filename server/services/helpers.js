const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
};

const generateRoomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const diseaseCubeInit = {
    red: 0,
    yellow: 0,
    blue: 0,
    black: 0,
};

// SUBJECT TO CHANGE
const locationsInit = {
    Babbio: { diseaseCubes: diseaseCubeInit, researchStation: true, adjacent: ["Burchard", "McLean", "EAS"], id: 1 },
    Burchard: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Babbio", "McLean", "Carnegie"], id: 2 },
    Carnegie: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Burchard", "McLean", "Walker"], id: 3 },
    McLean: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Babbio", "Burchard", "Carnegie", "Schaefer"], id: 4 },
    Schaefer: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["McLean", "Walker", "EAS"], id: 5 },
    EAS: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Babbio", "Schaefer", "Walker", "Gateway"], id: 6 },
    Gateway: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["EAS", "Morton"], id: 7 },
    Morton: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Gateway", "Peirce"], id: 8 },
    Peirce: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Morton", "Lieberman"], id: 9 },
    Lieberman: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Peirce", "Davidson Lab"], id: 10 },
    "Davidson Lab": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Lieberman", "Jonas"], id: 11 },
    Jonas: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Davidson Lab", "Palmer"], id: 12 },
    Palmer: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Jonas", "Davis"], id: 13 },
    Davis: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Palmer", "Hayden"], id: 14 },
    Hayden: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Davis", "Humphreys"], id: 15 },
    Humphreys: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Hayden", "Lore-El"], id: 16 },
    "Lore-El": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Humphreys", "Caffe Marche"], id: 17 },
    "Caffe Marche": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Lore-El", "Pierce Dining"], id: 18 },
    "Pierce Dining": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Caffe Marche", "Colonel John's"], id: 19 },
    "Colonel John's": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Pierce Dining", "Red and Gray Café"], id: 20 },
    "Red and Gray Café": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Colonel John's", "America's Cup"], id: 21 },
    "America's Cup": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Red and Gray Café", "Duck Bistro"], id: 22 },
    "Duck Bistro": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["America's Cup", "Howe"], id: 23 },
    Howe: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Wesley J. Howe Center", "Samuel C. Williams Library"], id: 24 },
    "Wesley J. Howe Center": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Howe", "Samuel C. Williams Library"], id: 25 },
    "Samuel C. Williams Library": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Student Center", "Schaeberle"], id: 26 },
    "Student Center": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Schaeberle", "Griffith"], id: 27 },
    Schaeberle: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Student Center", "Griffith"], id: 28 },
    Griffith: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Student Center", "Schaeberle"], id: 29 },
    "Ruesterholz Admissions Center": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Altorfer", "Alexander House"], id: 30 },
    Altorfer: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Ruesterholz Admissions Center", "Alexander House"], id: 31 },
    "Alexander House": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Ruesterholz Admissions Center", "Altorfer"], id: 32 },
    "President's House": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Castle Point Hall", "Jacobus"], id: 33 },
    "Castle Point Hall": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["President's House", "Jacobus"], id: 34 },
    Jacobus: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["President's House", "Castle Point Hall"], id: 35 },
    "Schaefer Athletic Center": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["DeBaun Athletic Complex", "Walker Gym"], id: 36 },
    "DeBaun Athletic Complex": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Schaefer Athletic Center", "Walker Gym"], id: 37 },
    "Walker Gym": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Schaefer Athletic Center", "DeBaun Athletic Complex"], id: 38 },
    "Tennis Courts": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Canavan Arena", "Outdoor Track and Field"], id: 39 },
    "Canavan Arena": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Tennis Courts", "Outdoor Track and Field"], id: 40 },
    "Outdoor Track and Field": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Tennis Courts", "Canavan Arena"], id: 41 },
    "Soccer Field": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Baseball Field", "Duck Pond"], id: 42 },
    "Baseball Field": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Soccer Field", "Duck Pond"], id: 43 },
    "Duck Pond": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Soccer Field", "Baseball Field"], id: 44 },
    "Babbio Garage": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Stevens Park", "Castle Point Skatepark"], id: 45 },
    "Stevens Park": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Babbio Garage", "Castle Point Skatepark"], id: 46 },
    "Castle Point Skatepark": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Babbio Garage", "Stevens Park"], id: 47 },
    Walker: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Carnegie", "Schaefer", "EAS"], id: 48 },
};

const infectionDeckInit = Array.from({ length: 48 }, (_, i) => i + 1);
const playerDeckInit = Array.from({ length: 53 }, (_, i) => i + 1);

export default {
    shuffleArray,
    generateRoomCode,
    locationsInit,
    infectionDeckInit,
    playerDeckInit,
};

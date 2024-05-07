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
    Carnegie: { diseaseCubes: diseaseCubeInit, researchStation: true, adjacent: ["Burchard", "Sig Ep", "EAS", "Gateway"], id: 1 },
    Gateway: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["River Terrace", "ABS", "Carnegie"], id: 2 },
    "River Terrace": { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Gateway", "Morton", "Pierce"], id: 3 },
    ABS: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Gateway", "Debaun Athletic Complex", "Kidde"], id: 4 },
    Burchard: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Carnegie", "EAS", "Babbio Steps", "McLean"], id: 5 },
    'Sig Ep': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Carnegie", "EAS"], id: 6 },
    'EAS Lawn': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["EAS", "McLean Labs","Stevens Park"], id: 7 },
    EAS: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Carnegie", "ABS", "EAS Lawn", "Sig Ep"], id: 8 },
    'McLean Labs': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["EAS Lawn", "Stevens Park", "McLean Lot", "McLean"], id: 9 },
    McLean: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["McLean Labs", "Babbio Steps", "Burchard"], id: 10 },
    'Babbio Steps': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Babbio", "Burchard", "McLean", "Morton"], id: 11 },
    'Stevens Park': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["EAS Lawn", "McLean Labs"], id: 12 },
    'McLean Lot': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["McLean Labs", "Babbio Garage", "Pier"], id: 13 },
    'Babbio Garage': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Babbio", "McLean Lot","Pier Soccer Field"], id: 14 },
    Babbio: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Babbio Garage", "Griffith", "Babbio Steps", "Davis"], id: 15 },
    'Pier Soccer Field': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Babbio Garage", "Griffith", "Pier"], id: 16 },
    Pier: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["McLean Lot", "Pier Soccer Field"], id: 17 },
    Morton: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Babbio Steps", "River Terrace", "Pierce"], id: 18 },
    Pierce: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Morton", "Kidde"], id: 19 },
    Kidde: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Pierce", "ABS", "Debaun Athletic Complex", "Walker Gym"], id: 20 },
    Davis: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Babbio", "Walker Gym", "UCC South Tower"], id: 21 },
    'Walker Gym': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Schaefer", "Kidde", "Davis"], id: 22 },
    'Debaun Athletic Complex': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["ABS", "Kidde", "Baseball Field"], id: 23 },
    Griffith: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Babbio", "Pier Soccer Field"], id: 24 },
    Schaefer: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Walker Gym", "Schaefer Lawn", "Library", "Baseball Field"], id: 25 },
    'Baseball Field': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Schaefer", "Debaun Athletic Complex", "8th Street Lot"], id: 26 },
    Library: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Schaefer", "Palmer", "Statue"], id: 27 },
    'Schaefer Lawn': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Schaefer", "UCC South Tower", "Statue"], id: 28 },
    'UCC South Tower': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Schaefer Lawn", "Davis", "UCC North Tower"], id: 29 },
    'UCC North Tower': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["UCC South Tower", "Statue", "Howe"], id: 30 },
    '8th Street Lot': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Baseball Field", "Palmer"], id: 31 },
    Howe: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["UCC North Tower", "Howe Circle", "Howe Lot"], id: 32 },
    'Howe Circle': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Howe", "Howe Lot", "Statue", "Palmer"], id: 33 },
    Statue: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Library", "Howe Circle", "UCC North Tower", "Schaefer Lawn"], id: 34 },
    Palmer: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Howe Circle", "8th Street Lot", "Library","Volleyball Courts"], id: 35 },
    'Howe Lot': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Howe Circle", "Howe"], id: 36 },
    'Chi Phi': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Lodge", "Jonas"], id: 37 },
    Piskies: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Lodge", "Student Wellness Center", "Humphreys"], id: 38 },
    Jonas: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Lodge", "Student Wellness Center"], id: 39 },
    Humphreys: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Student Wellness Center", "Martha", "Volleyball Courts"], id: 40 },
    'Volleyball Courts': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Palmer", "Humphreys", "Martha"], id: 41 },
    Martha: { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Volleyball Courts", "Humphreys", "Castle Point"], id: 42 },
    'Castle Point': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Martha", "Tennis Courts", "Castle Point Lot", "Skate Park"], id: 43 },
    'Student Wellness Center': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Piskies", "Jonas", "Humphreys"], id: 44 },
    'Lodge': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Chi Phi", "Piskies", "Jonas"], id: 45 },
    'Tennis Courts': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Castle Point", "Castle Point Lot"], id: 46 },
    'Skate Park': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Castle Point", "Castle Point Lot"], id: 47 },
    'Castle Point Lot': { diseaseCubes: diseaseCubeInit, researchStation: false, adjacent: ["Castle Point", "Tennis Courts", "Skate Park"], id: 48 },
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

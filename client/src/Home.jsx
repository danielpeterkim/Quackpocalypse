import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    let [showJoin, setShowJoin] = useState(false);
    let [showCreate, setShowCreate] = useState(false);
    let [showInfo, setShowInfo] = useState(false);
    let [name, setName] = useState("");
    let [roomCode, setRoomCode] = useState("");
    let [hiddenHands, setHiddenHands] = useState(false);
    let [epidemicCards, setEpidemicCards] = useState(4);
    let [error, setError] = useState("");
    const navigate = useNavigate();

    const handleJoin = () => {
        setShowJoin(!showJoin);
        if (showCreate) {
            setShowCreate(!showCreate);
        }
    };

    const handleCreate = () => {
        setShowCreate(!showCreate);
        if (showJoin) {
            setShowJoin(!showJoin);
        }
    };

    const handleInfo = () => {
        setShowInfo(!showInfo);
    };

    const handleCreateRoom = async () => {
        try {
            const response = await fetch("http://localhost:3000/create-room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, hiddenHands, epidemicCards }),
            });

            const data = await response.json();
            console.log(data.roomId);
            localStorage.setItem("token", data.token);
            if (response.ok) {
                console.log("Room ID:", data.roomId);
                navigate(`/lobby/${name}/${data.roomId}`);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Failed to create room", error.message);
            setError(error.message);
        }
    };

    const handleJoinRoom = async () => {
        try {
            const response = await fetch("http://localhost:3000/join-room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, roomCode }),
            });

            const data = await response.json();
            localStorage.setItem("token", data.token);
            if (response.ok) {
                console.log("Room ID:", data.roomId);
                navigate(`/lobby/${name}/${data.roomId}`);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Failed to join room", error.message);
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-800 flex justify-center items-center">
            <div className="homepage border-2 border-red-800 rounded-lg p-20 bg-gray-800 text-white">
                <h1 className="text-3xl text-pink text-center font-bold">Quackpocalypse</h1>
                <div> {error && <p className="text-red-600">{error}</p>} </div>
                <div className="options mt-20">
                    <button className="bg-red-800 hover:bg-red-600 text-white px-10 py-2 rounded-lg text-lg" onClick={handleCreate}>
                        Create a Room
                    </button>
                    {"  "}
                    <button className="bg-red-800 hover:bg-red-600 text-white px-10 py-2 rounded-lg text-lg" onClick={handleJoin}>
                        Join a Room
                    </button>
                    {showJoin && (
                        <form>
                            <label>Name:</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            {"  "}
                            <label>Code:</label>
                            <input type="text" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
                            {"  "}
                            <button type="button" className="bg-red-800 hover:bg-red-600 text-white px-10 py-2 rounded-lg text-lg" onClick={handleJoinRoom}>
                                Join
                            </button>
                        </form>
                    )}
                    {showCreate && (
                        <form>
                            <label>Name:</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            {"  "}
                            <label>Hidden hands:</label>
                            <select value={hiddenHands} onChange={(e) => setHiddenHands(e.target.value)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-lg">
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                            {"  "}
                            <label>Epidemic cards:</label>
                            <select value={epidemicCards} onChange={(e) => setEpidemicCards(e.target.value)} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-lg">
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                            </select>
                            {"  "}
                            <button type="button" className="bg-red-800 hover:bg-red-600 text-white px-10 py-2 rounded-lg text-lg" onClick={handleCreateRoom}>
                                Create
                            </button>
                        </form>
                    )}
                </div>
                <div>
                    {showInfo && (
                        <div>
                            <h4> Info: </h4>
                            <p>
                                {" "}
                                Quackpocalypse is a cooperative, turn-based, online multiplayer game where 2-4 players work together in order to fight a life-threatening zombie plague: the fate of
                                Stevens campus depends on your group of students to contain the horde and find a cure. In order to win, the students have to cure all 4 strains by collecting and
                                sharing the corresponding-colored cards, while taking care not to let too many locations get out of control.{" "}
                            </p>
                        </div>
                    )}
                </div>
                <button className="info-button absolute bottom-20 right-20" onClick={handleInfo}>
                    Info
                </button>
            </div>
        </div>
    );
}

export default Home;

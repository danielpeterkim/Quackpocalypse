import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Lobby() {
    const [name, setName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    let [showInfo, setShowInfo] = useState(false); 
    const [roomId, setRoomId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const startGame = async () => {
            try {
                const response = await fetch('http://localhost:3000/start-game', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, roomCode })
                });

                const data = await response.json();
                if (response.ok) {
                    console.log('Room ID:', data.roomId);
                    setRoomId(data.roomId);
                    navigate(`/board`);
                } else {
                    console.error('Failed to start game:', data.error);
                }
            } catch (error) {
                console.error('Error starting game:', error.message);
            }
        };

        if (name !== '' && roomCode !== '') {
            startGame();
        }
    }, [name, roomCode]);

    const handleInfo = () => {
        setShowInfo(!showInfo);
    }

    return (
        <div className="min-h-screen bg-gray-800 flex justify-center items-center">
            <div className="lobby border-2 border-red-800 rounded-lg p-20 bg-gray-800 text-white">
                <h1>Lobby</h1>
                <div>
                    <h3> Code: {roomCode}</h3>
                    <h5> Members: </h5>
                    {roomId ? (
                        <button onClick={() => console.log('Game Started!')}>Start Game</button>
                    ) : (
                        <p>Waiting for server response...</p>
                    )}
                </div>
                <div>
                    {showInfo && (
                        <div>
                            <h4> Info: </h4>
                            <p> Quackpocalypse is a cooperative, turn-based, online multiplayer game where 2-4 players work together in order to fight a life-threatening zombie plague: the fate of Stevens campus depends on your group of students to contain the horde and find a cure. In order to win, the students have to cure all 4 strains by collecting and sharing the corresponding-colored cards, while taking care not to let too many locations get out of control. </p>
                        </div>
                    )}
                </div>
                <button className="info-button absolute bottom-20 right-20" onClick={handleInfo}>Info</button>
            </div>
        </div>
    );
}

export default Lobby;

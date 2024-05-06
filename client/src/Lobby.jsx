import React, { useState, useEffect } from 'react';

function Lobby() {
    const [name, setName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [roomId, setRoomId] = useState(null);

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
                    // redirect to the map ? 
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

    return (
        <div>
            <div className="lobby">
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
                <button className="info-button">Info</button>
            </div>
        </div>
    );
}

export default Lobby;

import React from 'react';
// import { startGame } from '../../server/db/roomModule';

function Lobby(){
    const [name, setName] = useState('');
    const [roomCode, setRoomCode] = useState('');

    // const handleStart = async () => {
    //     try{
    //         const roomId = await startGame(name, roomCode);

    //     }catch(error){
    //         console.error(error.message);
    //     }
    // }

    return (
        <div> 
            <div className="lobby">
            <h1>Lobby</h1>
            <div>
                <h3> Code:  </h3>
                <h5> Members: </h5>
                {/* <button onClick={handleStart}> Start Game </button> */}
            </div>
            <button className="info-button">Info</button>
            </div>
        </div>
    );
}

export default Lobby; 
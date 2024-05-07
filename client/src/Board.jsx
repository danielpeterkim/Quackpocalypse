import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Area from './Area';
import './index.css'
// import Chat from './Chat';

const Board = () => {
    const [roomData, setRoomData] = useState({});
    const [loading, setLoading] = useState(true);

    const { roomId } = useParams();
    const { name } = useParams();
      
    useEffect(() => {
        const handleGetRoomData = async () => {
            try {
                const response = await fetch('http://localhost:3000/room-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ roomId: roomId })
                });

                const data = await response.json();
                if (response.ok) {
                    setRoomData(data);
                    setLoading(false);
                } else {
                    console.error('Failed to get room data:', data.error);
                }
            } catch (error) {
                console.error('Error getting room data:', error.message);
            }
        };

        if (roomId) {
            handleGetRoomData();
        }
    }, []);

    const getPlayerId = (players) => {
      const matchingPlayer = Object.values(players).find(player => player.name === name);
      return matchingPlayer ? matchingPlayer.playerId : undefined;
    };

    const takeAction = async (args) => {
      try {
          const playerId = getPlayerId(roomData.players);
          if (!playerId) {
              console.error('Player ID not found');
              return;
          }
          const response = await fetch('http://localhost:3000/take-action', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ playerId: playerId, roomId: roomId, args: args })
          });
          const data = await response.json();
          if (response.ok) {
              console.log('Action successfully completed');
          } else {
              console.error('Error:', data.error);
          }
      } catch (error) {
          console.error('Error:', error.message);
      }
  };
    // const handleGetRoomData = async () => {
    //     const response = await fetch('http://localhost:3000/room-data', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body:JSON.stringify('rXZWjcOUmzyRNAghJ5mE')
    //     });
    //     const data = await response.json();
    //     console.log(data);
    //     if (response.ok) {
    //         console.log(data); 
    //         // navigate(`/lobby/${name}/${data.roomId}`);
    //     } else {
    //         console.error('Failed to create room:', data.error); 
    //     }
    // };

    const [showChat, setShowChat] = useState(false);

    // const handleToggleChat = () => {
    //   setShowChat(!showChat);
    // }
    const handleAreaClick = (areaName) => {
        // move pawn to that area 
        setLocation(areaName);
        alert(`Clicked on: ${areaName}`);
    };

    if (loading) {
      return <h1>Loading...</h1>
    }

    const areas = [
      { name: 'Carnegie', x: 215, y: 150, color: 'blue' },
      { name: 'Gateway', x: 255, y: 150, color: 'blue' },
      { name: 'River Terrace', x: 265, y: 180, color: 'blue' },
      { name: 'ABS', x: 315, y: 155, color: 'blue' },
      { name: 'Burchard', x: 210, y: 183, color: 'blue' },
      { name: 'Sig Ep', x: 200, y: 110, color: 'blue' },
      { name: 'EAS Lawn', x: 125, y: 160, color: 'blue' },
      { name: 'EAS', x: 165, y: 160, color: 'blue' },
      { name: 'McLean Labs', x: 125, y: 225, color: 'blue' },
      { name: 'McLean', x: 165, y: 225, color: 'blue' },
      { name: 'Babbio Steps', x: 210, y: 225, color: 'blue' },
      { name: 'Stevens Park', x: 100, y: 190, color: 'blue' },
      { name: 'McLean Lot', x: 140, y: 260, color: 'green' },
      { name: 'Babbio Garage', x: 180, y: 260, color: 'green' },
      { name: 'Babbio', x: 220, y: 270, color: 'green' },
      { name: 'Pier Soccer Field', x: 180, y: 310, color: 'green' },
      { name: 'Pier', x: 130, y: 310, color: 'green' },
      { name: 'Morton', x: 250, y: 240, color: 'green' },
      { name: 'Pierce', x: 275, y: 210, color: 'green' },
      { name: 'Kidde', x: 300, y: 240, color: 'green' },
      { name: 'Davis', x: 285, y: 300, color: 'green' },
      { name: 'Walker Gym', x: 310, y: 270, color: 'green' },
      { name: 'Debaun Athletic Complex', x: 350, y: 200, color: 'green' },
      { name: 'Griffith', x: 220, y: 340, color: 'green' },
      { name: 'Schaefer', x: 370, y: 260, color: 'purple' },
      { name: 'Baseball Field', x: 410, y: 220, color: 'purple' },
      { name: 'Library', x: 420, y: 280, color: 'purple' },
      { name: 'Schaefer Lawn', x: 380, y: 300, color: 'purple' },
      { name: 'UCC South Tower', x: 340, y: 325, color: 'purple' },
      { name: 'UCC North Tower', x: 380, y: 350, color: 'purple' },
      { name: '8th Street Lot', x: 450, y: 200, color: 'purple' },
      { name: 'Howe', x: 430, y: 390, color: 'purple' },
      { name: 'Howe Circle', x: 460, y: 360, color: 'purple' },
      { name: 'Statue', x: 420, y: 330, color: 'purple' },
      { name: 'Palmer', x: 470, y: 295, color: 'purple' },
      { name: 'Howe Lot', x: 505, y: 380, color: 'purple' },
      { name: 'Chi Phi', x: 500, y: 150, color: 'red' },
      { name: 'Piskies', x: 600, y: 150, color: 'red' },
      { name: 'Jonas', x: 500, y: 230, color: 'red' },
      { name: 'Humphreys', x: 520, y: 290, color: 'red' },
      { name: 'Volleyball Courts', x: 505, y: 330, color: 'red' },
      { name: 'Martha', x: 560, y: 315, color: 'red' },
      { name: 'Castle Point', x: 620, y: 315, color: 'red' },
      { name: 'Student Wellness Center', x: 570, y: 250, color: 'red' },
      { name: 'Lodge', x: 540, y: 180, color: 'red' },
      { name: 'Tennis Courts', x: 630, y: 280, color: 'red' },
      { name: 'Skate Park', x: 650, y: 380, color: 'red' },
      { name: 'Castle Point Lot', x: 670, y: 260, color: 'red' }
    ];

    const startAction = (e) => {  
      const target = e.target;

      target.style = 3;
    }
  
    // const handleActionClick = (btn, actionName) => {
    //   alert(`Clicked on ${actionName}`);
    // }

    return (
      // Using Tailwind classes to control maximum size and responsiveness
      <div className="min-h-screen bg-gray-800 flex justify-center items-center">
      <div className="w-full h-full max-w-4xl max-h-3xl mx-auto">
      <svg className="w-full h-full" viewBox="0 0 800 600">
            <image href={('/0.png')} width="800" height="600"/>
            {areas.map(area => (
              <Area
                key={area.name}
                x={area.x}
                y={area.y}
                width={35}
                height={25}
                color={area.color}
                onClick={handleAreaClick}
                name={area.name}
                roomData={roomData}
              />
            ))}
          </svg>

      
          

      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button onClick={() => takeAction({ action: "drive", location: location })}  className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Walk
        </button>
        <button onClick={() => takeAction({ action: "directFlight", index: 0 })}  className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Direct Shuttle
        </button>
        <button onClick={() => takeAction({ action: "charterFlight", index: 0 })}  className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Charter Shuttle
        </button>
        <button onClick={() => takeAction({ action: "shuttleFlight", location: location })} className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Standard Shuttle
        </button>
        <button onClick={() => takeAction({ action: "build" })}  className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Build Research Camp
        </button>
        <button onClick={() => takeAction({ action: "treat", color: "blue" })} className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Treat
        </button>
        <button onClick={() => takeAction({ action: "share", playerId: getPlayerId(roomData.players), cardIndex: 0 })}className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Share Knowledge
        </button>
        <button onClick={() => takeAction({ action: "cure", cardIndices: [0, 1, 2, 3, 5] })} className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Discover a Cure
        </button>
      </div>

          {/* <button
            onClick={handleToggleChat}
            className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Open Chat
          </button>
          {showChat && (
            <div className="absolute bottom-12 right-4 bg-white p-4 rounded-lg shadow-lg">
              <Chat />
            </div>
          )} */}
      </div>
      </div>
  );
};

export default Board;

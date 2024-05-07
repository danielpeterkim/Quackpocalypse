import React, {useState} from 'react';
import Area from './Area';
// import Chat from './Chat';

const Board = () => {
  const [showChat, setShowChat] = useState(false);
  // const handleToggleChat = () => {
  //   setShowChat(!showChat);
  // }
  const handleAreaClick = (areaName) => {
    // move pawn to that area 
    alert(`Clicked on: ${areaName}`);
  };


  const areas = [
    { name: 'Carnegie', x: 215, y: 155, color: 'blue' },
    { name: 'Gateway', x: 250, y: 155, color: 'blue' },
    { name: 'River Terrace', x: 265, y: 183, color: 'blue' },
    { name: 'ABS', x: 315, y: 155, color: 'blue' },
    { name: 'Burchard', x: 210, y: 183, color: 'blue' },
    { name: 'Sig Ep', x: 200, y: 110, color: 'blue' },
    { name: 'EAS Lawn', x: 130, y: 160, color: 'blue' },
    { name: 'EAS', x: 165, y: 160, color: 'blue' },
    { name: 'McLean Labs', x: 140, y: 220, color: 'blue' },
    { name: 'McLean', x: 165, y: 220, color: 'blue' },
    { name: 'Babbio Steps', x: 210, y: 225, color: 'blue' },
    { name: 'Stevens Park', x: 100, y: 180, color: 'blue' },
    { name: 'McLean Lot', x: 140, y: 260, color: 'green' },
    { name: 'Babbio Garage', x: 180, y: 260, color: 'green' },
    { name: 'Babbio', x: 210, y: 260, color: 'green' },
    { name: 'Pier Soccer Field', x: 185, y: 310, color: 'green' },
    { name: 'Pier', x: 130, y: 310, color: 'green' },
    { name: 'Morton', x: 250, y: 225, color: 'green' },
    { name: 'Pierce', x: 275, y: 225, color: 'green' },
    { name: 'Kidde', x: 300, y: 225, color: 'green' },
    { name: 'Davis', x: 285, y: 290, color: 'green' },
    { name: 'Walker Gym', x: 310, y: 270, color: 'green' },
    { name: 'Debaun Athletic Complex', x: 350, y: 200, color: 'green' },
    { name: 'Griffith', x: 220, y: 340, color: 'green' },
    { name: 'Schaefer', x: 370, y: 260, color: 'purple' },
    { name: 'Baseball Field', x: 410, y: 220, color: 'purple' },
    { name: 'Library', x: 420, y: 280, color: 'purple' },
    { name: 'Schaefer Lawn', x: 380, y: 300, color: 'purple' },
    { name: 'UCC South Tower', x: 345, y: 330, color: 'purple' },
    { name: 'UCC North Tower', x: 380, y: 350, color: 'purple' },
    { name: '8th Street Lot', x: 450, y: 200, color: 'purple' },
    { name: 'Howe', x: 430, y: 385, color: 'purple' },
    { name: 'Howe Circle', x: 460, y: 360, color: 'purple' },
    { name: 'Statue', x: 420, y: 330, color: 'purple' },
    { name: 'Palmer', x: 470, y: 295, color: 'purple' },
    { name: 'Howe Lot', x: 505, y: 380, color: 'purple' },
    { name: 'Chi Phi', x: 500, y: 150, color: 'red' },
    { name: 'Piskies', x: 600, y: 150, color: 'red' },
    { name: 'Jonas', x: 500, y: 230, color: 'red' },
    { name: 'Humphreys', x: 530, y: 290, color: 'red' },
    { name: 'Volleyball Courts', x: 505, y: 330, color: 'red' },
    { name: 'Martha', x: 560, y: 315, color: 'red' },
    { name: 'Castle Point', x: 620, y: 315, color: 'red' },
    { name: 'Student Wellness Center', x: 570, y: 250, color: 'red' },
    { name: 'Lodge', x: 540, y: 180, color: 'red' },
    { name: 'Tennis Courts', x: 630, y: 280, color: 'red' },
    { name: 'Skate Park', x: 650, y: 380, color: 'red' },
    { name: 'Castle Point Lot', x: 670, y: 260, color: 'red' }
  ];
  

  return (
    // Using Tailwind classes to control maximum size and responsiveness
    <div className="min-h-screen bg-gray-800 flex justify-center items-center">
    <div className="w-full h-full max-w-4xl max-h-3xl mx-auto">
    <svg className="w-full h-full" viewBox="0 0 800 600">
          <image href={('/0.png')} width="800" height="600" />
          {areas.map(area => (
            <Area
              key={area.name}
              x={area.x}
              y={area.y}
              width={15}
              height={23}
              color={area.color}
              onClick={handleAreaClick}
              name={area.name}
            />
          ))}
        </svg>
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

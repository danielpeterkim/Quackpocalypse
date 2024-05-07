import React from 'react';





// const Area = ({ x, y, width, height, color, onClick, name, pawns, cubes }) => (
const Area = ({ x, y, width, height, color, onClick, name, roomId}) => {
    
    const handleGetRoomData = async () => {
        const response = await fetch('http://localhost:3000/room-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify('rXZWjcOUmzyRNAghJ5mE')
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            console.log(data); 
            // navigate(`/lobby/${name}/${data.roomId}`);
        } else {
            console.error('Failed to create room:', data.error); 
        }
    };
    return(
    <g onClick={() => onClick(name)}>
      <rect x={x} y={y} width={width} height={height} fill="transparent" stroke={color} strokeWidth="2" />
      {/* {pawns.map((pawn, index) => (
        <circle cx={x + 4 * index} cy={y - 10} r={3} fill="gold" />
      ))}
      {cubes.map((cube, index) => (
        <rect x={x + 4 * index} y={y + height + 5} width={4} height={4} fill="red" />
      ))} */}
      {/* <h1> {handleGetRoomData()}</h1> */}
    </g>
    );
}
  
  export default Area;
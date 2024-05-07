import React, { useState, useEffect } from 'react';

// const Area = ({ x, y, width, height, color, onClick, name, pawns, cubes }) => (
const Area = ({ x, y, width, height, color, onClick, name, roomData}) => {
      let pawnColors = [];

      if (roomData.players) {
        for (const player of Object.values(roomData.players)) {
          if (player.location === name) {
            pawnColors.push(player.pawnColor)
          }
        }
      }

      pawnColors.sort();

      let cubes = [];

      if (roomData.locations && roomData.locations[name]) {
        const diseaseCubes = roomData.locations[name].diseaseCubes
        for (const color of Object.keys(diseaseCubes)) {
          for (let i = 0; i < diseaseCubes[color]; i++) {
            cubes.push(color);
          }
        }
      }
      return(
      <g onClick={() => onClick(name)}>
        <rect x={x} y={y} width={width} height={height} fill="transparent" stroke={color} strokeWidth="2" />
        {pawnColors.map((pawn, index) => (
          <circle key={index} cx={x+(index+1)*width/(pawnColors.length+1)} cy={y+5} r={3} fill={pawn} />
        ))}
        {cubes.map((cube, index) => {
          return <rect key={index} x={x+3+index*10} y={y+12} r={3} width={8} height={8} stroke="black" fill={cube} strokeWidth="1"></rect>
        })
        }
      </g>
    );
}
  
  export default Area;
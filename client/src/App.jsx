import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Board from './Board';
import Lobby from './Lobby';

function App() {
  return (
    <div>
      {/* <div className="homepage">
        <h1>Quackpocalypse</h1>
        <div className="options">
          <button>Create a Room</button>
          <Link to="/map"><button>Join a Room</button></Link>
        </div>
        <button className="info-button">Info</button>
      </div> */}
      <Routes>
        <Route path='/' element={<Home />} /> 
        <Route path='/lobby/:name/:roomId' element = {<Lobby />} /> 
        <Route path='/board/:name/:roomId' element = {<Board />} />
      </Routes>
    </div>
  );
}

export default App;

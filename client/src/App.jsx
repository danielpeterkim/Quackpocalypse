import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Board from './Board';
import Lobby from './Lobby';
import Error from './Error';
import ProtectedRoute from './Protected'; // Assuming you've defined ProtectedRoute in another file

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/lobby/:name/:roomId' element={
          <ProtectedRoute>
            <Lobby />
          </ProtectedRoute>
        } />
        <Route path='/board/:name/:roomId' element={
          <ProtectedRoute>
            <Board />
          </ProtectedRoute>
        } />
        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;


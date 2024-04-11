import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <div>
     <div className="homepage">
      <h1>Quackpocalypse</h1>
      <div className="options">
        <button>Create a Room</button>
        <button>Join a Room</button>
      </div>
      <button className="info-button">Info</button>
    </div>
    </div>
  )
}

export default App

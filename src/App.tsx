import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import sound from './assets/audio/snes/Donkey Kong Country 2/1-11. Forest Interlude.mp3'

function App() {
  const [count, setCount] = useState(0)

  var testSound = new Audio(sound);

  function play() {
    testSound.play();
  }

  function stop() {
    testSound.pause();
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={play}>
          Play Sound
        </button>
        <button onClick={stop}>
          Stop Sound
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

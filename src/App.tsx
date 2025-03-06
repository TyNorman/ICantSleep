import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import testMusic from './assets/audio/snes/Donkey Kong Country 2/1-11. Forest Interlude.mp3'
import testRain from './assets/audio/rain/20 Rain.mp3'

function App() {
  const [count, setCount] = useState(0)

  var testSound = new Audio(testMusic);
  var testRainLoop = new Audio(testRain);
  testRainLoop.loop = true;

  function play() {
    testSound.play();
  }

  function stop() {
    testSound.pause();
  }

  function toggleRain() {
    if (testRainLoop.paused) 
      testRainLoop.play();
    else
      testRainLoop.pause();
    }

  return (
    <>
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-t from-slate-900 to-slate-700">
      <button onClick={toggleRain}>
          Toggle Rain
        </button>
        <button onClick={play}>
          Play Sound
        </button>
        <button onClick={stop}>
          Stop Sound
        </button>
  </div>
  </>
  )
}

export default App

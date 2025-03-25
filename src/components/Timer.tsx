import { useRef, useState, useEffect } from 'react';
import React from 'react';

import { SlClock } from "react-icons/sl";

import './Timer.css';

const Timer = () => {

    const timerHours = useRef<HTMLInputElement>(null); //Reference for the timer hours input
    const timerMinutes = useRef<HTMLInputElement>(null); //Reference for the timer minutes input

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const runTimer = () => {
        console.log("runTimer()");
    }

    useEffect(() => {
        
      }, []);

    return(
        <div className="timer rounded-xl border-2 border-solid border-white bg-gradient-to-t from-slate-900 to-zinc-600">
                <div className="timerInputLabel">Timer</div>
                <div className="timerRemaining">00:00</div>
                <div className="timerInputArea">
                    <input type="number" className="timerInput rounded-sm border-1 border-solid border-white bg-gradient-to-t from-stone-900 to-slate-700" defaultValue="0" min="0" max="23" ref={timerHours}/>
                    <div className="timerColon">:</div>
                    <input type="number" className="timerInput rounded-sm border-1 border-solid border-white bg-gradient-to-t from-stone-900 to-slate-700" defaultValue="0" min="0" max="59" ref={timerMinutes}/>
                    <button className="timerButton" onClick={runTimer}>  <SlClock className="iconTimer"/>  </button>
                    </div>
            </div>
    )
}

export { Timer }
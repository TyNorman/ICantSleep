import { useRef, useState, useEffect } from 'react';
import React from 'react';

import { FaPlay, FaPause, FaStop } from "react-icons/fa6";
import { SlClose } from "react-icons/sl";


import './Timer.css';

interface TimerProps {
    onTimerComplete: () => void;
    onQuit: () => void;
    formatTime: (time: number) => string;
    changeHours: (e: React.ChangeEvent<HTMLInputElement>) => void;
    changeMinutes: (e: React.ChangeEvent<HTMLInputElement>) => void;
    runTimer: () => void;
    stopTimer: () => void;
    pauseTimer: () => void;
    isTimerRunning: boolean;
}

const Timer : React.FC<TimerProps> = ({ onTimerComplete, onQuit, formatTime, changeHours, changeMinutes, runTimer, stopTimer, pauseTimer, isTimerRunning }) => {

    const timerHours = useRef<HTMLInputElement>(null); //Reference for the timer hours input
    const timerMinutes = useRef<HTMLInputElement>(null); //Reference for the timer minutes input

    return(
        <div className="timer rounded-xl border-2 border-solid border-white bg-gradient-to-t from-slate-900 to-zinc-600">
                <button className="timerQuitButton" onClick={onQuit}>  <SlClose className="iconClose"/>  </button>
                <div className="timerInputLabel">Timer</div>
                <div className="timerInputArea">
                    <input type="number" onChange={changeHours} ref={timerHours} className="timerInput rounded-sm border-1 border-solid border-white bg-gradient-to-t from-stone-900 to-slate-700" min="0" max="23"/>
                    <div className="timerColon">:</div>
                    <input type="number" onChange={changeMinutes} ref={timerMinutes} className="timerInput rounded-sm border-1 border-solid border-white bg-gradient-to-t from-stone-900 to-slate-700" min="0" max="59"/>
                </div>
                <div className="timerControls">
                    {!isTimerRunning ? <button className="timerControlButton" onClick={runTimer}> <FaPlay className="iconTimerPlay"/> </button> : <button className="timerControlButton" onClick={pauseTimer}> <FaPause className="iconTimerPause"/> </button>}
                    <button className="timerControlButton" onClick={stopTimer}> <FaStop className="iconTimerStop"/></button>
                </div>
            </div>
    )
};

export { Timer };
import { useRef, useState, useEffect } from 'react';
import React from 'react';

import { FaPlay, FaPause, FaStop } from "react-icons/fa6";
import { SlClose } from "react-icons/sl";


import './Timer.css';

interface TimerProps {
    onTimerComplete: () => void;
    onQuit: () => void;
}

const Timer : React.FC<TimerProps> = ({ onTimerComplete, onQuit }) => {

    const timerHours = useRef<HTMLInputElement>(null); //Reference for the timer hours input
    const timerMinutes = useRef<HTMLInputElement>(null); //Reference for the timer minutes input

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    //Input Event Handlers
    const changeHours = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHours(Number(event.target.value));
        setSeconds(0);
    }

    const changeMinutes = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMinutes(Number(event.target.value));
        setSeconds(0);
    }

    //Timer Start/Pause/Stop Functions
    const runTimer = () => {
        console.log("runTimer()");
        if (hours != 0 || minutes != 0 || seconds != 0) {
            setIsTimerRunning(true);
        } else {
            setIsTimerRunning(false);
            window.alert("Please enter a valid time");
        }

    }

    const pauseTimer = () => {
        setIsTimerRunning(false);
    }

    const stopTimer = () => {
        setIsTimerRunning(false);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
    }

    const toggleTimer = () => {

    }

    // Helper function to format time values
    const formatTime = (value: number) => {
        return value < 10 ? `0${value}` : value.toString();
    };

    useEffect(() => {
        let interval = 0;

        if (isTimerRunning) {
            interval = setInterval(() => {
                if (seconds > 0)
                    setSeconds((seconds) => seconds - 1);
                else if (minutes > 0) {
                    setMinutes((minutes) => minutes - 1);
                    setSeconds(59);
                }
            else if (hours > 0) {
                setHours((hours) => hours - 1);
                setMinutes(59);
                setSeconds(59);
                }
                else {
                    setIsTimerRunning(false);
                    if (onTimerComplete)
                        onTimerComplete(); // Call the callback function when the timer completes
                }
            }, 1000); //Run the interval every second
        }
    return () => clearInterval(interval);
    } , [hours, minutes, seconds, isTimerRunning]);

    return(
        <div className="timer rounded-xl border-2 border-solid border-white bg-gradient-to-t from-slate-900 to-zinc-600">
                <button className="timerQuitButton" onClick={onQuit}>  <SlClose className="iconClose"/>  </button>
                <div className="timerInputLabel">Timer</div>
                <div className="timerRemaining">{formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}</div>
                <div className="timerInputArea">
                    <input type="number" value={formatTime(hours)} onChange={changeHours} ref={timerHours} className="timerInput rounded-sm border-1 border-solid border-white bg-gradient-to-t from-stone-900 to-slate-700" min="0" max="23"/>
                    <div className="timerColon">:</div>
                    <input type="number" value={formatTime(minutes)} onChange={changeMinutes} ref={timerMinutes} className="timerInput rounded-sm border-1 border-solid border-white bg-gradient-to-t from-stone-900 to-slate-700" min="0" max="59"/>
                </div>
                <div className="timerControls">
                    {!isTimerRunning ? <button className="timerControlButton" onClick={runTimer}> <FaPlay className="iconTimerPlay"/> </button> : <button className="timerControlButton" onClick={pauseTimer}> <FaPause className="iconTimerPause"/> </button>}
                    <button className="timerControlButton" onClick={stopTimer}> <FaStop className="iconTimerStop"/></button>
                </div>
            </div>
    )
};

export { Timer };
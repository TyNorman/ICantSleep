import { useRef, useState, useEffect } from 'react';
import React from 'react';

//Redux
import { useSelector, useDispatch } from 'react-redux'
import { changeHours, changeMinutes, runTimer, stopTimer, pauseTimer } from '../features/timer/timerSlice';

import { FaPlay, FaPause, FaStop } from "react-icons/fa6";
import { SlClose } from "react-icons/sl";


import './Timer.css';

interface TimerProps {
    onTimerComplete: () => void;
    onQuit: () => void;
}

const Timer : React.FC<TimerProps> = ({ onTimerComplete, onQuit }) => {

    const dispatch = useDispatch();

    const {hours, minutes, seconds} = useSelector((state: any) => state.timer); 

    const timerHours = useRef<HTMLInputElement>(null); //Reference for the timer hours input
    const timerMinutes = useRef<HTMLInputElement>(null); //Reference for the timer minutes input


    const formatTime = (value: number) => {
        return value < 10 ? `0${value}` : value.toString();
    };

    // Handle input changes with Redux actions
    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(changeHours(Number(e.target.value)));
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(changeMinutes(Number(e.target.value)));
    };

    const onRunTimer = () => {
        if (hours !== 0 || minutes !== 0 || seconds !== 0) {
            console.log('Running timer...');
            dispatch(runTimer());
        } else {
            window.alert('Please enter a valid time');
        }
    }

    const onPauseTimer = () => {
        dispatch(pauseTimer());
    }

    const onStopTimer = () => {
        dispatch(stopTimer());
    }

    // Retrieve isTimerRunning from the Redux store
    const isTimerRunning = useSelector((state: any) => state.timer.isRunning);

    return(
        <div className="timer rounded-xl border-2 border-solid border-white bg-gradient-to-t from-slate-900 to-zinc-600">
                <button className="timerQuitButton" onClick={onQuit}>  <SlClose className="iconClose"/>  </button>
                <div className="timerInputLabel">Timer</div>
                <div className="timerInputArea">
                    <input type="number" onChange={handleHoursChange} value={hours} className="timerInput rounded-sm border-1 border-solid border-white bg-gradient-to-t from-stone-900 to-slate-700" min="0" max="23"/>
                    <div className="timerColon">:</div>
                    <input type="number" onChange={handleMinutesChange} value={minutes} className="timerInput rounded-sm border-1 border-solid border-white bg-gradient-to-t from-stone-900 to-slate-700" min="0" max="59"/>
                </div>
                <div className="timerControls">
                    {!isTimerRunning ? <button className="timerControlButton" onClick={onRunTimer}> <FaPlay className="iconTimerPlay"/> </button> : <button className="timerControlButton" onClick={onPauseTimer}> <FaPause className="iconTimerPause"/> </button>}
                    <button className="timerControlButton" onClick={onStopTimer}> <FaStop className="iconTimerStop"/></button>
                </div>
            </div>
    )
};

export { Timer };
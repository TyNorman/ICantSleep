/* AudioPlayer developed using https://github.com/selfteachme/0046-custom-audio-player (https://www.youtube.com/watch?v=sqpg1qzJCGQ) as a tutorial to get started. */

import './AudioPlayer.css'

import { SlControlPlay, SlControlPause } from "react-icons/sl";

import testMusic from '../assets/audio/snes/Donkey Kong Country 2/1-11. Forest Interlude.mp3'
import testRain from '../assets/audio/rain/20 Rain.mp3'

import { useRef, useState, useEffect } from 'react';

const AudioPlayer = () => {
    //States
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    //References
    const audioPlayer = useRef<HTMLAudioElement>(null); //Reference for audio component
    const progressBar = useRef<HTMLInputElement>(null); //Reference for the current song progress bar
    const animationRef = useRef<number>(null); //Reference for animation

    //UseEffect
    useEffect(() => {
        if (audioPlayer.current) {
            const seconds = Math.floor(audioPlayer.current.duration);
            setDuration(seconds);

            if (progressBar.current) {
                progressBar.current.max = seconds.toString();
            }
        }
            
    }, [audioPlayer?.current?.onloadedmetadata, audioPlayer?.current?.readyState]);

    //Functions
    const calculateTime = (secs:number) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`; //If less than 10 seconds, add a 0 to the front
        return `${minutes}:${returnSeconds}`;
    }

    const toggleSong = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue);

        if (audioPlayer.current) {
            if (!prevValue) {
                audioPlayer.current.play();

                animationRef.current = requestAnimationFrame(whilePlaying);
            } else { 
                audioPlayer.current.pause();

                if (animationRef.current)
                    cancelAnimationFrame(animationRef.current);
            }
        }
        
    }

    const changeRange = () => { //Function to change the range slider
        if (audioPlayer.current && progressBar.current) {
            var currentProgress = parseInt(progressBar.current.value);
            audioPlayer.current.currentTime = currentProgress;
            changePlayerCurrentTime();
        }
    }

    const whilePlaying = () => { //Function to animate seconds counter every 1 sec tick
        if (progressBar.current && audioPlayer.current) {
            progressBar.current.value = audioPlayer.current.currentTime.toString();
            changePlayerCurrentTime();
            if (animationRef.current)
                animationRef.current = requestAnimationFrame(whilePlaying); //Replay the animationRef upon completion
        }
    }

    const changePlayerCurrentTime = () => { //Function to update the current time based on progress
        if (progressBar.current && audioPlayer.current) {
            var currentProgress = parseInt(progressBar.current.value);
            progressBar.current.style.setProperty('--seek-before-width', `${currentProgress / duration * 100}%`); //Need to add % at the end for the 
            setCurrentTime(currentProgress);
        }
    }

    return(
        <div className="audioPlayer">
            <audio ref={audioPlayer} src={testMusic} preload="metadata"></audio>
            <button className="playPauseButton" onClick={toggleSong}>
                { isPlaying ? <SlControlPause className="iconPause" /> : <SlControlPlay className="iconPlay"/> }
            </button>

            {/* Current Time */} 
            <div className="timeDisplay">{calculateTime(currentTime)}</div>

            {/* Progress Bar */}
            <div>
                <input type="range" className="progressBar" defaultValue="0" ref={progressBar} onChange={changeRange}/>
            </div>

            {/* Duration */}
            <div className="timeDisplay">{(duration && !isNaN(duration)) && calculateTime(duration)}</div>

        </div>
    )
}

export { AudioPlayer }
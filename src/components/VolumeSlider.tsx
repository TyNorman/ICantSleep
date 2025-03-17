import { useRef, useState, useEffect } from 'react';
import React from 'react';

import './VolumeSlider.css'

interface VolumeSliderProps {
    volume: number;
    setVolume: React.Dispatch<React.SetStateAction<number>>;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ volume, setVolume })  => { 
    const changeVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (volumeBar.current) {
            setVolume(Number(event.target.value));
            volumeBar.current.style.setProperty('--vol-before-width', `${event.target.value}%`);
        }
    };

    const volumeBar = useRef<HTMLInputElement>(null); //Reference for the volume slider bar

    /*
    const changeVolume = () => { //Function to change the range slider
        if (volumeBar.current) {
            //Visually update the VolumeBar
            var currentVolume = parseInt(volumeBar.current.value);
            volumeBar.current.style.setProperty('--vol-before-width', `${currentVolume}%`); 

            //TODO: Actually return a value to adjust the volume in AudioPlayer for something (ex. rain)
            dispatchEvent(new CustomEvent('volumeChange', {detail: currentVolume})); 
        }
    }*/

    return(
        <div className="volumeSlider">
            <div>
                <input type="range" className="volumeBar" defaultValue="50" ref={volumeBar} onChange={changeVolume}/>
            </div>
        </div>
    )
}

export { VolumeSlider }
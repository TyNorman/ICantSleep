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

    return(
        <div className="volumeSlider">
            <div>
                <input type="range" className="volumeBar" defaultValue="100" ref={volumeBar} onChange={changeVolume}/>
            </div>
        </div>
    )
}

export { VolumeSlider }
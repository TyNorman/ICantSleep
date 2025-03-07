import { useRef, useState, useEffect } from 'react';

import './VolumeSlider.css'

const VolumeSlider = () => { 
    const volumeBar = useRef<HTMLInputElement>(null); //Reference for the volume slider bar

    const changeVolume = () => { //Function to change the range slider
        if (volumeBar.current) {
            //Visually update the VolumeBar
            var currentVolume = parseInt(volumeBar.current.value);
            volumeBar.current.style.setProperty('--vol-before-width', `${currentVolume}%`); 

            //TODO: Actually return a value to adjust the volume in AudioPlayer for something (ex. rain)
        }
    }

    return(
        <div className="volumeSlider">
            <div>
                <input type="range" className="volumeBar" defaultValue="50" ref={volumeBar} onChange={changeVolume}/>
            </div>
        </div>
    )
}

export { VolumeSlider }
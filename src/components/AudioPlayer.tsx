/* AudioPlayer developed using https://github.com/selfteachme/0046-custom-audio-player (https://www.youtube.com/watch?v=sqpg1qzJCGQ) as a tutorial to get started. */

import './AudioPlayer.css'

//Icons
import { SlControlPlay, SlControlPause, SlControlForward, SlControlRewind, SlVolume1, SlVolume2, SlVolumeOff } from "react-icons/sl";

import testMusic from '../assets/audio/snes/Donkey Kong Country 2/1-11. Forest Interlude.mp3'
import testRain from '../assets/audio/rain/20 Rain.mp3'

import { useRef, useState, useEffect } from 'react';
import { VolumeSlider } from './VolumeSlider';

const AudioPlayer = () => {
    //States
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [trackTitle, setTrackTitle] = useState("---");
    const [indexSong, setIndexSong] = useState(0);

    //List of all songs in the database
    const [songList, setSongList] = useState([
        { title: "", src: "", game: "", game_system: "" }
    ]);

    const [currentSongSrc, setCurrentSongSrc] = useState("");
    const [currentSong, setCurrentSong] = useState({});

    //References
    const musicPlayer = useRef<HTMLAudioElement>(null); //Reference for audio component to play a song
    const rainPlayer = useRef<HTMLAudioElement>(null);  //Reference to play rain audio
    const progressBar = useRef<HTMLInputElement>(null); //Reference for the current song progress bar
    const animationRef = useRef<number>(null); //Reference for animation

    //UseEffects
    useEffect(() => {
        addEventListener('onSongsLoaded', handleSongsLoaded);
        preloadAudio();
    }, []);


    useEffect(() => {
        updateTrackInfo();
            
    }, [musicPlayer?.current?.onloadedmetadata, musicPlayer?.current?.readyState, indexSong]);

    useEffect(() => {
        if (songList.length > 0 && songList[indexSong].title !== "") {
            console.log('Updated songList:', songList);
            setCurrentSongSrc(songList[indexSong].src); // Set the current song to the first song in the list
        }
    }, [songList]);

    useEffect(() => {
        if (musicPlayer.current && rainPlayer.current && currentSongSrc) {

            musicPlayer.current.src = '/src/assets/audio/'+currentSongSrc;
            musicPlayer.current.load();
            console.log("Current song: " + currentSongSrc);
            updateTrackInfo();

            if (isPlaying) {
                musicPlayer.current.play();
                rainPlayer.current.play();
            } else {
                musicPlayer.current.pause();
                rainPlayer.current.pause();
            }
        }
    }, [currentSongSrc, indexSong]);

    /*
    useEffect(() => {
        if (songList.length > 0 && songList[0].title !== "") {
            console.log('Updated songList:', songList);
            setCurrentSong(randomSong());

            console.log("Current song: " + currentSong);
        }
    }, [songList]);
    */

    //Functions
    const updateTrackInfo = () => {
        console.log("updateTrackInfo()");
        if (musicPlayer.current) {
            const seconds = Math.floor(musicPlayer.current.duration);
            setDuration(seconds);

            if (progressBar.current) {
                progressBar.current.max = seconds.toString();
            }

            if (musicPlayer.current && musicPlayer.current.src) {
                const trackTitle = decodeURI(musicPlayer.current.src.split("/").pop() || "---");
                setTrackTitle(trackTitle);
            }
        }
    }

    const calculateTime = (secs:number) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`; //If less than 10 seconds, add a 0 to the front
        return `${minutes}:${returnSeconds}`;
    }

    const changeSong= () => {
        console.log("change song()");
        setCurrentSongSrc(songList[indexSong].src);

        //Retain the playing/paused state when switching songs but this has to happen later
    }

    const toggleSong = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue);

        if (musicPlayer.current && rainPlayer.current) {
            console.log('musicPlayer src: ' + musicPlayer.current.src);
            if (!prevValue) {
                musicPlayer.current.play();
                rainPlayer.current.play();

                animationRef.current = requestAnimationFrame(whilePlaying);
            } else { 
                musicPlayer.current.pause();
                rainPlayer.current.pause();

                if (animationRef.current)
                    cancelAnimationFrame(animationRef.current);
            }
        }
        
    }

    const previousSong = () => {
        if (indexSong > 0)
            setIndexSong(indexSong - 1);
        else
            setIndexSong(songList.length - 1);

        changeSong();
    }

    const nextSong = () => {
        if (indexSong < songList.length - 1)
            setIndexSong(indexSong + 1);
        else
            setIndexSong(0);

            changeSong();
    }

    const changeRange = () => { //Function to change the range slider
        if (musicPlayer.current && progressBar.current) {
            var currentProgress = parseInt(progressBar.current.value);
            musicPlayer.current.currentTime = currentProgress;
            changePlayerCurrentTime();
        }
    }

    const whilePlaying = () => { //Function to animate seconds counter every 1 sec tick
        if (progressBar.current && musicPlayer.current) {
            progressBar.current.value = musicPlayer.current.currentTime.toString();
            changePlayerCurrentTime();
            if (animationRef.current)
                animationRef.current = requestAnimationFrame(whilePlaying); //Replay the animationRef upon completion
        }
    }

    const changePlayerCurrentTime = () => { //Function to update the current time based on progress
        if (progressBar.current && musicPlayer.current) {
            var currentProgress = parseInt(progressBar.current.value);
            progressBar.current.style.setProperty('--seek-before-width', `${currentProgress / duration * 100}%`); //Need to add % at the end for the CSS
            setCurrentTime(currentProgress);
        }
    }

    const toggleVolumeRain = () => {
        //Show/Hide Volume controls for rain
    }

    const randomSong = () => {
        var randSong = songList[Math.floor(Math.random() * songList.length)].src;

        console.log("randSong: " + songList.length);
        randSong = songList[2].src;

        return randSong;
    }

    //Preloading
    const preloadAudio = async () => {
        try {
            const response = await fetch('./src/songlist.json');
            const songs = await response.json();

            console.log('Loaded songs: ' + songs);

            setSongList(songs);
        } catch (error) {
            console.error('Error loading song list:', error);
        }
    }

    const handleSongsLoaded = () => {
        console.log('Songs loaded:', songList);
    }

    return(
        <div className="audioPlayer">
           {/* HTMLAudioElement audio tracks */}
            <audio ref={rainPlayer} src={testRain} preload="metadata"></audio>
            <audio ref={musicPlayer} src={testMusic} preload="metadata"></audio>

            <div className="rainDisplay">
                <div className="rainVolume" onClick={toggleVolumeRain}>Rain Volume</div>
                <button className="volumeButton">  <SlVolume2 className="iconVolume"/>  </button>
                <VolumeSlider/>
            </div>

            <div className="trackTitle">{trackTitle}</div>
            <div className="trackDisplay">

            {/* Current Time */} 
            <div className="timeDisplay">{calculateTime(currentTime)}</div>

            {/* Progress Bar */}
            <div>
                <input type="range" className="progressBar" defaultValue="0" ref={progressBar} onChange={changeRange}/>
            </div>

            {/* Duration */}
            <div className="durationDisplay">{(duration && !isNaN(duration)) && calculateTime(duration)}</div>
            </div>

            <div className="buttonArea">
                <button className="previousNextButton" onClick={previousSong}>  <SlControlRewind className="iconBack"/>  </button>
                <button className="playPauseButton" onClick={toggleSong}>
                    { isPlaying ? <SlControlPause className="iconPause" /> : <SlControlPlay className="iconPlay"/> }
                </button>
                <button className="previousNextButton" onClick={nextSong}> <SlControlForward className="iconForward"/> </button>
            </div>
        </div>
    )
}

export { AudioPlayer }
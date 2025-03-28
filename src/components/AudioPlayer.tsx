/* AudioPlayer developed using https://github.com/selfteachme/0046-custom-audio-player (https://www.youtube.com/watch?v=sqpg1qzJCGQ) as a tutorial to get started. */

import './AudioPlayer.css'

//Icons
import { SlControlPlay, SlControlPause, SlControlForward, SlControlRewind, SlVolume1, SlVolume2, SlVolumeOff, SlClock } from "react-icons/sl";

import testMusic from '../assets/audio/snes/Donkey Kong Country 2/1-11. Forest Interlude.mp3'
import testRain from '../assets/audio/rain/20 Rain.mp3'

import { useRef, useState, useEffect } from 'react';

import { VolumeSlider } from './VolumeSlider';
import { Timer } from './Timer';

//TO DO:
// - Volume slider for music
// - Show/Hide volume sliders
// - Fix Duration bar updating
    // Doesn't update duration when song changes

// SLEEP TIMER
// - Stop music once timer stops


const AudioPlayer = () => {
    //States
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [trackTitle, setTrackTitle] = useState("---");
    const [trackGame, setTrackGame] = useState("---");
    const [trueSongIndex, setTrueSongIndex] = useState(0); //Actual index of song

    //Volume States
    const [rainVolume, setRainVolume] = useState(50);
    const [musicVolume, setMusicVolume] = useState(50);

    //List of all songs in the database
    const [songList, setSongList] = useState([
        { title: "", src: "", game: "", game_system: "" }
    ]);

    const [currentSongSrc, setCurrentSongSrc] = useState("");
    const [currentSong, setCurrentSong] = useState({});

    //Song randomization
    const [songIndexes, setSongIndexes] = useState<number[]>([]); //Array of song indexes to randomize the song list
    const [currentRandIndex, setCurrentRandIndex] = useState(0); //Current index of the randomized song list
    const [hasInitializedShuffle, setInitShuffle] = useState(false); // Flag to indicate if songs have been shuffled

    //References
    const musicPlayer = useRef<HTMLAudioElement>(null); //Reference for audio component to play a song
    const rainPlayer = useRef<HTMLAudioElement>(null);  //Reference to play rain audio
    const progressBar = useRef<HTMLInputElement>(null); //Reference for the current song progress bar

    const animationRef = useRef<number>(null); //Reference for animation

    //UseEffects
    useEffect(() => { //Initial setup
        window.addEventListener('volumeChange', () => setRainVolume(rainVolume));
        window.addEventListener('volumeChange', () => setMusicVolume(musicVolume));
        preloadAudio();
    }, []);

    useEffect(() => { //Update track info when the song has loaded
        updateTrackInfo();
            
    }, [musicPlayer?.current?.onloadedmetadata, musicPlayer?.current?.readyState, trueSongIndex]);

    //Populate the SongIndexes to randomize
    useEffect(() => {
        if (songList.length > 0 && songList[trueSongIndex].title !== "") {
            console.log('Updated songList:', songList);

            //Shuffle
             // Create and set song indexes
             const indexes = songList.map((_, index) => index);
             setSongIndexes(indexes);
        }
    }, [songList]);

    useEffect(() => { //Randomize the SongIndexes to create a shuffled playlist
        if (songIndexes.length > 0) {
            if (!hasInitializedShuffle) { //Shuffle the playlist and set the flag to true
                shuffleSongs();
                setInitShuffle(true);
            }
            else { //Start with a randomized song
                console.log("Init song - songIndexes: " + songIndexes);
                setTrueSongIndex(songIndexes[currentRandIndex]);
                setCurrentSongSrc(songList[songIndexes[currentRandIndex]].src); // Set the current song to the first song in the list
            }
        }
    }, [songIndexes, hasInitializedShuffle]);

    useEffect(() => { //Change the song when the song index changes
        if (musicPlayer.current && rainPlayer.current && currentSongSrc) {

            musicPlayer.current.src = '/src/assets/audio/'+ currentSongSrc;
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
    }, [currentSongSrc, trueSongIndex]);

    //Volume Change useEffects
    useEffect(() => {
        if (rainPlayer.current) {
            rainPlayer.current.volume = (rainVolume / 100);
        }
    }), [rainVolume];

    useEffect(() => {
        if (musicPlayer.current) {
            musicPlayer.current.volume = (musicVolume / 100);
        }
    }), [musicVolume];

    //Functions
    const updateTrackInfo = () => {
        if (musicPlayer.current) {
            console.log("UpdateTrackInfo()");

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
        setCurrentSongSrc(songList[trueSongIndex].src);
        updateTrackInfo();
        setTrackGame(songList[trueSongIndex].game);
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
        if (currentRandIndex > 0)
            setCurrentRandIndex(currentRandIndex - 1);
        else
            setCurrentRandIndex(songIndexes.length - 1);

        setTrueSongIndex(songIndexes[currentRandIndex]);
        changeSong();
    }

    const nextSong = () => {
        if (currentRandIndex < songIndexes.length - 1)
            setCurrentRandIndex(currentRandIndex + 1);
        else
            setCurrentRandIndex(0);

        setTrueSongIndex(songIndexes[currentRandIndex]);
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

    const toggleVolumeSong = () => {
        //Show/Hide Volume controls
    }

    const shuffleSongs = () => {
        var currentIndex = songList.length;
        var shuffleArray = [...songIndexes];
        
        while (currentIndex != 0) {
            var randIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [shuffleArray[currentIndex], shuffleArray[randIndex]] = [
                shuffleArray[randIndex], shuffleArray[currentIndex]];
        }

        setSongIndexes(shuffleArray);
    }

    const handleSongEnded = () => {
        console.log("handleSongEnded()");
        nextSong();
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

    return(
        <div className="audioPlayer">
           {/* HTMLAudioElement audio tracks */}
            <audio ref={rainPlayer} src={testRain} preload="metadata"></audio>
            <audio ref={musicPlayer} src={testMusic} preload="metadata" onEnded={handleSongEnded}></audio>

            {/* Timer */}
            <Timer/>

            {/* Rain Volume Slider */}

            <div className="volumeContainer">
                <div className="volumeDisplay">
                    <div className="labelVolume">Rain Volume</div>
                    <button className="volumeButton">  <SlVolume2 className="iconVolume"/> </button>
                    <VolumeSlider volume={rainVolume} setVolume={setRainVolume} />
                </div>
                <div className="volumeDisplay">
                    <div className="labelVolume">Music Volume</div>
                    <button className="volumeButton">  <SlVolume2 className="iconVolume"/> </button>
                    <VolumeSlider volume={musicVolume} setVolume={setMusicVolume} />
                </div>
            </div>

            <div className="trackTitle">{trackTitle}</div>
            <div className="trackGame">{trackGame}</div>
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
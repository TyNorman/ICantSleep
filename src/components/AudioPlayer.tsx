/* AudioPlayer developed using https://github.com/selfteachme/0046-custom-audio-player (https://www.youtube.com/watch?v=sqpg1qzJCGQ) as a tutorial to get started. */

import './AudioPlayer.css'

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { changeHours, changeMinutes, runTimer, stopTimer, pauseTimer, tickTimer } from '../features/timer/timerSlice';
import { RootState } from '../store';

//Icons
import { SlControlPlay, SlControlPause, SlControlForward, SlControlRewind, SlVolume1, SlVolume2, SlVolumeOff, SlClock } from "react-icons/sl";

//import testMusic from '../assets/audio/snes/Donkey Kong Country 2/1-11. Forest Interlude.mp3'
import testRain from '../assets/audio/rain/20 Rain.mp3'
import noArt from '../assets/audio/snes/NoArt.png';

import { useRef, useState, useEffect } from 'react';

import { VolumeSlider } from './VolumeSlider';
import { Timer } from './Timer';
import { PlaylistItem } from './PlaylistItem'; 

//TO DO:
// - Fix Duration bar updating
    // Doesn't update duration when song changes
    // Bar fill doesn't update (duration might not be updated?)

// SLEEP TIMER
// - Display timer on the main AudioPlayer
// - Stop music once timer stops

// CONTENT
// - Add a shitload of music
// - Good idea to implement a visible playlist with functionality


const AudioPlayer = () => {
    //Song states
    const [isPlaying, setIsPlaying] = useState(false); //Current song playing
    const [currentTime, setCurrentTime] = useState(0); //Current time of song
    const [duration, setDuration] = useState(0); //Duration of current song
    const [trackTitle, setTrackTitle] = useState("---"); //Current song title
    const [trackGame, setTrackGame] = useState("---"); //Current song game/album
    const [trackArt, setTrackArt] = useState(""); //Current song art
    const [currentSongIndex, setCurrentSongIndex] = useState(0); //Index of the current song in the current playlist

    //Timer display states
    const [isDisplayingTimer, setIsDisplayingTimer] = useState(false); //Timer display panel

    //Volume states
    const [rainVolume, setRainVolume] = useState(100);
    const [musicVolume, setMusicVolume] = useState(100);

    //List of all songs in the database
    const [songList, setSongList] = useState([
        { title: "", src: "", art: "", game: "", game_system: "" }
    ]);
    //Current playlist of songs after shuffling
    const [playlist, setPlaylist] = useState([
        { title: "", src: "", art: "", game: "", game_system: "" }
    ]);

    const [currentSongSrc, setCurrentSongSrc] = useState("");
    const [currentSong, setCurrentSong] = useState({});

    //Song randomization
    const [hasInitializedShuffle, setInitShuffle] = useState(false); // Flag to indicate if songs have been shuffled

    //References
    const musicPlayer = useRef<HTMLAudioElement>(null); //Reference for audio component to play a song
    const rainPlayer = useRef<HTMLAudioElement>(null);  //Reference to play rain audio
    const progressBar = useRef<HTMLInputElement>(null); //Reference for the current song progress bar

    const animationRef = useRef<number>(null); //Reference for animation

    //Redux hooks for the Timer
    const dispatch = useDispatch(); 
    const {hours, minutes, seconds, isRunning} = useSelector((state: RootState) => state.timer); //Get the timer values from the Redux store

    //UseEffects
    useEffect(() => { //Initial setup
        window.addEventListener('volumeChange', () => setRainVolume(rainVolume));
        window.addEventListener('volumeChange', () => setMusicVolume(musicVolume));
        window.addEventListener('timerComplete', () => onTimerComplete());
        preloadAudio();
    }, []);

    useEffect(() => { //Update track progress bar and duration info when the song has loaded
        updateDuration();
            
    }, [musicPlayer?.current?.onloadedmetadata, musicPlayer?.current?.readyState]);

    useEffect(() => { //Randomize the SongIndexes to create a shuffled playlist
        if (songList.length > 0 && songList[currentSongIndex].title !== "") {
            console.log('Updated songList:', songList);

            if (!hasInitializedShuffle) { //Shuffle the playlist and set the flag to true
                console.log("Shuffling songs...");
                shuffleSongs();
                setInitShuffle(true);
            }
            else { //Start with a randomized song
                console.log("Init song - currentSongIndex: " + currentSongIndex);
                setCurrentSongSrc(playlist[currentSongIndex].src); // Set the current song to the first song in the list
            }
        }
    }, [songList, hasInitializedShuffle]);

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
    }, [currentSongSrc]);


    useEffect(() => {
        setCurrentSongSrc(playlist[currentSongIndex].src);
        console.log("Current song useEffect(): " + playlist[currentSongIndex].title);
    }, [currentSongIndex]);

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

    //#region Timer

    useEffect(() => {
        let interval = 0;

        if (isRunning) { //Use the Redux timer to update the timer values every interval tick
            interval = setInterval(() => {
                dispatch(tickTimer());
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [hours, minutes, seconds, isRunning]);

    // Helper function to format time values
    const formatTime = (value: number) => {
        return value < 10 ? `0${value}` : value.toString();
    };
    //#endregion

    //Functions
    const updateDuration = () => {
        if (musicPlayer.current) {
            const seconds = Math.floor(musicPlayer.current.duration);
            setDuration(seconds);

            if (progressBar.current) {
                progressBar.current.max = seconds.toString();
            }
        }
    }

    const updateTrackInfo = () => {
        if (musicPlayer.current) {
            console.log("UpdateTrackInfo()");

            if (musicPlayer.current && musicPlayer.current.src) {
                setTrackTitle(playlist[currentSongIndex].title);
                setTrackGame(playlist[currentSongIndex].game);

                console.log("Track art:" + playlist[currentSongIndex].art);

                if (playlist[currentSongIndex].art != "")
                    setTrackArt("/src/assets/audio/" + playlist[currentSongIndex].art); 
                else
                    setTrackArt("");

                updateDuration();
            }
        }
    }

    const calculateTime = (secs:number) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`; //If less than 10 seconds, add a 0 to the front
        return `${minutes}:${returnSeconds}`;
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
        if (currentSongIndex > 0) {
            setCurrentSongIndex(currentSongIndex - 1);
        } else {
            setCurrentSongIndex(playlist.length - 1);
        }
    }

    const nextSong = () => {
        if (currentSongIndex < playlist.length - 1) {
            setCurrentSongIndex(currentSongIndex + 1);
        } else {
            setCurrentSongIndex(0);
        }
    }

    const changeRange = () => { //Function to change the range slider
        if (musicPlayer.current && progressBar.current) {
            var currentProgress = parseInt(progressBar.current.value);
            musicPlayer.current.currentTime = currentProgress;
            changePlayerCurrentTime();
        }
    }

    const toggleTimer = () => { //Function to show/hide the timer
        const prevValue = isDisplayingTimer;
        setIsDisplayingTimer(!prevValue);

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

        var shuffledSongs = [...songList];

        while (currentIndex != 0) {
            var randIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [shuffledSongs[currentIndex], shuffledSongs[randIndex]] = [
                shuffledSongs[randIndex], shuffledSongs[currentIndex]];
        }

        console.log("Shuffled songs: " + shuffledSongs[0].title);
        setPlaylist(shuffledSongs); // Set the shuffled playlist
    }

    const handleSongEnded = () => {
        console.log("handleSongEnded()");
        nextSong();
    }

    const onTimerComplete = () => { 
        console.log("Timer has completed!");
        setIsPlaying(false); // Stop the music
        if (musicPlayer.current) {
            musicPlayer.current.pause();
        }
        if (rainPlayer.current) {
            rainPlayer.current.pause();
        }
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
            <audio ref={musicPlayer} src={currentSongSrc ? currentSongSrc : undefined} preload="metadata" onEnded={handleSongEnded}></audio>

            {/* Timer */}
            <div className="timerArea">
            <div className="timerBar">
            <div className="timerRemaining">{formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}</div>
                <button className="timerButton" onClick={toggleTimer}>  <SlClock className="iconTimer"/> </button>
                </div>
            {isDisplayingTimer && <Timer onTimerComplete={onTimerComplete} onQuit={() => setIsDisplayingTimer(false)} />}
            </div>

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

            <img className="albumImg" src={trackArt ? trackArt : noArt}></img>
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

            <div className="playlistContainer">
                <h2 className="playlistTitle">Playlist</h2>
                <div className="playlistItems">
                    {playlist.map((song, index) => (
                        <PlaylistItem 
                            key={index} 
                            title={song.title} 
                            game={song.game} 
                            art={song.art ? song.art : noArt}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export { AudioPlayer }
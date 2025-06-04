    import { createSlice, PayloadAction } from '@reduxjs/toolkit';
    import { useEffect } from 'react';

    
    const initialState: TimerState = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        isRunning: false
    };
    
    export const timerSlice = createSlice({
      name: 'timer',
      initialState,
      reducers: {

        //FUNCTIONS GO HERE
        changeHours: (state, action: PayloadAction<number>) => {
            state.hours = action.payload;
            state.seconds = 0;
        },

        changeMinutes: (state, action: PayloadAction<number>) => {
            state.minutes = action.payload;
            state.seconds = 0;
        },

        setSeconds: (state, action: PayloadAction<number>) => {
            state.seconds = action.payload;
        },

        runTimer: (state) => {
            if (state.hours !== 0 || state.minutes !== 0 || state.seconds !== 0) {
                state.isRunning = true;
            }
        },

        stopTimer: (state) => {
            state.isRunning = false;
            state.hours = 0;
            state.minutes = 0;
            state.seconds = 0;
        },

        pauseTimer: (state) => {
            state.isRunning = false;
        },

        tickTimer: (state) => {
            if (state.seconds > 0) {
                state.seconds -= 1;
            } else if (state.minutes > 0) {
                state.minutes -= 1;
                state.seconds = 59;
            } else if (state.hours > 0) {
                state.hours -= 1;
                state.minutes = 59;
                state.seconds = 59;
            } else {
                state.isRunning = false;
            }
        }
      },
    });
    
    export const {
        changeHours,
        changeMinutes,
        setSeconds,
        runTimer,
        stopTimer,
        pauseTimer,
        tickTimer
    } = timerSlice.actions;
    
    export default timerSlice.reducer;
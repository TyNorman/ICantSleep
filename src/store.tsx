import { configureStore } from '@reduxjs/toolkit';

import timerReducer from './features/timer/timerSlice';

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
}

const store = configureStore({
  reducer: {
    timer: timerReducer
  },
})

console.log(store.getState());

export type RootState = ReturnType<typeof store.getState>;

export default store;
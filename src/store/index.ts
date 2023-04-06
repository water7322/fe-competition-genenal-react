import { configureStore } from '@reduxjs/toolkit';
import configSlice from './configSlice';
// import loginSlice from './loginSlice'
import userSlice from './userSlice';

export const store = configureStore({
    reducer: {
        config: configSlice.reducer,
        // login: loginSlice.reducer,
        user: userSlice.reducer
    },
    devTools: true
});
const state = store.getState()
export type RootState = typeof state;

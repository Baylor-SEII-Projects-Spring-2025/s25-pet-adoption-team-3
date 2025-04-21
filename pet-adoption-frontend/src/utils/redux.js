import { combineReducers, configureStore } from "@reduxjs/toolkit";
import sampleReducer from "./slices/sampleSlice";

const reducers = combineReducers({
    sample: sampleReducer,
});

export const buildStore = (initialState) => {
    return configureStore({
        preloadedState: initialState,
        reducer: reducers,
        devTools: process.env.NODE_ENV !== "production",
    });
};
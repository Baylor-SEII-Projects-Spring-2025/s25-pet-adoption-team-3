import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import sampleReducer from "./slices/sampleSlice";

const reducers = combineReducers({
    sample: sampleReducer,
});

export const buildStore = (initialState) => {
    return configureStore({
        preloadedState: initialState,
        reducer: reducers,
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat(thunk);
        },
        devTools: process.env.NODE_ENV !== "production", // ✅ No need for explicit process declaration
    });
};

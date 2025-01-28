import { createSlice } from "@reduxjs/toolkit";

// Initial state of slice
const initialState = {
  count: 0,
};

// Define the reducers for the slice
export const sampleSlice = createSlice({
  name: "sample",
  initialState,
  reducers: {
    addToCounter(state, action) {
      // Note that action.payload can be *anything*: number, object, string, etc.
      state.count += action.payload;
    },
  },
});

// Export the actions
export const { addToCounter } = sampleSlice.actions;

// Export the reducer
export default sampleSlice.reducer;

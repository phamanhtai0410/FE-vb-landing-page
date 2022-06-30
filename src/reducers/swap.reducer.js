import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sourceTokenAddress: process.env.REACT_APP_TOKEN_WVET,
    desireTokenAddress: process.env.REACT_APP_TOKEN_VEBANK,
};

const swapAssetSlice = createSlice({
    name: 'swapAsset',
    initialState,
    reducers: {
        selectSourceToken: (state, action) => {
            if (action.payload) {
                state.sourceTokenAddress = action.payload;
            }
        },
        selectDesireToken: (state, action) => {
            if (action.payload) {
                state.desireTokenAddress = action.payload;
            }
        },
        swapTokenDesire: (state, action) => {
            const sourceAddress = state.sourceTokenAddress;
            const desireAddress = state.desireTokenAddress;
            state.sourceTokenAddress = desireAddress;
            state.desireTokenAddress = sourceAddress;
        },
    },
});

export default swapAssetSlice.reducer;

export const selectSourceToken = state => state.swapAsset.sourceTokenAddress;
export const selectDesireToken = state => state.swapAsset.desireTokenAddress;
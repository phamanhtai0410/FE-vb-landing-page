import { createSlice } from "@reduxjs/toolkit";
import { swapConstants } from "../constants";

const initialState = {
  sourceTokenAddress: process.env.REACT_APP_TOKEN_WVET,
  desireTokenAddress: process.env.REACT_APP_TOKEN_VEBANK,
  isModalSelectTokenOpen: false,
  nameToken: swapConstants.FIRST_TOKEN,
};

const swapAssetSlice = createSlice({
  name: "swapAsset",
  initialState,
  reducers: {
    selectSourceTokenFromModal: (state, action) => {
      if (action.payload) {
        state.sourceTokenAddress = action.payload;
        state.isModalSelectTokenOpen = false;
      }
    },
    selectDesireTokenFromModal: (state, action) => {
      if (action.payload) {
        state.desireTokenAddress = action.payload;
        state.isModalSelectTokenOpen = false;
      }
    },
    swapTokenDesire: (state, action) => {
      const sourceAddress = state.sourceTokenAddress;
      const desireAddress = state.desireTokenAddress;
      state.sourceTokenAddress = desireAddress;
      state.desireTokenAddress = sourceAddress;
    },
    openModalSelectToken: (state, action) => {
      state.isModalSelectTokenOpen = true;
      state.nameToken = action.payload;
    },
    closeModalSelectToken: (state, action) => {
      state.isModalSelectTokenOpen = false;
    },
  },
});

export default swapAssetSlice.reducer;

export const {
  swapTokenDesire,
  openModalSelectToken,
  closeModalSelectToken,
  selectSourceTokenFromModal,
  selectDesireTokenFromModal,
} = swapAssetSlice.actions;

export const selectSourceToken = (state) => state.swapAsset.sourceTokenAddress;
export const selectDesireToken = (state) => state.swapAsset.desireTokenAddress;
export const selectNameTokenState = (state) => state.swapAsset.nameToken;
export const selectOpenChooseTokenState = (state) =>
  state.swapAsset.isModalSelectTokenOpen;

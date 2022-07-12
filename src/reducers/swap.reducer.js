import { createSlice } from "@reduxjs/toolkit";
import {
  checkApproveToken,
  checkAssetExistsPools,
  getAmountsIn,
  getAmountsOut,
  getPairsFee,
  onApproveTokenForAccount,
  swapAsset,
} from "../actions";
import { swapConstants } from "../constants";

const initialState = {
  sourceTokenAddress: process.env.REACT_APP_TOKEN_WVET,
  desireTokenAddress: process.env.REACT_APP_TOKEN_VEBANK,
  isModalSelectTokenOpen: false,
  nameToken: swapConstants.FIRST_TOKEN,
  symbolPairs: [],
  exchangeRateAB: 0,
  exchangeRateBA: 0,
  isSwap: true,
  loadingFee: false,
  pairFee: 0,
  loadingGetAmountOut: false,
  loadingGetAmountIn: false,
  amountsOut: "",
  amountsIn: "",
  accountApprove: 0,
  contractSwap: "",
  poolAddress: "",
};

const swapAssetSlice = createSlice({
  name: "swapAsset",
  initialState,
  reducers: {
    updateStatusSwap: (state, action) => {
      state.isSwap = action.payload;
    },
    countExchangeRate: (state, action) => {
      state.exchangeRateAB =
        action.payload.reserves2 / action.payload.reserves1;
      state.exchangeRateBA =
        action.payload.reserves1 / action.payload.reserves2;
    },
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
    getSymbolPairs: (state, action) => {
      state.symbolPairs = action.payload;
    },
    refreshDataSwap: (state) => {
      state.amountsIn = "";
      state.amountsOut = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPairsFee.pending, (state, action) => {
        state.loadingFee = true;
      })
      .addCase(getPairsFee.fulfilled, (state, action) => {
        state.loadingFee = false;
        state.pairFee = action.payload;
      })
      .addCase(getPairsFee.rejected, (state, action) => {
        state.loadingFee = false;
      })
      .addCase(getAmountsOut.pending, (state, action) => {
        state.loadingGetAmountOut = true;
      })
      .addCase(getAmountsOut.fulfilled, (state, action) => {
        state.loadingGetAmountOut = false;
        state.amountsIn = action.payload.inputAmountIn;
        state.amountsOut = action.payload.amountsOutFormat;
      })
      .addCase(getAmountsOut.rejected, (state, action) => {
        state.loadingGetAmountOut = false;
      })
      .addCase(getAmountsIn.pending, (state, action) => {
        state.loadingGetAmountIn = true;
      })
      .addCase(getAmountsIn.fulfilled, (state, action) => {
        state.loadingGetAmountIn = false;
        state.amountsIn = action.payload.amountsInFormat;
        state.amountsOut = action.payload.inputAmountOut;
      })
      .addCase(getAmountsIn.rejected, (state, action) => {
        state.loadingGetAmountIn = false;
      })
      .addCase(checkApproveToken.fulfilled, (state, action) => {
        state.accountApprove = action.payload.accountApprove;
        state.contractSwap = action.payload.contractSwap;
      })
      .addCase(onApproveTokenForAccount.fulfilled, (state, action) => {
        state.accountApprove = action.payload;
      })
      .addCase(checkAssetExistsPools.fulfilled, (state, action) => {
        state.poolAddress = action.payload;
      })
      // .addCase(swapAsset.fulfilled, (state) => {
      //   state.amountsIn = "";
      //   state.amountsOut = "";
      // });
  },
});

export default swapAssetSlice.reducer;

export const {
  swapTokenDesire,
  openModalSelectToken,
  closeModalSelectToken,
  selectSourceTokenFromModal,
  selectDesireTokenFromModal,
  getSymbolPairs,
  countExchangeRate,
  updateStatusSwap,
  refreshDataSwap,
} = swapAssetSlice.actions;

export const selectSourceToken = (state) => state.swapAsset.sourceTokenAddress;
export const selectDesireToken = (state) => state.swapAsset.desireTokenAddress;
export const selectNameTokenState = (state) => state.swapAsset.nameToken;
export const selectOpenChooseTokenState = (state) =>
  state.swapAsset.isModalSelectTokenOpen;
export const selectSymbolPairs = (state) => state.swapAsset.symbolPairs;
export const selectExchangeRate = (state) => state.swapAsset.exchangeRateAB;
export const selectIsSwap = (state) => state.swapAsset.isSwap;
export const selectLoadingFee = (state) => state.swapAsset.loadingFee;
export const selectPairsFee = (state) => state.swapAsset.pairFee;
export const selectLoadingGetAmountOut = (state) =>
  state.swapAsset.loadingGetAmountOut;
export const selectAmountsOut = (state) => state.swapAsset.amountsOut;
export const selectLoadingGetAmountIn = (state) =>
  state.swapAsset.loadingGetAmountIn;
export const selectAmountsIn = (state) => state.swapAsset.amountsIn;
export const selectAccountApprove = (state) => state.swapAsset.accountApprove;

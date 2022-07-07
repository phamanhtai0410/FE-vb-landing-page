import { createSlice } from "@reduxjs/toolkit";
import {
  approvePoolLiquidity,
  loadDetailRemoveLiquidity,
  removeLiquidity,
} from "../actions";

const initialState = {
  poolApproval: 0,
  amountTokenA: 0,
  amountTokenB: 0,
  liquidityPool: 0,

  addressTokenA: "",
  addressTokenB: "",

  isApproving: false,
  isRemoving: false,
  isRemoveSuccess: null,
};

const removeLiquiditySlice = createSlice({
  name: "removeLiquidity",
  initialState,
  reducers: {
    initialRemoveLiquidityPage: (state, action) => {
      const { poolAddress, addressTokenA, addressTokenB } = action.payload;
      state.poolAddress = poolAddress;
      state.addressTokenA = addressTokenA;
      state.addressTokenB = addressTokenB;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(approvePoolLiquidity.pending, (state, _) => {
        state.isApproving = true;
      })
      .addCase(approvePoolLiquidity.fulfilled, (state, action) => {
        state.isApproving = false;
        state.poolApproval = action.payload.approvePool;
      })
      .addCase(approvePoolLiquidity.rejected, (state, _) => {
        state.isApproving = false;
      })
      .addCase(loadDetailRemoveLiquidity.fulfilled, (state, action) => {
        state.addressTokenA = action.payload.addressTokenA;
        state.addressTokenB = action.payload.addressTokenB;
        state.poolApproval = action.payload.approvePool;
        state.amountTokenA = action.payload.amountTokenA;
        state.amountTokenB = action.payload.amountTokenB;
        state.liquidityPool = action.payload.liquidityPool;
        state.abExchangeRate = action.payload.abExchangeRate;
        state.baExchangeRate = action.payload.baExchangeRate;
      })
      .addCase(removeLiquidity.pending, (state, _) => {
        state.isRemoving = true;
      })
      .addCase(removeLiquidity.fulfilled, (state, _) => {
        state.isRemoving = false;
        state.isRemoveSuccess = true;
      })
      .addCase(removeLiquidity.rejected, (state, _) => {
        state.isRemoving = false;
        state.isRemoveSuccess = false;
      });
  },
});

export default removeLiquiditySlice.reducer;

export const selectApprovingState = (state) =>
  state.removeLiquidity.isApproving;
export const selectRemovingState = (state) => state.removeLiquidity.isRemoving;
export const selectRemovingFinishState = (state) =>
  state.removeLiquidity.isRemoveSuccess;

export const selectPoolApproval = (state) => state.removeLiquidity.poolApproval;
export const selectAddressTokenA = (state) =>
  state.removeLiquidity.addressTokenA;
export const selectAddressTokenB = (state) =>
  state.removeLiquidity.addressTokenB;
export const selectAmountTokenA = (state) => state.removeLiquidity.amountTokenA;
export const selectAmountTokenB = (state) => state.removeLiquidity.amountTokenB;
export const selectLiquidityPool = (state) =>
  state.removeLiquidity.liquidityPool;
export const selectFirstTokenExchangeRate = (state) =>
  state.removeLiquidity.abExchangeRate;
export const selectSecondTokenExchangeRate = (state) =>
  state.removeLiquidity.baExchangeRate;

export const { initialRemoveLiquidityPage } = removeLiquiditySlice.actions;

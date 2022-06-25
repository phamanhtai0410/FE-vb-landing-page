import { createSlice } from "@reduxjs/toolkit";
import {
  approvePoolLiquidity,
  loadDetailRemoveLiquidity,
  removeLiquidity,
} from "../actions";

const initialState = {
  poolApproval: 0,

  isApproving: false,
  isRemoving: false,
  isRemoveSuccess: null,
};

const removeLiquiditySlice = createSlice({
  name: "removeLiquidity",
  initialState,
  reducers: {
    initialRemoveLiquidityPage: (state, action) => {
    console.log('🐶🐶  ~ action', action)
    const {poolAddress, addressTokenA, addressTokenB} = action.payload;
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
        const { approvePool, ...amounts } = action.payload;
        state.poolApproval = approvePool;
        state = { ...state, ...amounts };
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

export const { initialRemoveLiquidityPage } = removeLiquiditySlice.actions;

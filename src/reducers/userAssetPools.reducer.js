import { createSelector, createSlice } from "@reduxjs/toolkit";
import { shallowEqual } from "react-redux";

const initialState = {
  addresses: [],
  data: {},
};

const userAssetPools = createSlice({
  name: "userAssetPools",
  initialState,
  reducers: {
    updateLiquidityPool: (state, action) => {
      const { poolAddress, liquidityPool } = action.payload;
      if (poolAddress && liquidityPool) {
        state.data[poolAddress] = liquidityPool;
      }
    },
    updateUserAssets: (state, action) => {
      const { assetsPoolAddress, liquidityPool, amountTokenA, amountTokenB } =
        action.payload;
      if (!state.addresses.includes(assetsPoolAddress)) {
        state.addresses.push(assetsPoolAddress);
      }
      state.data[assetsPoolAddress] = {
        ...state.data[assetsPoolAddress],
        liquidityPool,
        amountTokenA,
        amountTokenB,
      };
    },
  },
});

export default userAssetPools.reducer;

export const { updateLiquidityPool, updateUserAssets } = userAssetPools.actions;

export const selectAllAddresses = (state) => state.userAssetPools.addresses;
export const selectAllPoolBalance = (state) => state.userAssetPools.data;

const _selectUsersAddedPoolAddresses = createSelector(
  [selectAllAddresses, selectAllPoolBalance],
  (addressList, data) =>
    addressList.filter((address) => data[address]?.liquidityPool > 0),
  {
    equalityCheck: (prev, next) => prev.length === next.length,
  }
);

export const selectUsersAddedPoolAddresses = state => _selectUsersAddedPoolAddresses(state);

export const selectUserPoolAssetByPoolAddress = (state, poolAddress) =>
  state.userAssetPools.data[poolAddress];
export const selectUserLiquidityPoolByPoolAddress = (state, poolAddress) =>
  state.userAssetPools.data[poolAddress]?.liquidityPool;
export const selectUserAmountAByPoolAddress = (state, poolAddress) =>
  state.userAssetPools.data[poolAddress]?.amountTokenA;
export const selectUserAmountBByPoolAddress = (state, poolAddress) =>
  state.userAssetPools.data[poolAddress]?.amountTokenB;

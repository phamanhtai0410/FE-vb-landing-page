import { createSlice } from "@reduxjs/toolkit";

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

export const selectUsersAddedPoolAddresses = (state) => {
  const entities = state.userAssetPools.data;
  return state.userAssetPools.addresses.filter(
    (address) => entities[address].liquidityPool > 0
  );
};
export const selectUserPoolAssetByPoolAddress = (state, poolAddress) =>
  state.userAssetPools.data[poolAddress];
export const selectUserLiquidityPoolByPoolAddress = (state, poolAddress) =>
  state.userAssetPools.data[poolAddress]?.liquidityPool;
export const selectUserAmountAByPoolAddress = (state, poolAddress) =>
  state.userAssetPools.data[poolAddress]?.amountTokenA;
export const selectUserAmountBByPoolAddress = (state, poolAddress) =>
  state.userAssetPools.data[poolAddress]?.amountTokenB;

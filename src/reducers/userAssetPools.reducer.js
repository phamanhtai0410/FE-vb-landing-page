import { createSlice } from "@reduxjs/toolkit";
import { poolConstants } from "../constants";

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
  },
  extraReducers: (builder) => {
    builder.addCase(
      poolConstants.FETCH_POOL_ASSETS_SUCCESS,
      (state, action) => {
        const { data: poolAssetsList } = action;
        for (const poolAsset of poolAssetsList) {
          const {
            assetsPoolAddress,
            balanceAccount,
            amountTokenA,
            amountTokenB,
            addressTokenA,
            addressTokenB,
          } = poolAsset;
          if (!state.addresses.includes(assetsPoolAddress)) {
            state.addresses.push(assetsPoolAddress);
          }
          state.data[assetsPoolAddress] = {
            ...state.data[assetsPoolAddress],
            liquidityPool: balanceAccount,
            [addressTokenA]: amountTokenA || 0,
            [addressTokenB]: amountTokenB || 0,
          };
        }
      }
    );
  },
});

export default userAssetPools.reducer;

export const { updateLiquidityPool } = userAssetPools.actions;

export const selectUsersAddedPoolAddresses = (state) => {
  const entities = state.userAssetPools.data;
  return state.userAssetPools.addresses.filter(
    (address) => entities[address].liquidityPool > 0
  );
};
export const selectUserPoolAssetByPoolAddress = (state, poolAddress) =>
  state.userAssetPools.data[poolAddress];
export const selectUserLiquidityPoolByPoolAddress = (state, poolAddress) =>
  state.userAssetPools.data[poolAddress].liquidityPool;

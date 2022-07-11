import {
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import { instantiateVEUSDContracts } from "../actions";
import { web3Constants } from "../constants";
import { selectListAssets } from "./assetsMarket.reducer";

const initialState = {
  ids: [],
  entities: {},
};

const accountBalanceSlice = createSlice({
  name: "accountBalances",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(web3Constants.INIT_CONTRACT_VB, (state, action) => {
        if (action.contractVB) {
          if (!state.ids.includes(action.contractVB.assetsAddress)) {
            state.ids.push(action.contractVB.options.address);
          }
          if (state?.entities) {
            state.entities[action.contractVB.options.address] = action.balance;
          }
        }
      })
      .addCase(instantiateVEUSDContracts.fulfilled, (state, action) => {
        if (action.payload) {
          const { contractVEUSD, balance } = action.payload;
          if (!state.ids.includes(contractVEUSD.options.address)) {
            state.ids.push(contractVEUSD.options.address);
          }
          if (state?.entities) {
            state.entities[contractVEUSD.options.address] = balance;
          }
        }
      })
      .addCase(web3Constants.INIT_CONTRACT_VET, (state, action) => {
        if (state?.entities) {
          state.entities[process.env.REACT_APP_TOKEN_WVET] = action.balanceVET;
          state.entities[process.env.REACT_APP_TOKEN_VTHO] = action.balanceVTHO;
        }
      });
  },
});

export default accountBalanceSlice.reducer;
export const selectBalancesIds = (state) => state.accountBalances.ids;
export const selectBalanceById = (state, id) =>
  state.accountBalances.entities[id];
const selectAllBalances = (state) => state.accountBalances.entities;
const _selectUserAssetsBalance = createSelector(
  [selectListAssets, selectAllBalances],
  (listAssets, entities) => {
    return listAssets && listAssets.length > 0
      ? listAssets.map((asset) => {
          return {
            ...asset,
            balance: entities?.[asset.assetsAddress] || 0,
          };
        })
      : [];
  }
);
export const selectUserAssetsBalance = (state) =>
  _selectUserAssetsBalance(state);

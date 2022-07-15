import queryString from "query-string";
import { ethers } from "ethers";

import { alertActions } from "./alert.actions";
import { web3Constants, stakeConstants } from "../constants";

import * as actions from ".";

// ------------------------ BORROW ------------------------ //

/**
 *
 * @param {*} dataToken
 * @returns dispatch strore
 *
 */
export const loadModalUnStake = (dataToken) => async (dispatch, getState) => {
  const state = getState();
  const { web3, account } = state.web3;

  const dataPrice = state.assetsPriceReducer.data;
  const { accountSupplyBalance } = state.accountAssetsReducer;

  let accountBalance = 0;
  let accountApprove = 0;
  // let contractBorrow;

  let accountStableDebtApprove = 0;
  let accountVariableDebtApprove = 0;

  dispatch({
    type: stakeConstants.MODAL_OPEN_UNSTAKE,
    accountApprove,
    accountStableDebtApprove,
    accountVariableDebtApprove,
    accountBalance: accountBalance,
    dataToken,
  });
};

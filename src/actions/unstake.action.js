import queryString from "query-string";
import { ethers } from "ethers";

import { alertActions } from "./alert.actions";
import { web3Constants, stakeConstants } from "../constants";

import * as actions from ".";

import ERC20ABI_VB from "../_contracts/VB.json";

import ERC20ABI_AAVE from "../_contracts/AaveProtocolDataProvider.json";
import ERC20ABI_WETH_GETAWAY from "../_contracts/WETHGateway.json";
import ERC20ABI_POOL from "../_contracts/Pool.json";
import ERC20ABI_STABLE_DEBT_TOKEN from "../_contracts/StableDebtToken.json";
import ERC20ABI_VARIBLE_DEBT_TOKEN from "../_contracts/VariableDebtToken.json";

const ADDRESS_GATEWAY = process.env.REACT_APP_ADDRESS_GATEWAY; // WETHGateway (chinh là VET Asset)
const ADDRESS_POOL = process.env.REACT_APP_ADDRESS_POOL;
const TOKEN_AAVE = process.env.REACT_APP_ADDRESS_PROTOCOL;

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

  // if (!account) {
  //     return;
  // }

  // const contractPOOL = new web3.eth.Contract(ERC20ABI_POOL, ADDRESS_POOL);
  //  let contractAAVE = new web3.eth.Contract(ERC20ABI_AAVE, TOKEN_AAVE);

  // const getReserveData = await contractAAVE.methods.getReserveData(dataToken.assetsAddress).call();
  // let balanceTotalSupply = ethers.utils.formatUnits(getReserveData.totalAToken, dataToken.assetsDecimals);
  // accountBalance = Math.round(balanceTotalSupply * 100) / 100;

  // const accountReserve = await contractAAVE.methods.getUserReserveData(dataToken.assetsAddress, account).call();
  // console.log(`getUserReserveData`, accountReserve);

  // const accountData = await contractPOOL.methods.getUserAccountData(account).call();
  // console.log("getUserAccountData", accountData);

  // if (accountData.availableBorrowsBase) {
  //     accountBalance = ethers.utils.formatUnits(accountData.availableBorrowsBase, 18);
  //     accountBalance = accountBalance / dataPrice[dataToken.assetsAddress];
  // }

  // if (dataToken.assetsChain === "VET") {

  //     // check approveDelegation
  //     // let contractStableDebt = new web3.eth.Contract(ERC20ABI_STABLE_DEBT_TOKEN, process.env.REACT_APP_STABLE_DEBT_TOKEN_VET);
  //     // accountStableDebtApprove = await contractStableDebt.methods.borrowAllowance(account, ADDRESS_GATEWAY).call();
  //     // accountStableDebtApprove = ethers.utils.formatEther(accountStableDebtApprove);
  //     // accountStableDebtApprove = Number(accountStableDebtApprove);

  //     // check approveDelegation
  //     let contractVariableDebt = new web3.eth.Contract(ERC20ABI_VARIBLE_DEBT_TOKEN, process.env.REACT_APP_VARIABLE_DEBT_TOKEN_VET);
  //     accountVariableDebtApprove = await contractVariableDebt.methods.borrowAllowance(account, ADDRESS_GATEWAY).call();

  //     accountVariableDebtApprove = ethers.utils.formatEther(accountVariableDebtApprove);
  //     accountVariableDebtApprove = Number(accountVariableDebtApprove);

  //     accountApprove = accountVariableDebtApprove;

  // } else {

  //     const contractBorrow = new web3.eth.Contract(ERC20ABI_VB, dataToken.assetsAddress);

  //     // get the approved ADDRESS_POOL
  //     accountApprove = await contractBorrow.methods.allowance(account, ADDRESS_POOL).call();
  //     accountApprove = ethers.utils.formatUnits(accountApprove, dataToken.assetsDecimals);
  //     accountApprove = Number(accountApprove);

  // }

  dispatch({
    type: stakeConstants.MODAL_OPEN_UNSTAKE,
    accountApprove,
    accountStableDebtApprove,
    accountVariableDebtApprove,
    accountBalance: accountBalance,
    dataToken,
  });
};

import queryString from "query-string";
import { ethers } from "ethers";

import { alertActions } from "./alert.actions";
import {
  web3Constants,
  marketplaceConstants,
  poolConstants,
} from "../constants";

import * as actions from ".";

import ERC20ABI_VB from "../_contracts/VB.json";

import ERC20ABI_AAVE from "../_contracts/AaveProtocolDataProvider.json";
import ERC20ABI_WETH_GETAWAY from "../_contracts/WETHGateway.json";
import ERC20ABI_ROUTER from "../_contracts/router.json";
import ERC20ABI_STABLE_DEBT_TOKEN from "../_contracts/StableDebtToken.json";
import ERC20ABI_VARIBLE_DEBT_TOKEN from "../_contracts/VariableDebtToken.json";
import { createAsyncThunk } from "@reduxjs/toolkit";

const ADDRESS_GATEWAY = process.env.REACT_APP_ADDRESS_GATEWAY; // WETHGateway (chinh là VET Asset)
const ADDRESS_ROUTER = process.env.REACT_APP_ADDRESS_ROUTER;
const TOKEN_AAVE = process.env.REACT_APP_ADDRESS_PROTOCOL;

// ------------------------ BORROW ------------------------ //

/**
 *
 * @param {*} dataToken
 * @returns dispatch strore
 *
 */
export const loadSelectToken = (dataToken) => async (dispatch, getState) => {
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
    type: poolConstants.MODAL_OPEN_SELECT_TOKEN,
    accountApprove,
    accountStableDebtApprove,
    accountVariableDebtApprove,
    accountBalance: accountBalance,
    dataToken,
  });
};

export const selectFirstToken = () => {
  return {
    type: poolConstants.MODAL_OPEN_SELECT_FIRST_TOKEN,
  };
};

export const selectSecondToken = () => {
  return {
    type: poolConstants.MODAL_OPEN_SELECT_SECOND_TOKEN,
  };
};

export const selectToken = (dataToken) => {
  return {
    type: poolConstants.MODAL_SELECT_TOKEN,
    payload: dataToken,
  };
};

export const closeSelectToken = () => {
  return {
    type: poolConstants.MODAL_CLOSE_SELECT_TOKEN,
  };
};

export const addLiquidity = createAsyncThunk(
  poolConstants.ADD_LIQUIDITY,
  async ({ firstAmount, secondAmount }, { getState }) => {
    const { firstToken, secondToken } = getState().liquidReducer;
    const { connex, account, web3 } = getState().web3;

    const addLiquidityABI = ERC20ABI_ROUTER.find(
      ({ name, type }) => name === "addLiquidity" && type === "function"
    );
    const methodAddLiquidity = connex.thor
      .account(ADDRESS_ROUTER)
      .method(addLiquidityABI);

    //   "addLiquidity(
    //     address tokenA,
    //     address tokenB,
    //     uint transactionFee,    // set once per pair
    //     uint amountADesired,
    //     uint amountBDesired,
    //     uint amountAMin,
    //     uint amountBMin,
    //     address to,
    //     uint deadline
    // )"

    const transactionFee = "10000000000000000000";
    const amountAMin = 0;
    const amountBMin = 0;
    const amountA = web3.utils.toWei(firstAmount.toString());
    const amountB = web3.utils.toWei(secondAmount.toString());
    const deadline = Math.round(new Date().getTime() / 1000) + 3600;

    console.log(
      firstToken,
      secondToken,
      transactionFee,
      amountA,
      amountB,
      amountAMin,
      amountBMin,
      account,
      deadline
    );
    methodAddLiquidity
      .transact(
        firstToken,
        secondToken,
        transactionFee,
        amountA,
        amountB,
        amountAMin,
        amountBMin,
        account,
        deadline
      )
      .comment(`transaction add liquidity to VeBank`)
      .request()
      .then((transaction) => {
        console.log('🐶🐶  ~ .then ~ transaction', transaction)
        return transaction;
      })
      .catch((e) => {
        console.log("error----", e);
        // dispatch({
        //   type: marketplaceConstants.MODAL_SUPPLY_MARKET_ERROR,
        // });
        return e;
      });
  }
);

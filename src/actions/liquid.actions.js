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
import { selectAssetByAddress } from "../reducers/assetsMarket.reducer";

const ADDRESS_GATEWAY = process.env.REACT_APP_ADDRESS_GATEWAY; // WETHGateway (chinh là VET Asset)
const ADDRESS_ROUTER = process.env.REACT_APP_ADDRESS_ROUTER;
const TOKEN_AAVE = process.env.REACT_APP_ADDRESS_PROTOCOL;

// ------------------------ BORROW ------------------------ //

export const loadSelectToken = (dataToken) => async (dispatch, getState) => {
  dispatch({
    type: poolConstants.MODAL_OPEN_SELECT_TOKEN,
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

export const approveFirstTokenAddLiquidity = createAsyncThunk(
  poolConstants.APPROVE_FIRST_TOKEN,
  async (tokenAddress, { getState }) => {
    if (!tokenAddress) return;

    const state = getState();

    const { web3, account, connex } = state.web3;

    const contractAddLiquidity = new web3.eth.Contract(
      ERC20ABI_VB,
      tokenAddress
    );

    const tokenInfo = selectAssetByAddress(state, tokenAddress);

    const amountMax = 1_000_000_000;

    if (account && contractAddLiquidity && tokenAddress) {
      const approveABI = {
        constant: false,
        inputs: [
          { name: "_spender", type: "address" },
          { name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "success", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      };
      const approveMethod = connex.thor
        .account(tokenAddress)
        .method(approveABI);

      const result = await approveMethod
        .transact(ADDRESS_ROUTER, web3.utils.toWei(amountMax.toString()))
        .comment(`approve ${tokenInfo.assetsChain} on VeBank`)
        .request();

      return { result, approveTokenA: 1 };
      // .then((result) => {
      //   console.log("🐶🐶  ~ result", result);

      //   return { result, approveTokenA: 1 };
      // })
      // .catch((e) => {
      //   console.log("error----", e);
      //   return e;
      // });
    }
  }
);

export const approveSecondTokenAddLiquidity = createAsyncThunk(
  poolConstants.APPROVE_SECOND_TOKEN,
  async (tokenAddress, { getState }) => {
    if (!tokenAddress) return;

    const state = getState();

    const { web3, account, connex } = state.web3;

    const contractAddLiquidity = new web3.eth.Contract(
      ERC20ABI_VB,
      tokenAddress
    );

    const tokenInfo = selectAssetByAddress(state, tokenAddress);

    const amountMax = 1_000_000_000;

    if (account && contractAddLiquidity && tokenAddress) {
      const approveABI = {
        constant: false,
        inputs: [
          { name: "_spender", type: "address" },
          { name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "success", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      };
      const approveMethod = connex.thor
        .account(tokenAddress)
        .method(approveABI);

      const result = await approveMethod
        .transact(ADDRESS_ROUTER, web3.utils.toWei(amountMax.toString()))
        .comment(`approve ${tokenInfo.assetsChain} on VeBank`)
        .request();

      return { result, approveTokenB: 1 };
    }
  }
);

export const loadDetailAddLiquidity = createAsyncThunk(
  poolConstants.LOAD_DETAIL_ADD_LIQUIDITY,
  async (_, { getState }) => {
    const currentState = getState();
    const { web3, account } = currentState.web3;
    const { firstToken, secondToken } = currentState.liquidReducer;
    let approveTokenA = 0;
    let approveTokenB = 0;
    if (firstToken) {
      const contractAddLiquidityA = new web3.eth.Contract(
        ERC20ABI_VB,
        firstToken
      );

      approveTokenA = await contractAddLiquidityA.methods
        .allowance(account, ADDRESS_ROUTER)
        .call();
      const tokenInfo = selectAssetByAddress(currentState, firstToken);
      approveTokenA = ethers.utils.formatUnits(
        approveTokenA,
        tokenInfo.assetsDecimals
      );
      approveTokenA = Number(approveTokenA);
    }
    if (secondToken) {
      const contractAddLiquidityB = new web3.eth.Contract(
        ERC20ABI_VB,
        secondToken
      );

      approveTokenB = await contractAddLiquidityB.methods
        .allowance(account, ADDRESS_ROUTER)
        .call();
      const tokenInfo = selectAssetByAddress(currentState, secondToken);
      approveTokenB = ethers.utils.formatUnits(
        approveTokenB,
        tokenInfo.assetsDecimals
      );
      approveTokenB = Number(approveTokenB);
    }
    return { approveTokenA, approveTokenB };
  }
);

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

    const min = 1_000_000_000; 
    const transactionFee = 100;
    const amountAMin = 0;
    const amountBMin = 0;
    const amountA = web3.utils.toWei(firstAmount.toString());
    const amountB = web3.utils.toWei(secondAmount.toString());
    const deadline = Math.round(new Date().getTime() / 1000) + 3600;

    console.table(
      [
        ["tokenA",firstToken],
        ["tokenB",secondToken],
        ["transactionFee",transactionFee],
        ["amountA",amountA],
        ["amountB",amountB],
        ["amountAMin",amountAMin],
        ["amountBMin",amountBMin],
        ["account",account],
        ["deadline",deadline]
      ]
    );

    const transaction = await methodAddLiquidity
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
      .request();

    return transaction;
    // .then((transaction) => {
    //   console.log("🐶🐶  ~ .then ~ transaction", transaction);
    //   return transaction;
    // })
    // .catch((e) => {
    //   console.log("error----", e);
    //   // dispatch({
    //   //   type: marketplaceConstants.MODAL_SUPPLY_MARKET_ERROR,
    //   // });
    //   return e;
    // });
  }
);

import { ethers } from "ethers";

import { poolConstants } from "../constants";

import ERC20ABI_VB from "../_contracts/VB.json";

import ERC20ABI_ROUTER from "../_contracts/router.json";
import ERC20ABI_FACTORY from "../_contracts/factory.json";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { selectAssetByAddress } from "../reducers/assetsMarket.reducer";

const ADDRESS_GATEWAY = process.env.REACT_APP_ADDRESS_GATEWAY; // WETHGateway (chinh là VET Asset)
const ADDRESS_ROUTER = process.env.REACT_APP_ADDRESS_ROUTER;
const ADDRESS_FACTORY = process.env.REACT_APP_ADDRESS_FACTORY;

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

    console.log("approveSecondTokenAddLiquidity",tokenAddress ,ADDRESS_ROUTER);

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
        .comment(`approve ${tokenInfo.assetsChain} on Pool router ${ADDRESS_ROUTER}`)
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

    console.log("approveSecondTokenAddLiquidity",tokenAddress ,ADDRESS_ROUTER);
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
        .comment(`approve ${tokenInfo.assetsChain} on Pool router ${ADDRESS_ROUTER}`)
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
      console.log("loadDetailAddLiquidity firstToken",firstToken);
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

      console.log("loadDetailAddLiquidity secondToken",secondToken);

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

    const currentState = getState();
    const { firstToken, secondToken } = currentState.liquidReducer;
    const { connex, account ,web3} = currentState.web3;

    const firstTokenInfo = selectAssetByAddress(currentState, firstToken);
    const secondTokenInfo = selectAssetByAddress(currentState, secondToken);

    let checkAddressPool = false;
    let contractFactory = new web3.eth.Contract(ERC20ABI_FACTORY, ADDRESS_FACTORY);
    if(contractFactory){
      const  addressPair = await contractFactory.methods.getPair(firstToken,secondToken).call();
      checkAddressPool = !/^0x0+$/.test(addressPair);
    }

    const amountA = web3.utils.toWei(firstAmount.toString(),firstTokenInfo?.assetsDecimals ===6 ? 'mwei':'ether');
    const amountB = web3.utils.toWei(secondAmount.toString(),secondTokenInfo?.assetsDecimals ===6 ? 'mwei':'ether');

    const transactionFee = "50";
    const amountAMin = checkAddressPool === false? amountA: "0";
    const amountBMin = checkAddressPool === false? amountB: "0";
    const deadline = Math.round(new Date().getTime() / 1000) + 3600;

    console.table([
      ["tokenA", firstToken],
      ["tokenB", secondToken],
      ["transactionFee", transactionFee],
      ["amountA", amountA],
      ["amountB", amountB],
      ["amountAMin", amountAMin],
      ["amountBMin", amountBMin],
      ["account", account],
      ["deadline", deadline],
    ]);

    let transaction;

    if(firstToken === process.env.REACT_APP_TOKEN_WVET || secondToken === process.env.REACT_APP_TOKEN_WVET){

      const addLiquidityETHABI = ERC20ABI_ROUTER.find( ({ name, type }) => name === "addLiquidityETH" && type === "function");
      const methodAddLiquidityETH = connex.thor.account(ADDRESS_ROUTER).method(addLiquidityETHABI);

      let tokenDesired;
      if(firstToken === process.env.REACT_APP_TOKEN_WVET){
        tokenDesired = {
          address: secondToken,
          amountTokenDesired: amountB,
          amountTokenMin:amountBMin,
          amountETHMin: amountA
        }
      }else {
        tokenDesired = {
          address: firstToken,
          amountTokenDesired: amountA,
          amountTokenMin:amountAMin,
          amountETHMin: amountB
        }
      }

    transaction = await methodAddLiquidityETH.transact(
      tokenDesired.address,
      transactionFee,
      tokenDesired.amountTokenDesired,
      tokenDesired.amountTokenMin,
      tokenDesired.amountETHMin,
      account,
      deadline
    ).comment(`transaction add LiquidityETH on VeBank`).request();

    }else{

      const addLiquidityABI = ERC20ABI_ROUTER.find(  ({ name, type }) => name === "addLiquidity" && type === "function");
      const methodAddLiquidity = connex.thor.account(ADDRESS_ROUTER).method(addLiquidityABI);

      transaction = await methodAddLiquidity.transact(
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
      .comment(`transaction add pool ${firstTokenInfo.assetsChain}-${secondTokenInfo.assetsChain} to VeBank`)
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

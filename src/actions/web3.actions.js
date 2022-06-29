import { ethers } from "@vechain/ethers";
import Connex from "@vechain/connex";

// import { Certificate, blake2b256, secp256k1 } from "thor-devkit";

import {
  web3Constants,
} from "../constants";
import getWeb3 from "../utils/getWeb3";

import ERC20ABI_VB from "../_contracts/assets/VB.json";

import * as actions from "./";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { selectAssetByAddress } from "../reducers/assetsMarket.reducer";

// VET : dung de staking duy tri he thong
// VTH0 : dung de tra vi chay smart Contract

const TOKEN_VEBANK = process.env.REACT_APP_TOKEN_VEBANK;
const TOKEN_VEUSD = process.env.REACT_APP_TOKEN_VEUSD;

export const web3Connect = (isLogin) => async (dispatch) => {
  const web3 = await getWeb3();

  let _acc = localStorage.getItem("_acc");
  let _sign = localStorage.getItem("_sign");

  const connex = new Connex({
    node: process.env.REACT_APP_CHAIN_NETWORK,
    network: process.env.REACT_APP_NAME_NETWORK,
  });

  if (_acc && _sign) {
    // console.log("_acc && _sign");
    dispatch({
      type: web3Constants.WEB3_CONNECT,
      web3,
      connex,
      signer: JSON.parse(_sign),
      account: _acc,
    });

    return _acc;
  }

  if (!_acc && isLogin) {
    // Ask user to sign the agreement
    connex.vendor
      .sign("cert", {
        purpose: "agreement",
        payload: {
          type: "text",
          content: "agreement",
        },
      })
      .request()
      .then((signer) => {
        _acc = signer.annex.signer;
        _sign = JSON.stringify(signer);

        localStorage.setItem("_acc", _acc);
        localStorage.setItem("_sign", _sign);

        dispatch({
          type: web3Constants.WEB3_CONNECT,
          connex,
          web3,
          signer,
          account: _acc,
        });

        return _acc;
      });
  }

  dispatch({
    type: web3Constants.WEB3_CONNECT, 
    web3,
    connex
  });

  return _acc;

};

export const web3Disconnect = () => async (dispatch, getState) => {
  
  // const state = getState();
  // const { web3 } = state.web3;

  localStorage.removeItem("_acc");
  localStorage.removeItem("_sign");

  dispatch({
    type: web3Constants.WEB3_DISCONNECT,
    connex: null,
    web3: null,
    account: null,
  });

  dispatch(actions.getAccountAssets());

  // setTimeout(() => {
  //     dispatch({ type: destroyConstants.DESTROY_SESSION });
  // }, 1000);
};

export const instantiateVetContracts = () => async (dispatch, getState) => {
  const state = getState();

  const { connex, account } = state.web3;

  if (account) {
    const accInfo = await connex.thor.account(account).get();

    let balanceVET = 0;
    let balanceVTHO = 0;

    if (accInfo && accInfo.balance && accInfo.energy) {
      balanceVET = ethers.utils.formatEther(accInfo.balance);
      balanceVET = Math.round(balanceVET * 100) / 100;

      balanceVTHO = ethers.utils.formatEther(accInfo.energy);
      balanceVTHO = Math.round(balanceVTHO * 100) / 100;
    }

    dispatch({
      type: web3Constants.INIT_CONTRACT_VET,
      accInfo,
      balanceVET,
      balanceVTHO,
    });

    return accInfo;
  }

  dispatch({
    type: web3Constants.INIT_CONTRACT_VET,
    balanceVET: 0,
    balanceVTHO: 0,
  });
};

export const instantiateVBContracts = () => async (dispatch, getState) => {
  const state = getState();

  const { web3, account } = state.web3;

  if (web3 && account) {
    let contractVB = new web3.eth.Contract(ERC20ABI_VB, TOKEN_VEBANK);

    let balance = 0;

    if (contractVB && account) {
      const balanceBigN = await contractVB.methods.balanceOf(account).call();
      balance = ethers.utils.formatEther(balanceBigN);
      balance = Math.round(balance * 100) / 100;
    }

    dispatch({
      type: web3Constants.INIT_CONTRACT_VB,
      contractVB,
      balance,
    });

    return balance;
  }

  dispatch({
    type: web3Constants.INIT_CONTRACT_VB,
    contractVB: null,
    balance: 0,
  });
};

export const instantiateVEUSDContracts = createAsyncThunk(
  "accountBalance/fetchVEUSD",
  async (_, { getState }) => {
    const currentState = getState();
    const { web3, account } = currentState.web3;

    if (web3 && account) {
      let contractVEUSD = new web3.eth.Contract(ERC20ABI_VB, TOKEN_VEUSD);

      let balance = 0;

      const tokenInfo = selectAssetByAddress(currentState, TOKEN_VEUSD)

      if (contractVEUSD && account) {
        const balanceBigN = await contractVEUSD.methods.balanceOf(account).call();
        balance = ethers.utils.formatUnits(balanceBigN, tokenInfo?.assetsDecimals || 6);
        balance = Math.round(balance * 100) / 100;
      }
      return {balance, contractVEUSD};
    }
  }
);


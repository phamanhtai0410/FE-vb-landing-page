import queryString from "query-string";
import { ethers } from "ethers";

import { alertActions } from "./alert.actions";
import {
  poolConstants,
} from "../constants";

import * as actions from ".";

import ERC20ABI_PAIR from "../_contracts/pair.json";

import ERC20ABI_FACTORY from "../_contracts/factory.json";

const ADDRESS_FACTORY = process.env.REACT_APP_ADDRESS_FACTORY;

// ------------------------ POOL ------------------------ //

export const getPoolAssets = () => async (dispatch, getState) => {

  const state = getState();

  const { web3 } = state.web3;
  const { listAsset ,data} = state.assetsPoolReducer;

  let dataList = [];
  let dataAssets = data.length === 0 ? listAsset : data;

  if (web3 && ADDRESS_FACTORY && dataAssets.length > 0) {

      let contractFactory = new web3.eth.Contract(ERC20ABI_FACTORY, ADDRESS_FACTORY);

      for await (const item of dataAssets) {

        //"getPair(address tokenA, address tokenB),
        const assetsPoolAddress = await contractFactory.methods.getPair(item.addressTokenA,item.addressTokenB).call();
        const emptyAddress = /^0x0+$/.test(assetsPoolAddress); // true chưa có

        if(!emptyAddress && assetsPoolAddress){

          let assetsDecimals = 18;
          if(item.addressTokenA === process.env.REACT_APP_TOKEN_VEUSD || item.addressTokenB === process.env.REACT_APP_TOKEN_VEUSD){
            assetsDecimals  = 12;
          }

          const contractPair = new web3.eth.Contract(ERC20ABI_PAIR, assetsPoolAddress);

          //Lấy tổng liquidity
          let totalSupply = await contractPair.methods.totalSupply().call();
          if(totalSupply){
            totalSupply = ethers.utils.formatUnits(totalSupply,assetsDecimals);
          }

          dataList.push({
            ...item,
            liquidity:totalSupply,
            assetsPoolAddress
          });

        }

      }

      dispatch({
          type: poolConstants.FETCH_POOL_ASSETS_SUCCESS,
          contractFactory,
          data: dataList
      });

      dispatch(getPoolAssetsByAccount(dataList));

  } else {
      dispatch({
          type: poolConstants.FETCH_POOL_ASSETS_SUCCESS,
          data:[]
      });
  }

  return dataList;

};

export const getPoolAssetsByAccount = (dataAssetPool) => async (dispatch, getState) => {

  const state = getState();

  const { web3 ,account} = state.web3;

  let dataList = [];

  if (web3 && ADDRESS_FACTORY && dataAssetPool.length > 0) {

      for await (const item of dataAssetPool) {

        let assetsDecimals = 18;
        if(item.addressTokenA === process.env.REACT_APP_TOKEN_VEUSD || item.addressTokenB === process.env.REACT_APP_TOKEN_VEUSD){
          assetsDecimals  = 12;
        }

        let balanceAccount = 0;
        let amountTokenA = 0;
        let amountTokenB = 0;

        if(item.assetsPoolAddress && account){

            const contractPair = new web3.eth.Contract(ERC20ABI_PAIR, item.assetsPoolAddress);

            //Lấy số lượng LP đang nắm giữ của account
            const balanceBigN = await contractPair.methods.balanceOf(account).call();
            if(balanceBigN){
              balanceAccount = ethers.utils.formatUnits(balanceBigN,assetsDecimals);
            }

            // balanceAccount = ethers.utils.formatUnits(balanceAccount,assetsDecimals);

            //Lấy tokenA nắm giữ của account
            amountTokenA = await contractPair.methods.providerAssets(account,item.addressTokenA).call();
            console.log('🐶🐶  ~ forawait ~ amountTokenA', amountTokenA)
            if(amountTokenA){
              amountTokenA = ethers.utils.formatUnits(amountTokenA, process.env.REACT_APP_TOKEN_VEUSD === item.addressTokenA ? 6: 18);
            }

            //Lấy tokenA nắm giữ của account
            amountTokenB = await contractPair.methods.providerAssets(account,item.addressTokenB).call();
            if(amountTokenB){
              amountTokenB = ethers.utils.formatUnits(amountTokenB, process.env.REACT_APP_TOKEN_VEUSD === item.addressTokenB ? 6:18);
            }

          dataList.push({
            ...item,
            balanceAccount,
            amountTokenA,
            amountTokenB
          });

        }

      }

      dispatch({
          type: poolConstants.FETCH_POOL_ASSETS_SUCCESS,
          data: dataList
      });

  }

  return dataList;

};

/**
 *
 * @param {*} dataToken
 * @returns dispatch strore
 *
 */
export const loadModalAddLiquidity =
  (dataToken) => async (dispatch, getState) => {

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
      type: poolConstants.MODAL_OPEN_ADD_LIQUIDITY,
      accountApprove,
      accountStableDebtApprove,
      accountVariableDebtApprove,
      accountBalance: accountBalance,
      dataToken,
    });
};

export const loadModalRemoveLiquidity =
  (dataToken) => async (dispatch, getState) => {
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
      type: poolConstants.MODAL_OPEN_REMOVE_LIQUIDITY,
      accountApprove,
      accountStableDebtApprove,
      accountVariableDebtApprove,
      accountBalance: accountBalance,
      dataToken,
    });
};

export const closeAddLiquidity = () => {
  return {
    type: poolConstants.MODAL_CLOSE_ADD_LIQUIDITY,
  };
};

export const closeRemoveLiquidity = () => {
  return {
    type: poolConstants.MODAL_CLOSE_REMOVE_LIQUIDITY,
  };
};

import { ethers } from "ethers";

import { poolConstants } from "../constants";

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

          const getReserves = await contractPair.methods.getReserves().call();
          console.log("getReserves", getReserves);

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

  if (account && ADDRESS_FACTORY && dataAssetPool.length > 0) {

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

import { ethers } from "ethers";

import { poolConstants } from "../constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import ERC20ABI_VB from "../_contracts/assets/VB.json";
import ERC20ABI_ROUTER from "../_contracts/router.json";
import { selectPoolInfoByAddress } from "../reducers/assetsPool.reducer";
import {
  getDecimalForAsset,
  getDecimalForAssetPair,
  isContainVET,
} from "../utils/lib";
import ERC20ABI_PAIR from "../_contracts/pair.json";
import { selectLiquidityPool } from "../reducers/removeLiquidity.reducer";
import { selectAssetAbiByAssetAddress } from "../reducers/web3.reducer";
import assetAbi from "../_contracts/asset-abi";

const ADDRESS_ROUTER = process.env.REACT_APP_ADDRESS_ROUTER;

export const loadDetailRemoveLiquidity = createAsyncThunk(
  poolConstants.LOAD_DETAIL_REMOVE_LIQUIDITY,
  async (poolAddress, { getState }) => {
    const currentState = getState();
    const { web3, account } = currentState.web3;
    let approvePool = 0;

    let balanceAccount = 0;
    let amountTokenA = 0;
    let amountTokenB = 0;

    let addressTokenA = "";
    let addressTokenB = "";

    if (poolAddress && account) {

      // const poolInfo = selectPoolInfoByAddress(currentState, poolAddress);
      // const poolInfo = selectPoolInfoByAddress(
      //   currentState,
      //   poolAddress
      // );

      const contractPair = new web3.eth.Contract(ERC20ABI_PAIR, poolAddress);
      addressTokenA = await contractPair.methods.token0().call();
      addressTokenB = await contractPair.methods.token1().call();
      const balanceBigN = await contractPair.methods.balanceOf(account).call();

      balanceAccount = ethers.utils.formatUnits(
        balanceBigN,
        getDecimalForAssetPair(addressTokenA, addressTokenB)
      );
      // balanceAccount = ethers.utils.formatUnits(balanceAccount,assetsDecimals);

      //Lấy tokenA nắm giữ của account
      try {

        amountTokenA = await contractPair.methods.providerAssets(account, addressTokenA).call();
        if (amountTokenA) {
          amountTokenA = ethers.utils.formatUnits(
            amountTokenA,
            process.env.REACT_APP_TOKEN_VEUSD === addressTokenA ? 6 : 18
          );
        }

      } catch (e) {
        console.error(e);
      }

      //Lấy tokenB nắm giữ của account
      try {
        amountTokenB = await contractPair.methods
          .providerAssets(account, addressTokenB)
          .call();
        if (amountTokenB) {
          amountTokenB = ethers.utils.formatUnits(
            amountTokenB,
            process.env.REACT_APP_TOKEN_VEUSD === addressTokenB ? 6 : 18
          );
        }
      } catch (e) {
        console.error(e);
      }

      approvePool = await contractPair.methods.allowance(account, ADDRESS_ROUTER).call();

      const poolInfo = selectPoolInfoByAddress(currentState, poolAddress);
      approvePool = ethers.utils.formatUnits(
        approvePool,
        poolInfo?.assetsDecimals
      );
      approvePool = Number(approvePool);
    }
    return {
      addressTokenA,
      addressTokenB,

      approvePool,
      amountTokenA,
      amountTokenB,
      liquidityPool: balanceAccount,
    };
  }
);

export const approvePoolLiquidity = createAsyncThunk(
  poolConstants.APPROVE_POOL_ADDRESS,
  async (
    { poolAddress, addressTokenA, addressTokenB, tokenAInfo, tokenBInfo },
    { getState }
  ) => {

    if (!poolAddress) return;

    const state = getState();

    const { web3, account, connex } = state.web3;

    const contractAddLiquidity = new web3.eth.Contract(
      ERC20ABI_VB,
      poolAddress
    );

    const poolInfo = selectPoolInfoByAddress(state, poolAddress);

    const amountMax = 1_000_000_000;

    // if (account && addressTokenA) {

    //   const approveABI = assetAbi[addressTokenA].find(
    //     ({ name, type }) => name === "approve" && type === "function"
    //   );
    //   console.log('🐶🐶  ~ approveABI', approveABI)

    //   const approveMethod = connex.thor
    //     .account(addressTokenA)
    //     .method(approveABI);

    //   const result = await approveMethod
    //     .transact(ADDRESS_ROUTER, web3.utils.toWei(amountMax.toString()))
    //     .comment(
    //       `approve ${tokenAInfo.assetsChain} on Pool router ${ADDRESS_ROUTER}`
    //     )
    //     .request();
    // }

    // if (account && addressTokenB) {

    //   const approveABI = assetAbi[addressTokenB].find(
    //     ({ name, type }) => name === "approve" && type === "function"
    //   );

    //   const approveMethod = connex.thor
    //     .account(addressTokenB)
    //     .method(approveABI);

    //   const result = await approveMethod
    //     .transact(ADDRESS_ROUTER, web3.utils.toWei(amountMax.toString()))
    //     .comment(
    //       `approve ${tokenBInfo.assetsChain} on Pool router ${ADDRESS_ROUTER}`
    //     )
    //     .request();
    // }

    if (account && contractAddLiquidity && poolAddress) {

      const approveABI = ERC20ABI_PAIR.find(
        ({ name, type }) => name === "approve" && type === "function"
      );

      const approveMethod = connex.thor.account(poolAddress).method(approveABI);

      const result = await approveMethod
        .transact(ADDRESS_ROUTER, web3.utils.toWei(amountMax.toString()))
        .comment(`approve ${poolInfo?.assetsPoolName} on VeBank`)
        .request();

      return { result, approvePool: 1 };

    }


  }
);

export const removeLiquidity = createAsyncThunk(
  poolConstants.REMOVE_LIQUIDITY,
  async (
    { amount, amountTokenA, amountTokenB, tokenAInfo, tokenBInfo },
    { getState }
  ) => {
    const currentState = getState();

    const { connex, account, web3 } = currentState.web3;

    const assetsPoolName = `${tokenAInfo?.assetsChain} - ${tokenBInfo?.assetsChain}`;

    const addressTokenA = tokenAInfo?.assetsAddress || "";
    const addressTokenB = tokenBInfo?.assetsAddress || "";
    const liquidityPool = selectLiquidityPool(currentState);

    const isPairContainVET = isContainVET(addressTokenA, addressTokenB);
    const functionName = isPairContainVET
      ? "removeLiquidityETH"
      : "removeLiquidity";

    const removeLiquidityABI = ERC20ABI_ROUTER.find(
      ({ name, type }) => name === functionName && type === "function"
    );
    const methodRemoveLiquidity = connex.thor
      .account(ADDRESS_ROUTER)
      .method(removeLiquidityABI);

    // "removeLiquidity(
    //     address tokenA,
    //     address tokenB,
    //     uint liquidity,
    //     uint amountAMin,
    //     uint amountBMin,
    //     address to,
    //     uint deadline
    // )"

    console.log("liquidityPool",liquidityPool);
      
    const amountAMin = web3.utils.toWei(
      amountTokenA.toString(),
      getDecimalForAsset(addressTokenA) === 6 ? "mwei" : "ether"
    );

    const amountBMin = web3.utils.toWei(
      amountTokenB.toString(),
      getDecimalForAsset(addressTokenB) === 6 ? "mwei" : "ether"
    );

    const deadline = Math.round(new Date().getTime() / 1000) + 3600;

    const removeAmount = web3.utils.toWei(((liquidityPool * amount) / 100.0).toString(),
      getDecimalForAssetPair(addressTokenA, addressTokenB) === 12
        ? "micro"
        : "ether"
    );

    let transaction;
    if (isPairContainVET) {
      const assetDesired =
        addressTokenA === process.env.REACT_APP_TOKEN_WVET
          ? {
              address: addressTokenB,
              amountTokenMin: amountBMin,
              amountETHMin: amountAMin,
            }
          : {
              address: addressTokenA,
              amountTokenMin: amountAMin,
              amountETHMin: amountBMin,
            };

     // methodRemoveLiquidity.value(assetDesired.amountETHMin);

      // console.log(
      //   assetDesired.address,
      //   removeAmount,
      //   assetDesired.amountTokenMin,
      //   assetDesired.amountETHMin,
      //   account,
      //   deadline
      // );

      transaction = await methodRemoveLiquidity
        .transact(
          assetDesired.address,
          removeAmount,
          "0",
          "0",
          account,
          deadline
        )
        .comment(`transaction remove pool ${assetsPoolName} from VeBank`)
        .request();

    } else {

      transaction = await methodRemoveLiquidity
        .transact(
          addressTokenA,
          addressTokenB,
          removeAmount,
          "0",
          "0",
          account,
          deadline
        )
        .comment(`transaction remove pool ${assetsPoolName} from VeBank`)
        .request();
    }
    return transaction;

  }
);

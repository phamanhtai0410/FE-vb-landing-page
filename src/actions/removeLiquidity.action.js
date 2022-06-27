import { ethers } from "ethers";

import { poolConstants } from "../constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { selectAssetByAddress } from "../reducers/assetsMarket.reducer";
import ERC20ABI_VB from "../_contracts/VB.json";
import ERC20ABI_ROUTER from "../_contracts/router.json";
import { selectPoolInfoByAddress } from "../reducers/assetsPool.reducer";
import { selectUserLiquidityPoolByPoolAddress } from "../reducers/userAssetPools.reducer";
import { getDecimalForAssetPair, isContainVET } from "../utils/lib";
import ERC20ABI_PAIR from "../_contracts/pair.json";

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

    if (poolAddress && account) {
      const contractRemoveLiquidity = new web3.eth.Contract(
        ERC20ABI_VB,
        poolAddress
      );

      // const poolInfo = selectPoolInfoByAddress(currentState, poolAddress);
      // const poolInfo = selectPoolInfoByAddress(
      //   currentState,
      //   poolAddress
      // );

      const contractPair = new web3.eth.Contract(ERC20ABI_PAIR, poolAddress);
      const addressTokenA = await contractPair.methods.token0().call();
      const addressTokenB = await contractPair.methods.token1().call();
      const balanceBigN = await contractPair.methods.balanceOf(account).call();
      balanceAccount = ethers.utils.formatUnits(
        balanceBigN,
        getDecimalForAssetPair()
      );
      // balanceAccount = ethers.utils.formatUnits(balanceAccount,assetsDecimals);

      //Lấy tokenA nắm giữ của account
      try {
        amountTokenA = await contractPair.methods
          .providerAssets(account, addressTokenA)
          .call();
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

      approvePool = await contractRemoveLiquidity.methods
        .allowance(account, ADDRESS_ROUTER)
        .call();
      const poolInfo = selectPoolInfoByAddress(currentState, poolAddress);
      approvePool = ethers.utils.formatUnits(
        approvePool,
        poolInfo?.assetsDecimals
      );
      approvePool = Number(approvePool);
    }
    return {
      approvePool,
      amountTokenA,
      amountTokenB,
      liquidityPool: balanceAccount,
    };
  }
);

export const approvePoolLiquidity = createAsyncThunk(
  poolConstants.APPROVE_POOL_ADDRESS,
  async (poolAddress, { getState }) => {
    if (!poolAddress) return;

    const state = getState();

    const { web3, account, connex } = state.web3;

    const contractAddLiquidity = new web3.eth.Contract(
      ERC20ABI_VB,
      poolAddress
    );

    const poolInfo = selectPoolInfoByAddress(state, poolAddress);

    const amountMax = 1_000_000_000;

    if (account && contractAddLiquidity && poolAddress) {
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

      const approveMethod = connex.thor.account(poolAddress).method(approveABI);

      const result = await approveMethod
        .transact(ADDRESS_ROUTER, web3.utils.toWei(amountMax.toString()))
        .comment(`approve ${poolInfo?.assetsPoolName} on VeBank`)
        .request();

      return { result, approvePool: 1 };
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

export const removeLiquidity = createAsyncThunk(
  poolConstants.REMOVE_LIQUIDITY,
  async ({ amount, poolAddress }, { getState }) => {
    const currentState = getState();

    const { connex, account } = currentState.web3;

    const { addressTokenA, addressTokenB, assetsPoolName, assetsDecimals } =
      selectPoolInfoByAddress(currentState, poolAddress);

    const liquidityPool = selectUserLiquidityPoolByPoolAddress(
      currentState,
      poolAddress
    );

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

    const min = 1_000_000_000;
    const amountAMin = 0;
    const amountBMin = 0;
    const deadline = Math.round(new Date().getTime() / 1000) + 3600;
    const removeAmount = ethers.utils.parseUnits(
      ((liquidityPool * amount) / 100).toString(),
      getDecimalForAssetPair(addressTokenA, addressTokenB)
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

      transaction = await methodRemoveLiquidity
        .transact(
          assetDesired.address,
          removeAmount,
          assetDesired.amountTokenMin,
          assetDesired.amountETHMin,
          account,
          deadline
        )
        .comment(`transaction remove pool ${assetsPoolName} from VeBank`)
        .request();
      return transaction;
    } else {
      transaction = await methodRemoveLiquidity
        .transact(
          addressTokenA,
          addressTokenB,
          removeAmount,
          amountAMin,
          amountBMin,
          account,
          deadline
        )
        .comment(`transaction remove pool ${assetsPoolName} from VeBank`)
        .request();
    }
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

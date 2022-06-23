import { ethers } from "ethers";

import { poolConstants } from "../constants";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { selectAssetByAddress } from "../reducers/assetsMarket.reducer";
import ERC20ABI_VB from "../_contracts/VB.json";
import ERC20ABI_ROUTER from "../_contracts/router.json";
import { selectPoolInfoByAddress } from "../reducers/assetsPool.reducer";
import { selectUserLiquidityPoolByPoolAddress } from "../reducers/userAssetPools.reducer";

const ADDRESS_ROUTER = process.env.REACT_APP_ADDRESS_ROUTER;

export const loadDetailRemoveLiquidity = createAsyncThunk(
  poolConstants.LOAD_DETAIL_ADD_LIQUIDITY,
  async (poolAddress, { getState }) => {
    const currentState = getState();
    const { web3, account } = currentState.web3;
    let approvePool = 0;

    if (poolAddress) {
      const contractAddLiquidityB = new web3.eth.Contract(
        ERC20ABI_VB,
        poolAddress
      );

      approvePool = await contractAddLiquidityB.methods
        .allowance(account, ADDRESS_ROUTER)
        .call();
      const poolInfo = selectPoolInfoByAddress(currentState, poolAddress);
      approvePool = ethers.utils.formatUnits(
        approvePool,
        poolInfo?.assetsDecimals
      );
      approvePool = Number(approvePool);
    }
    return { approvePool };
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

    const removeLiquidityABI = ERC20ABI_ROUTER.find(
      ({ name, type }) => name === "removeLiquidity" && type === "function"
    );
    const methodAddLiquidity = connex.thor
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
      (liquidityPool * amount / 100).toString(),
      assetsDecimals
    );

    const transaction = await methodAddLiquidity
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

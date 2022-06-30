import { ethers } from "ethers";

import { swapConstants } from "../constants";

import ERC20ABI_VB from "../_contracts/assets/VB.json";

import ERC20ABI_ROUTER from "../_contracts/router.json";

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDeadline,
  getDecimalForAsset,
  isContainVET,
} from "../utils/lib";

const ADDRESS_GATEWAY = process.env.REACT_APP_ADDRESS_GATEWAY; // WETHGateway (chinh là VET Asset)
const ADDRESS_ROUTER = process.env.REACT_APP_ADDRESS_ROUTER;
const ADDRESS_FACTORY = process.env.REACT_APP_ADDRESS_FACTORY;

// ------------------------ SWAP ------------------------ //

export { swapTokenDesire } from "../reducers/swap.reducer";

export const swapAsset = createAsyncThunk(
  swapConstants.SWAP_TOKEN,
  async ({ amountToSwap, tokenAInfo, tokenBInfo }, { getState }) => {
    const currentState = getState();

    const { connex, account, web3 } = currentState.web3;

    const assetsPoolName = `${tokenAInfo?.assetsChain} - ${tokenBInfo?.assetsChain}`;

    const addressTokenA = tokenAInfo?.assetsAddress || "";
    const addressTokenB = tokenBInfo?.assetsAddress || "";

    const isPairContainVET = isContainVET(addressTokenA, addressTokenB);
    const functionName = isPairContainVET
      ? "swapExactTokensForETH"
      : "swapExactTokensForTokens";

    const removeLiquidityABI = ERC20ABI_ROUTER.find(
      ({ name, type }) => name === functionName && type === "function"
    );
    const methodSwapToken = connex.thor
      .account(ADDRESS_ROUTER)
      .method(removeLiquidityABI);

    const min = 1_000;

    const amountOutMin = web3.utils.toWei(
      min.toString(),
      getDecimalForAsset(addressTokenA) === 6 ? "mwei" : "ether"
    );
    const deadline = getDeadline();
    const amountIn = web3.utils.toWei(
      amountToSwap.toString(),
      getDecimalForAsset(addressTokenB) === 6 ? "mwei" : "ether"
    );

    let transaction;
    if (isPairContainVET) {
      // const assetDesired =
      //   addressTokenA === process.env.REACT_APP_TOKEN_WVET
      //     ? {
      //         address: addressTokenB,
      //         amountTokenMin: amountBMin,
      //         amountETHMin: amountOutMin,
      //       }
      //     : {
      //         address: addressTokenA,
      //         amountTokenMin: amountOutMin,
      //         amountETHMin: amountBMin,
      //       };

      // methodSwapToken.value(assetDesired.amountETHMin);

      console.log(
        amountIn,
        amountOutMin,
        account,
        deadline
      );

      transaction = await methodSwapToken
        .transact(
          amountIn,
          amountOutMin,
          [addressTokenA, addressTokenB],
          account,
          deadline
        )
        .comment(`transaction swap ${assetsPoolName} from VeBank`)
        .request();
    } else {
      transaction = await methodSwapToken
        .transact(
          amountIn,
          amountOutMin,
          [addressTokenA, addressTokenB],
          account,
          deadline
        )
        .comment(`transaction remove pool ${assetsPoolName} from VeBank`)
        .request();
    }
    return transaction;
  }
);

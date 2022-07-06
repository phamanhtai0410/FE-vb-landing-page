import { swapConstants } from "../constants";
import * as actions from "../actions";

import ERC20ABI_FACTORY from "../_contracts/factory.json";
import ERC20ABI_ROUTER from "../_contracts/router.json";

import ERC20ABI_PAIR from "../_contracts/pair.json";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDeadline, getDecimalForAsset, isContainVET } from "../utils/lib";

import { selectAssetByAddress } from "../reducers/assetsMarket.reducer";
import { getSymbolPairs } from "../reducers/swap.reducer";

// const ADDRESS_GATEWAY = process.env.REACT_APP_ADDRESS_GATEWAY; // WETHGateway (chinh là VET Asset)
const ADDRESS_ROUTER = process.env.REACT_APP_ADDRESS_ROUTER;
const ADDRESS_FACTORY = process.env.REACT_APP_ADDRESS_FACTORY;

// ------------------------ SWAP ------------------------ //

export { swapTokenDesire } from "../reducers/swap.reducer";

export const swapAsset = createAsyncThunk(
  swapConstants.SWAP_TOKEN,
  async (
    { amountToSwap, amountOutMinIn, tokenAInfo, tokenBInfo },
    { dispatch, getState }
  ) => {
    const currentState = getState();

    const { connex, account, web3 } = currentState.web3;

    const assetsPoolName = `${tokenAInfo?.assetsChain} - ${tokenBInfo?.assetsChain}`;

    const addressTokenA = tokenAInfo?.assetsAddress || "";
    const addressTokenB = tokenBInfo?.assetsAddress || "";

    let contractFactory = new web3.eth.Contract(
      ERC20ABI_FACTORY,
      ADDRESS_FACTORY
    );

    const assetsPoolAddress = await contractFactory.methods
      .getPair(addressTokenA, addressTokenB)
      .call();
    const emptyAddress = /^0x0+$/.test(assetsPoolAddress); // true chưa có

    const isPairContainVET = isContainVET(addressTokenA, addressTokenB);
    const functionName = isPairContainVET
      ? "swapExactTokensForETH"
      : "swapExactTokensForTokens";

    const swapABI = ERC20ABI_ROUTER.find(
      ({ name, type }) => name === functionName && type === "function"
    );
    const methodSwapToken = connex.thor.account(ADDRESS_ROUTER).method(swapABI);

    const amountOutMin = web3.utils.toWei(
      amountOutMinIn.toString(),
      getDecimalForAsset(addressTokenA) === 6 ? "mwei" : "ether"
    );
    const deadline = getDeadline();
    const amountIn = web3.utils.toWei(
      amountToSwap.toString(),
      getDecimalForAsset(addressTokenB) === 6 ? "mwei" : "ether"
    );

    let transaction;
    if (!emptyAddress) {
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
          "amountIn",
          amountIn,
          "amountOutMin",
          amountOutMin,
          "account",
          account,
          "deadline",
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
        console.log(
          "amountIn",
          amountIn,
          "amountOutMin",
          amountOutMin,
          "account",
          account,
          "deadline",
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
      }
      return transaction;
    } else {
      dispatch(
        actions.alertActions.warning(`${assetsPoolName} not existing in pools`)
      );
    }
  }
);

export const getAllPairs = () => async (dispatch, getState) => {
  const state = getState();

  const { web3, account } = state.web3;

  let dataSymbolPair = [];

  if (web3 && ADDRESS_FACTORY) {
    const contractFactory = new web3.eth.Contract(
      ERC20ABI_FACTORY,
      ADDRESS_FACTORY
    );
    const allPairsLength = await contractFactory.methods
      .allPairsLength()
      .call();
    for (let index = 0; index < allPairsLength; index++) {
      const poolAddress = await contractFactory.methods.allPairs(index).call();
      let addressTokenA = "";
      let addressTokenB = "";
      if (poolAddress && account) {
        const contractPair = new web3.eth.Contract(ERC20ABI_PAIR, poolAddress);
        addressTokenA = await contractPair.methods.token0().call();
        addressTokenB = await contractPair.methods.token1().call();
        let symbolTokenA = selectAssetByAddress(
          state,
          addressTokenA
        ).assetsChain;
        let symbolTokenB = selectAssetByAddress(
          state,
          addressTokenB
        ).assetsChain;
        dataSymbolPair.push({
          symbolTokenA: symbolTokenA,
          symbolTokenB: symbolTokenB,
        });
      }
    }
    dispatch(getSymbolPairs(dataSymbolPair));
  }
};

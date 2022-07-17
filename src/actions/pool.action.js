import { BigNumber, ethers, FixedNumber } from "ethers";

import { poolConstants } from "../constants";

import ERC20ABI_PAIR from "../_contracts/pair.json";
import ERC20ABI_FACTORY from "../_contracts/factory.json";
import {
  getDecimalForAsset,
  getDecimalForAssetPair,
  nFormatter,
} from "../utils/lib";
import PartialConstants from "../constants/partial.constants";
import * as actions from "./index";

const ADDRESS_FACTORY = process.env.REACT_APP_ADDRESS_FACTORY;

// ------------------------ POOL ------------------------ //

export const getPoolAssets = () => async (dispatch, getState) => {
  const state = getState();

  const { web3, account } = state.web3;
  const { listAsset, data } = state.assetsPoolReducer;

  let dataList = [];
  let dataAssets = data.length === 0 ? listAsset : data;

  if (web3 && ADDRESS_FACTORY && dataAssets.length > 0) {
    let contractFactory = new web3.eth.Contract(
      ERC20ABI_FACTORY,
      ADDRESS_FACTORY
    );

    for await (const item of dataAssets) {
      //"getPair(address tokenA, address tokenB),
      const assetsPoolAddress = await contractFactory.methods
        .getPair(item.addressTokenA, item.addressTokenB)
        .call();
      const emptyAddress = /^0x0+$/.test(assetsPoolAddress); // true chưa có

      if (!emptyAddress && assetsPoolAddress) {
        let assetsDecimals = 18;
        if (
          item.addressTokenA === process.env.REACT_APP_TOKEN_VEUSD ||
          item.addressTokenB === process.env.REACT_APP_TOKEN_VEUSD
        ) {
          assetsDecimals = 12;
        }

        const contractPair = new web3.eth.Contract(
          ERC20ABI_PAIR,
          assetsPoolAddress
        );

        if (contractPair) {
          contractPair.events.Approval?.().removeAllListeners?.();
          contractPair.events.Approval?.().on("data", async (data) => {
            console.log("🐶🐶  ~ contractPair.events.Approval?. ~ data", data);
            if (data.returnValues?.owner.toLowerCase?.() === account) {
              const balanceBigN = await contractPair.methods
                .balanceOf(account)
                .call();
              let liquidityPool = await ethers.utils.formatUnits(
                balanceBigN,
                getDecimalForAssetPair(item.addressTokenA, item.addressTokenB)
              );
              const approveAmount = Number(
                ethers.utils.formatEther(
                  data.returnValues?.value,
                  PartialConstants.DEFAULT_ASSET_DECIMAL
                )
              );
              dispatch(liquidityPoolApproved(assetsPoolAddress, approveAmount));
              dispatch(
                actions.updateLiquidityPool({
                  poolAddress: assetsPoolAddress,
                  liquidityPool,
                })
              );
            }
          });

          contractPair.events.Transfer().removeAllListeners?.();
          contractPair.events.Transfer().on("data", async (data) => {
            console.log("Pair Transfer event emitted");
            console.log(
              "🐶🐶  ~ contractPair.events.allEvents().TransFer() ~ event",
              data
            );
            const { from, to } = data.returnValues;
            if (
              from.toLowerCase() === account ||
              to.toLowerCase() === account
            ) {
              const balanceBigN = await contractPair.methods
                .balanceOf(account)
                .call();
              let liquidityPool = await ethers.utils.formatUnits(
                balanceBigN,
                getDecimalForAssetPair(item.addressTokenA, item.addressTokenB)
              );
              dispatch(
                actions.updateLiquidityPool({
                  poolAddress: assetsPoolAddress,
                  liquidityPool,
                })
              );
              const isUserReceiving = to?.toLowerCase() === account;
              dispatch(
                actions.alertActions.success({
                  title: isUserReceiving
                    ? "Add liquidity Confirmed"
                    : "Remove liquidity Transaction Sent",
                  description: "View on Chain",
                })
              );
            }
          });
          console.log(
            "🐶🐶  ~ contractPair.events.Transfer ~ contractPair.events.Transfer().countListener",
            contractPair.events.Transfer().listenerCount?.()
          );
        }

        //Lấy tổng liquidity
        let totalSupply = await contractPair.methods.totalSupply().call();
        const rawTotalSupply = totalSupply;
        if (totalSupply) {
          totalSupply = ethers.utils.formatUnits(totalSupply, assetsDecimals);
          if (totalSupply < PartialConstants.MIN_AMOUNT_TO_FORMAT) {
            totalSupply = nFormatter(totalSupply);
          }
        }

        dataList.push({
          ...item,
          liquidity: totalSupply,
          rawTotalSupply,
          assetsPoolAddress,
        });
      }
    }

    dispatch({
      type: poolConstants.FETCH_POOL_ASSETS_SUCCESS,
      contractFactory,
      data: dataList,
    });

    dispatch(getPoolAssetsByAccount(dataList));
  } else {
    dispatch({
      type: poolConstants.FETCH_POOL_ASSETS_SUCCESS,
      data: [],
    });
  }

  return dataList;
};

export const getPoolAssetsByAccount =
  (dataAssetPool) => async (dispatch, getState) => {
    const state = getState();

    const { web3, account } = state.web3;

    let dataList = [];

    if (account && ADDRESS_FACTORY && dataAssetPool.length > 0) {
      for await (const item of dataAssetPool) {
        let assetsDecimals = 18;
        if (
          item.addressTokenA === process.env.REACT_APP_TOKEN_VEUSD ||
          item.addressTokenB === process.env.REACT_APP_TOKEN_VEUSD
        ) {
          assetsDecimals = 12;
        }

        let balanceAccount = 0;
        let amountTokenA = 0;
        let amountTokenB = 0;

        if (item.assetsPoolAddress && account) {
          const contractPair = new web3.eth.Contract(
            ERC20ABI_PAIR,
            item.assetsPoolAddress
          );

          //Lấy số lượng LP đang nắm giữ của account
          const balanceBigN = await contractPair.methods
            .balanceOf(account)
            .call();
          if (balanceBigN) {
            balanceAccount = ethers.utils.formatUnits(balanceBigN, 18);
          }

          const totalSupply = item.liquidity;
          if (balanceAccount >= 0 && totalSupply) {
            console.log("🐶🐶  ~ forawait ~ balanceAccount", balanceAccount);
            let { 0: reserve0, 1: reserve1 } = await contractPair.methods
              ?.getReserves()
              .call();
            reserve0 = ethers.utils.formatUnits(
              reserve0,
              getDecimalForAsset(item.addressTokenA)
            );
            reserve1 = ethers.utils.formatUnits(
              reserve1,
              getDecimalForAsset(item.addressTokenB)
            );
            amountTokenA = (balanceAccount * reserve0 || 0) / totalSupply;
            console.log("🐶🐶  ~ forawait ~ reserves?.[0]", reserve0);
            amountTokenB = (balanceAccount * reserve1 || 0) / totalSupply;
            console.log("🐶🐶  ~ forawait ~ reserves?.[1]", reserve1);
            if (totalSupply < PartialConstants.MIN_AMOUNT_TO_FORMAT) {
              totalSupply = nFormatter(totalSupply);
            }
          }

          // balanceAccount = ethers.utils.formatUnits(balanceAccount,assetsDecimals);

          //Lấy tokenA nắm giữ của account
          // amountTokenA = await contractPair.methods
          //   .providerAssets(account, item.addressTokenA)
          //   .call();
          if (amountTokenA) {
            console.log("🐶🐶  ~ forawait ~ amountTokenA", amountTokenA);
            if (amountTokenA < PartialConstants.MIN_AMOUNT_TO_FORMAT) {
              amountTokenA = nFormatter(amountTokenA);
              console.log("🐶🐶  ~ forawait ~ amountTokenA", amountTokenA);
            }
          }

          //Lấy tokenA nắm giữ của account
          // amountTokenB = await contractPair.methods
          //   .providerAssets(account, item.addressTokenB)
          //   .call();
          if (amountTokenB) {
            if (amountTokenB < PartialConstants.MIN_AMOUNT_TO_FORMAT) {
              amountTokenB = nFormatter(amountTokenB);
            }
          }

          dataList.push({
            ...item,
            balanceAccount,
            amountTokenA,
            amountTokenB,
          });
        }
      }

      dispatch({
        type: poolConstants.FETCH_POOL_ASSETS_SUCCESS,
        data: dataList,
      });
    }

    return dataList;
  };

export const getUserTokenAmounts = ({
  usersLP,
  totalLP,
  formattedReserve0,
  formattedReserve1,
}) => {
  console.log('🐶🐶  ~ formattedReserve1', formattedReserve1)
  console.log('🐶🐶  ~ formattedReserve0', formattedReserve0)
  console.log("🐶🐶  ~ totalLP", totalLP);
  console.log("🐶🐶  ~ usersLP", usersLP);
  // console.table([
  //   ["usersLP", usersLP],
  //   ["totalLP", totalLP],
  //   ["formattedReserve0", formattedReserve0],
  //   ["formattedReserve1", formattedReserve1],
  // ]);
  let amountTokenA = 0,
    amountTokenB = 0;

  try {
    if (usersLP >= 0 && totalLP > 0) {
      // amountTokenA = (BigNumber.from(usersLP)
      //   .mul(BigNumber.from(formattedReserve0))
      //   .div(BigNumber.from(totalLP))).toString();
      amountTokenA = (usersLP * formattedReserve0) / totalLP;
      // amountTokenB = (BigNumber.from(usersLP)
      //   .mul(BigNumber.from(formattedReserve1))
      //   .div(BigNumber.from(totalLP))).toString();
      amountTokenB = (usersLP * formattedReserve1) / totalLP;
    }
  } catch (error) {
    console.error(error);
  }

  // if (amountTokenA) {
  //   if (amountTokenA < PartialConstants.MIN_AMOUNT_TO_FORMAT) {
  //     amountTokenA = nFormatter(amountTokenA);
  //   }
  // }
  // if (amountTokenB) {
  //   if (amountTokenB < PartialConstants.MIN_AMOUNT_TO_FORMAT) {
  //     amountTokenB = nFormatter(amountTokenB);
  //   }
  // }

  return { amountTokenA, amountTokenB };
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

export const liquidityPoolApproved = (assetsPoolAddress, approveAmount) => ({
  type: poolConstants.APPROVE_LP_TOKEN,
  payload: { assetsPoolAddress, approveAmount },
});

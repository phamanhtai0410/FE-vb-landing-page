import React, { useEffect, useState } from "react";

// import "../../assets/styles/index.scss";

import IcSwap from "../../assets/images/ic_swap.svg";
import IcDropDown from "../../assets/images/ic_dropdown.svg";
import IcReload from "../../assets/images/ic_reload.svg";
import IcSetting from "../../assets/images/buttons/ic_setting_outline.svg";
import IcQuestionCircle from "../../assets/images/ic_question_circle.svg";
import IcSwapWhiteNoBackground from "../../assets/images/ic_swap_white_no_background.svg";

import { shallowEqual, useSelector } from "react-redux";
import BtnConnectInPage from "../account/BtnConnectInPage";
import BtnOpenSwap from "./BtnOpenSwap";
import {
  selectDesireToken,
  selectSourceToken,
} from "../../reducers/swap.reducer";
import { selectAssetByAddress } from "../../reducers/assetsMarket.reducer";
import { selectPriceByTokenAddress } from "../../reducers/assetsPrice.reducer";
import GradientStrokeWrapper from "../partials/GradientStrokeWrapper";
import { useMemo } from "react";
import { selectBalanceById } from "../../reducers/accountBalance.reducer";
import { selectAccount } from "../../reducers/web3.reducer";

const Swap = () => {
  const account = useSelector(selectAccount);
  const [inputAmount, setInputAmount] = useState("0.0");

  const sourceTokenAddress = useSelector(selectSourceToken);
  const desireTokenAddress = useSelector(selectDesireToken);
  const sourceTokenInfo = useSelector((state) =>
    selectAssetByAddress(state, sourceTokenAddress)
  );
  const desireTokenInfo = useSelector((state) =>
    selectAssetByAddress(state, desireTokenAddress)
  );
  const sourceTokenPrice = useSelector((state) =>
    selectPriceByTokenAddress(state, sourceTokenAddress)
  );
  const desireTokenPrice = useSelector((state) =>
    selectPriceByTokenAddress(state, desireTokenAddress)
  );
  const sourceTokenBalance = useSelector((state) =>
    selectBalanceById(state, sourceTokenAddress)
  );
  const desireTokenBalance = useSelector((state) =>
    selectBalanceById(state, desireTokenAddress)
  );
  const vthoBalance = useSelector((state) =>
    selectBalanceById(state, process.env.REACT_APP_TOKEN_VTHO)
  );

  const sourcePerDesireTokenPrice = useMemo(
    () => sourceTokenPrice / desireTokenPrice,
    [sourceTokenPrice, desireTokenPrice]
  );
  const desireTokenAmount = useMemo(
    () => inputAmount * sourcePerDesireTokenPrice,
    [inputAmount, sourcePerDesireTokenPrice]
  );

  const handleChangeTokenSwap = () => {
    // setSwapToken({
    //   from: {
    //     symbol: swapToken.to.symbol,
    //     icon: swapToken.to.icon,
    //     price: swapToken.to.price,
    //   },
    //   to: {
    //     symbol: swapToken.from.symbol,
    //     icon: swapToken.from.icon,
    //     price: swapToken.from.price,
    //   },
    // });
  };

  //   useEffect(() => {
  //     getSwapToken(swapToken);
  //   }, [swapToken]);

  return (
    <div className="flex flex-col p-2 space-y-4">
      <div className="flex justify-between w-full">
        <h2 className="font-poppins_semi_bold text-xl">Swap</h2>
        <div className="flex space-x-2">
          <img className="cursor-pointer" src={IcReload} alt="Refresh" />
          <img className="cursor-pointer" src={IcSetting} alt="" />
        </div>
      </div>

      {/* From section */}
      <div className="bg-item rounded-md p-4 space-y-4 text-hint">
        <div className="full-row-between-center">
          <p className="text-sm">From</p>
          <p className="text-sm">Balance: {sourceTokenBalance}</p>
        </div>
        <div className="col">
          <div className="full-row-between-center justify-between">
            <div className="full-row-between-center flex-1 gap-4 divide-x divide-hint">
              <div className="flex flex-1 space-x-3">
                <div className="relative flex flex-shrink w-6 h-6 p-0 rounded-full">
                  <img
                    className="w-6 h-6 m-0"
                    src={sourceTokenInfo?.icon}
                    alt=""
                  />
                  <GradientStrokeWrapper
                    strokeWidth="0.5rem"
                    colors={["#B9DDFF4D", "#12C9C917"]}
                    className=""
                    borderRadius="5rem"
                  />
                </div>
                <h1 className="font-bold text-grey-1">
                  {sourceTokenInfo?.assetsChain}
                </h1>
                <img className="w-4" src={IcDropDown} alt="" />
              </div>
              <div className="full-row-center pl-4 text-[#647BB4] space-x-1">
                <button
                  onClick={() => setInputAmount(sourceTokenBalance)}
                  className="w-[57px] h-[28px] bg-[#203557] rounded"
                >
                  Max
                </button>
                <button
                  onClick={() => setInputAmount(sourceTokenBalance / 2.0)}
                  className="w-[57px] h-[28px] bg-[#203557] rounded"
                >
                  Half
                </button>
              </div>
            </div>
            <input
              className="flex flex-1 h-50 bg-transparent focus:outline-none placeholder-vbDisableText font-poppins_medium text-base text-grey-1 text-right"
              type="text"
              value={inputAmount}
              onChange={(event) => setInputAmount(event.target.value)}
              placeholder="0.0"
            />
          </div>
          <p className="self-end">${inputAmount * sourceTokenPrice}</p>
        </div>
      </div>

      {/* Swap button */}
      <div className="full-row-between-center px-7">
        <div className="row-center space-x-4">
          <img
            className="cursor-pointer"
            src={IcSwap}
            alt="Swap"
            // onClick={handleChangeTokenSwap}
          />
          <div>
            <div className="row-center space-x-4">
              <p>
                1 {sourceTokenInfo?.assetsChain} ={" "}
                {(sourceTokenPrice / desireTokenPrice).toFixed(3)}{" "}
                {desireTokenInfo?.assetsChain}
              </p>
              <img src={IcSwapWhiteNoBackground} alt="Swap" />
            </div>
            <p className="text-vbLine text-sm">Low Price Impact</p>
          </div>
        </div>
        {/* <img  alt="Loading" /> */}
      </div>

      {/* To section */}
      <div className="bg-item rounded-md p-4 space-y-4 text-hint">
        <div className="full-row-between-center">
          <p className="text-sm">To</p>
          <p className="text-sm">Balance: {desireTokenBalance}</p>
        </div>
        <div>
          <div className="full-row-between-center">
            <div className="flex flex-1 space-x-3">
              <div className="relative flex flex-shrink w-6 h-6 p-0 rounded-full">
                <img
                  className="w-6 h-6 m-0"
                  src={desireTokenInfo?.icon}
                  alt=""
                />
                <GradientStrokeWrapper
                  strokeWidth="0.5rem"
                  colors={["#B9DDFF4D", "#12C9C917"]}
                  className=""
                  borderRadius="5rem"
                />
              </div>
              <h1 className="font-bold text-grey-1">
                {desireTokenInfo?.assetsChain}
              </h1>
              <img className="w-4" src={IcDropDown} alt="" />
            </div>
            <p
              className={`flex bg-transparent focus:outline-none ${
                desireTokenAmount ? "text-grey-1" : "text-vbDisableText"
              } font-poppins appearance-none text-base text-right`}
            >
              {desireTokenAmount || 0.0}
            </p>
          </div>
          <p className="float-right">${desireTokenAmount * desireTokenPrice}</p>
        </div>
      </div>

      <div className="col-center justify-center space-y-4">
        {!account ? (
          <BtnConnectInPage className="w-full btn-veb h-12" />
        ) : parseFloat(inputAmount) !== 0 ? (
          <div className="flex flex-col w-full space-y-4">
            <div className="col px-4 py-5 space-y-4 rounded-md border border-vbLine p-2">
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <p className="text-[#ABC2FC]">Minimum received</p>
                  <img src={IcQuestionCircle} alt="" />
                </div>
                <p>
                  {desireTokenAmount} {desireTokenInfo?.assetsChain}
                </p>
              </div>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <p className="text-vbLine">Price Impact</p>
                  <img src={IcQuestionCircle} alt="" />
                </div>
                <p className="text-vbLine"> &lt; 0.01% </p>
              </div>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <p className="text-[#ABC2FC] min-w-fit">Slippage tolerance</p>
                  <img className="w-5" src={IcQuestionCircle} alt="" />
                </div>
                <p className="px-4 py-[0.0625rem] rounded bg-item">
                  {" "}
                  &lt; 0.5%{" "}
                </p>
              </div>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <p className="text-[#ABC2FC]">Swap fee</p>
                  <img src={IcQuestionCircle} alt="" />
                </div>
                <p>0.0025 {sourceTokenInfo?.assetsChain}</p>
              </div>
            </div>
            <BtnOpenSwap className="w-full btn-veb h-12" />
          </div>
        ) : (
          <button
            className="btn-veb h-12 text-sm bg-btn-veb-disabled border-[1px] border-[#4B5C86]"
            disabled={true}
          >
            Enter an amount to see more trading details.
          </button>
        )}
        <div className="flex space-x-4">
          <p>VTHO balance: {vthoBalance}</p>
          <img src={IcQuestionCircle} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Swap;

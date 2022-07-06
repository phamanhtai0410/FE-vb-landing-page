import React from "react";

import IcSwap from "../../assets/images/ic_swap.svg";
import IcDropDown from "../../assets/images/ic_dropdown.svg";
import IcReload from "../../assets/images/ic_reload.svg";
import IcSetting from "../../assets/images/buttons/ic_setting_outline.svg";
import IcQuestionCircle from "../../assets/images/ic_question_circle.svg";
import IcSwapWhiteNoBackground from "../../assets/images/ic_swap_white_no_background.svg";

import BtnConnectInPage from "../account/BtnConnectInPage";
import BtnOpenSwap from "./BtnOpenSwap";

import useSwapFacade from "./hooks";
import HighlightedAssetIcon from "./HighlightedAssetIcon";
import { swapConstants } from "../../constants";
import { svgSymbolConfig } from "../../_helpers/param";

const Swap = () => {
  const {
    account,
    inputAmount,
    inputAmountIn,
    inputSlippage,
    sourceTokenInfo,
    desireTokenInfo,
    sourceTokenPrice,
    desireTokenPrice,
    sourceTokenBalance,
    desireTokenBalance,
    vthoBalance,
    sourcePerDesireTokenPrice,
    desireTokenAmount,
    setInputAmount,
    setInputSlippage,
    onSwapAssetToken,
    onSwapDesireToken,
    onShowModalSelectToken,
    onChangeDesireInput,
    onChangeSourceInput,
  } = useSwapFacade();

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
        <div className="flex flex-col">
          <div className="flex flex-row w-full justify-between">
            <div className="flex flex-row w-full">
              <div
                // type="button"
                className="flex flex-row items-center space-x-[10px] cursor-pointer"
                onClick={() =>
                  onShowModalSelectToken(swapConstants.FIRST_TOKEN)
                }
              >
                <HighlightedAssetIcon
                  icon={sourceTokenInfo?.icon}
                  svgConfig={svgSymbolConfig}
                />
                <h1 className="font-bold text-grey-1">
                  {sourceTokenInfo?.assetsChain}
                </h1>
                <img className="w-[16px]" src={IcDropDown} alt="" />
              </div>
              <div className="w-[1px] bg-[#7694DE] ml-4"></div>
              <div className="flex flex-row text-[#647BB4] space-x-1 ml-4">
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
            <div className="relative flex flex-col w-fit">
              <input
                className="bg-transparent focus:outline-none placeholder-vbDisableText font-poppins_medium text-base text-grey-1 text-right"
                type="text"
                value={inputAmount}
                onChange={(event) => onChangeSourceInput(event.target.value)}
                placeholder="0.0"
              />
            </div>
          </div>
          <p className="self-end">${inputAmount * sourceTokenPrice}</p>
        </div>
      </div>

      {/* Swap button */}
      <div className="full-row-between-center px-7">
        <div className="row-center space-x-4">
          <img
            onClick={onSwapDesireToken}
            className="cursor-pointer"
            src={IcSwap}
            alt="Swap"
          />
          <div>
            <div className="row-center space-x-4">
              <p>
                1 {sourceTokenInfo?.assetsChain} = {sourcePerDesireTokenPrice}{" "}
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
            <button
              className="flex space-x-3 w-1/2 items-center"
              onClick={() => onShowModalSelectToken(swapConstants.SECOND_TOKEN)}
            >
              <HighlightedAssetIcon
                icon={desireTokenInfo?.icon}
                svgConfig={svgSymbolConfig}
              />
              <h1 className="font-bold text-grey-1">
                {desireTokenInfo?.assetsChain}
              </h1>
              <img className="w-4" src={IcDropDown} alt="" />
            </button>
            {/* <p
              className={`flex bg-transparent focus:outline-none ${
                desireTokenAmount ? "text-grey-1" : "text-vbDisableText"
              } font-poppins appearance-none text-base text-right`}
            >
              {desireTokenAmount || 0.0}
            </p> */}
            <div className="relative flex flex-col w-fit">
              <input
                className="w-fit bg-transparent focus:outline-none placeholder-vbDisableText font-poppins_medium text-base text-grey-1 text-right"
                type="number"
                value={inputAmountIn}
                onChange={(event) => onChangeDesireInput(event.target.value)}
                placeholder="0.0"
              />
            </div>
          </div>
          <p className="float-right">${inputAmountIn * desireTokenPrice}</p>
        </div>
      </div>

      <div className="col-x-center justify-center space-y-4">
        {!account ? (
          <BtnConnectInPage className="w-full btn-veb h-12" />
        ) : inputAmount !== "" ? (
          <div className="flex flex-col w-full space-y-4">
            <div className="col px-4 py-5 space-y-4 rounded-md border border-vbLine p-2">
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <p className="text-[#ABC2FC]">Minimum received</p>
                  <img src={IcQuestionCircle} alt="" />
                </div>
                <p>
                  {(desireTokenAmount * inputSlippage) / 100}{" "}
                  {desireTokenInfo?.assetsChain}
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
                <input
                  className="bg-item w-fit py-[0.0625rem] rounded focus:outline-none placeholder-vbDisableText font-poppins_medium text-base text-grey-1 text-right"
                  type="number"
                  min={0.1}
                  value={inputSlippage}
                  onChange={(event) => setInputSlippage(event.target.value)}
                  placeholder="0.1"
                />
                {/* <p className="px-4 py-[0.0625rem] rounded bg-item">
                  {" "}
                  &lt; 0.5%{" "}
                </p> */}
              </div>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <p className="text-[#ABC2FC]">Swap fee</p>
                  <img src={IcQuestionCircle} alt="" />
                </div>
                <p>0.0025 {sourceTokenInfo?.assetsChain}</p>
              </div>
            </div>
            <button onClick={onSwapAssetToken} className="w-full btn-veb h-12">
              Swap
            </button>
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

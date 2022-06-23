import React, { useCallback, useMemo } from "react";
import Modal from "react-modal";
import "./styles.scss";

import { numberWithCommas } from "../../../utils/lib";
import ImgSubmitted from "../../../assets/images/img_up_arrow.svg";
import IcSandClock from "../../../assets/images/img_sand_clock.svg";
import IcCloseWhite from "../../../assets/images/buttons/ic_close.svg";
import IcBackWhite from "../../../assets/images/buttons/ic_back_white.svg";
import IcQuestionCircle from "../../../assets/images/buttons/ic_question_outline.svg";

import useRemoveLiquidFacade from "./hook";
import LiquidPairIcon from "../../partials/LiquidPairIcon";
import SecondaryButton from "../../partials/SecondaryButton";
import GradientStrokeWrapper from "../../partials/GradientStrokeWrapper";
import { PartialConstants } from "../../../constants/partial.constants";
import ProgressBar from "../../partials/ProgressBar";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const customStyles = {
  content: {
    top: "31%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30%)",
    background: "#182233",
    borderRadius: "1rem",
    borderWidth: "0px",
    // borderColor: "#3EE8FF",
    padding: "2.5rem",
    position: "relative",
    width: "32%",
    // width: "460px",
  },
};

const ModalRemoveLiquidity = () => {
  const {
    step,
    poolData,
    firstPerSecondTokenPrice,
    secondPerFirstTokenPrice,
    amountPercentage,
    firstToken,
    secondToken,
    isEnableBtnEnabled,
    firstTokenVolume,
    continueAvailable,
    secondTokenVolume,
    primaryButtonLabel,
    isRemoveLiquidModalOpen,
    onSelectMileStone,
    onEnableClicked,
    onSelectFirstCurrency,
    onSelectSecondCurrency,
    closeModalAndDashboard,
    handlerStepToStep,
    handleAddLiquidity,
    removeLiquidity,
    onChangeFirstTokenAmount,
    onChangeSecondTokenAmount,
  } = useRemoveLiquidFacade();

  // useEffect(() => {
  //   const firstTokenVolumeValue = firstTokenVolume?.current?.value ?? 0;
  //   const secondTokenVolumeValue = secondTokenVolume?.current?.value ?? 0;
  //   if (firstTokenVolumeValue > 0 && secondTokenVolumeValue > 0) {

  //   }
  // }, [firstTokenVolume?.current?.value, secondTokenVolume?.current?.value])
  const showMileStone = useCallback(() => {
    const milestones = [];
    for (let i = 25; i <= 100; i += 25) {
      milestones.push(
        <button
          key={i}
          onClick={() => onSelectMileStone(i)}
          className="flex flex-grow items-center justify-center h-8 rounded bg-[#FFFFFF0A] text-grey-1 text-base"
        >
          {i}%
        </button>
      );
    }
    return milestones;
  }, []);

  return (
    <div
      className="w-full lg:w-[500px] rounded-2xl p-10 bg-[#182233] mx-auto relative z-50"
    >
      {/*Header*/}
      <GradientStrokeWrapper
        colors={PartialConstants.PRIMARY_GRADIENT_COLOR_LIST}
        borderRadius="1rem"
        className="-z-10"
      />
      {step !== 1 ? (
        <div className="flex flex-row flex-1 items-center justify-between">
          <p className="font-poppins_medium text-white text-3xl">
            You will receive
          </p>
          <img
            src={IcCloseWhite}
            alt=""
            className="cursor-pointer"
            onClick={closeModalAndDashboard}
          />
        </div>
      ) : (
        <div className="flex flex-row flex-1 items-center justify-between">
          {/* <button className="btn-modal-back" onClick={closeModal} /> */}
          <div className="flex flex-row items-center space-x-6">
            {step === 1 && (
              <img
                src={IcBackWhite}
                alt="Back"
                className="cursor-pointer w-12 h-12"
                onClick={closeModalAndDashboard}
              />
            )}
            <div className="flex flex-col space-y-4">
              <span className="text-white text-2xl font-poppins_medium">
                Remove {poolData?.assetsChainA}-{poolData?.assetsChainB} liquidity
              </span>
              <div className="flex flex-row items-center space-x-1">
                {step !== 4 && (
                  <img
                    src={IcQuestionCircle}
                    alt=""
                    className="w-4 h-4 cursor-pointer"
                  />
                )}
                <span className="text-grey-1 text-base font-poppins_light">
                  To receive {poolData?.assetsChainA} and {poolData?.assetsChainB}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="content-modal mt-8">
        {/* STEP 1 */}
        <div
          className={`${
            step === 1 ? "" : "hidden"
          } flex flex-1 flex-col justify-center`}
        >
          <div className="col-center bg-[#182844] px-4 py-6 rounded-lg gap-4">
            <div className="full-row-between-center">
              <p className="text-xl text-grey-1 font-poppins_semi_bold">
                Amount
              </p>
              <p className="text-xl text-vbLine font-poppins">Detailed</p>
            </div>
            <div className="col-center gap-6">
              <p className="text-4xl text-[#2AF4FF] font-poppins_semi_bold">
                {amountPercentage}%
              </p>
              {/* <TransitionGroup>
                <CSSTransition> */}
              <ProgressBar completed={amountPercentage} />
              {/* </CSSTransition>
              </TransitionGroup> */}
              <div className="full-row-between-center gap-2">
                {showMileStone()}
              </div>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-xl font-poppins_semi_bold text-[#678BCA]">
              YOU WILL RECEIVE
            </p>
            <div className="mt-4 col p-4 gap-4.5 border rounded-lg border-[#4F92A7]">
              <div className="full-row-between-center gap-4">
                <img src={poolData?.iconOrigin} alt="" className="w-8 h-8" />
                <p className="flex flex-grow text-lg font-poppins_semi_bold">
                  {poolData?.assetsChainA || "VET"}
                </p>
                <p className="flex flex-grow justify-end text-xl">5,000</p>
              </div>
              <div className="full-row-between-center gap-4">
                <img src={poolData?.iconAssets} alt="" className="w-8 h-8" />
                <p className="flex flex-grow text-lg font-poppins_semi_bold">
                  {poolData?.assetsChainB || "VEUSD"}
                </p>
                <p className="flex flex-grow justify-end text-xl">5,000</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-xl font-poppins_semi_bold text-[#678BCA]">
              PRICES
            </p>
            <div className="mt-4 col p-4 gap-4.5 border rounded-lg border-[#4F92A7]">
              <div className="full-row-between-center">
                <p className="text-xl font-poppins_semi_bold">
                  1 {poolData?.assetsChainA || "VET"} =
                </p>
                <p className="text-xl">
                  {firstPerSecondTokenPrice} {poolData?.assetsChainB|| "VEUSD"}
                </p>
              </div>
              <div className="full-row-between-center">
                <p className="text-xl font-poppins_semi_bold">
                  1 {poolData?.assetsChainB || "VEUSD"} =
                </p>
                <p className="text-xl">
                  {secondPerFirstTokenPrice} {poolData?.assetsChainA || "VET"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2 */}
        <div className={`${step === 2 ? "" : "hidden"} flex flex-col gap-4`}>
          <div className="full-row-center gap-4">
            <p className="flex flex-grow text-2xl">5,000</p>
            <img src={poolData?.iconOrigin} alt="" className="w-8 h-8" />
            <p className="text-2xl font-poppins_semi_bold">
              {poolData?.assetsChainA || "VET"}
            </p>
          </div>
          <p className="text-2xl">+</p>
          <div className="full-row-center gap-4 mb-4">
            <p className="flex flex-grow text-2xl">5,000</p>
            <img src={poolData?.iconAssets} alt="" className="w-8 h-8" />
            <p className="text-2xl font-poppins_semi_bold">
              {poolData?.assetsChainB || "VEUSD"}
            </p>
          </div>
        </div>

        {/* STEP 3 */}
        <div
          className={`${
            step === 3 ? "" : "hidden"
          } flex flex-col justify-center -mt-8`}
        >
          <img
            src={IcSandClock}
            alt=""
            className="transition delay-500 animate-[spin_1.5s_ease-in-out_infinite] w-55 h-55 self-center my-12"
          />
          <div className="flex flex-col space-y-4">
            <p className="text-4xl text-center">Waiting For Confirmation</p>
            <p className="text-lg text-center">
              Removing 5,000 {poolData?.assetsChainA} and 9,000 {poolData?.assetsChainB}
            </p>
            <p className="text-lg text-center text-[#678BCA] cursor-pointer">
              Confirm this transaction in your wallet
            </p>
          </div>
        </div>

        {/* STEP 4 */}
        <div
          className={`${
            step === 4 ? "" : "hidden"
          } flex flex-col justify-center mt-4`}
        >
          <img src={ImgSubmitted} alt="" className="w-19 self-center" />
          <p className="text-4xl text-center mt-12">Transaction Submitted</p>
          <button className="mt-4 text-lg font-poppins_medium text-[#22D4EC]">
            View on Explore
          </button>
        </div>
      </div>

      {step === 1 || step === 2 || step === 4 ? (
        <div className="footer-modal row gap-4 mt-8">
          {step === 1 && (
            <button
              onClick={onEnableClicked}
              className={`btn-modal-veb w-full h-16.5 text-lg font-poppins_medium ${
                isEnableBtnEnabled ? "bg-btn-veb" : ""
              }`}
              disabled={!isEnableBtnEnabled}
            >
              Enable
            </button>
          )}
          <button
            onClick={step !== 4 ? handlerStepToStep : closeModalAndDashboard}
            className={`btn-modal-veb w-full h-16.5 text-lg font-poppins_medium ${
              continueAvailable ? "bg-btn-veb" : ""
            }`}
            disabled={!continueAvailable}
          >
            {primaryButtonLabel}
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ModalRemoveLiquidity;

import React from "react";
import Modal from "react-modal";
import "./styles.scss";

import { numberWithCommas } from "../../../utils/lib";
import IcCloseWhite from "../../../assets/images/buttons/ic_close.svg";
import IcWarningCircle from "../../../assets/images/ic-warning-circle.svg";
import IcBackWhite from "../../../assets/images/buttons/ic_back_white.svg";
import IcSettingWhite from "../../../assets/images/buttons/ic_setting_white.svg";
import IcHistoryWhite from "../../../assets/images/buttons/ic_history_white.svg";
import IcPlusGradient from "../../../assets/images/buttons/ic_plus_gradient.svg";
import IcSandClock from "../../../assets/images/img_sand_clock.svg";
import IcCollapse from "../../../assets/images/buttons/ic_collapse.svg";
import IcQuestionCircle from "../../../assets/images/buttons/ic_question_outline.svg";

import Assets from "./Asset";
import useAddLiquidFacade from "./hook";
import LiquidPairIcon from "../../partials/LiquidPairIcon";
import SecondaryButton from "../../partials/SecondaryButton";
import GradientStrokeWrapper from "../../partials/GradientStrokeWrapper";
import { PartialConstants } from "../../../constants/partial.constants";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30%)",
    background: "#182233",
    // borderRadius: "0.5rem",
    borderWidth: "0px",
    // borderColor: "#3EE8FF",
    padding: "2rem",
    position: "relative",
    width: "32%",
    // width: "460px",
  },
};

const ModalAddLiquidity = () => {
  const {
    step,
    firstToken,
    secondToken,
    firstTokenVolume,
    continueAvailable,
    secondTokenVolume,
    primaryButtonLabel,
    isAddLiquidModalOpen,
    onSelectFirstCurrency,
    onSelectSecondCurrency,
    closeModalAndDashboard,
    handlerStepToStep,
    handleAddLiquidity,
    removeLiquidity,
    onChangeFirstTokenAmount,
    onChangeSecondTokenAmount,
  } = useAddLiquidFacade();

  // useEffect(() => {
  //   const firstTokenVolumeValue = firstTokenVolume?.current?.value ?? 0;
  //   const secondTokenVolumeValue = secondTokenVolume?.current?.value ?? 0;
  //   if (firstTokenVolumeValue > 0 && secondTokenVolumeValue > 0) {

  //   }
  // }, [firstTokenVolume?.current?.value, secondTokenVolume?.current?.value])

  return (
    <Modal
      isOpen={isAddLiquidModalOpen}
      ariaHideApp={false}
      style={customStyles}
      portalClassName="modal-veb"
      overlayClassName="overlay"
    >
      {/*Header*/}
      <GradientStrokeWrapper colors={PartialConstants.PRIMARY_GRADIENT_COLOR_LIST} className="-z-50" />
      {step !== 1 && step !== 4 ? (
        <div className="flex flex-row flex-1 items-center justify-between">
          <p className="font-poppins_medium text-white text-2xl">
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
            {step < 4 && (
              <img
                src={IcBackWhite}
                alt="Back"
                className="cursor-pointer w-10 h-10"
                onClick={closeModalAndDashboard}
              />
            )}
            <div className="flex flex-col space-y-3">
              <span className="text-white text-lg font-poppins_medium">
                Add Liquidity
              </span>
              <div className="flex flex-row items-center space-x-1">
                <img
                  src={IcQuestionCircle}
                  alt=""
                  className="w-3 h-3 cursor-pointer"
                />
                <span className="text-white text-xs">
                  Add liquidity to recieve LP tokens{" "}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row space-x-6">
            <img
              src={IcSettingWhite}
              alt="Setting"
              className="w-6 h-6 cursor-pointer"
              // onClick={closeModal}
            />
            <img
              src={IcHistoryWhite}
              alt="History"
              className="w-6 h-6 cursor-pointer"
              // onClick={closeModal}
            />
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
          <Assets
            // inputRef={firstTokenVolume}
            assetData={firstToken}
            volume={firstTokenVolume}
            onVolumeChange={onChangeFirstTokenAmount}
            onClickSelectCurrency={onSelectFirstCurrency}
          />
          <img
            src={IcPlusGradient}
            alt="Add"
            className="w-8 h-8 mt-4 self-center"
          />
          <Assets
            // inputRef={secondTokenVolume}
            assetData={secondToken}
            volume={secondTokenVolume}
            onVolumeChange={onChangeSecondTokenAmount}
            onClickSelectCurrency={onSelectSecondCurrency}
            className="mt-4"
          />

          {firstToken && secondToken && (
            <div className="flex flex-1 flex-col mt-8">
              <p>Price and pool share</p>
              <div className="flex flex-1 flex-row justify-between items-center mt-4 px-2 py-5 liquid-wrapper">
                <div className="price-pool-item">
                  <p>323.366</p>
                  <p>VEUSB per VET</p>
                </div>
                <div className="price-pool-item">
                  <p>0.0686648</p>
                  <p>VET per VEUSD</p>
                </div>
                <div className="price-pool-item">
                  <p>{"<0,01%"}</p>
                  <p>Share of Pool</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STEP 2 */}
        <div
          className={`${
            step === 2 ? "" : "hidden"
          } flex flex-col`}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row items-center">
              <p className=" text-3xl font-poppins_medium mr-7">0,0390929</p>
              <div className="flex flex-row space-x-2">
                <img src={firstToken?.icon} alt="" className="w-6 h-6" />
                <img src={secondToken?.icon} alt="" className="w-6 h-6" />
              </div>
            </div>
            <p className="text-base">VET/VEUSD Pool Tokens</p>
            <p className="text-xs text-justify font-poppins_light">
              Output is estimated. If the price changes by more than 0.5% your
              transaction will revert.
            </p>
          </div>
          <p className="mt-6 font-poppins text-sm">Price and pool share</p>
          <div className="flex flex-col mt-3 px-3 py-3 space-y-4 liquid-wrapper">
            <div className="price-pool-share-row">
              <p className="font-poppins_light">VET Deposited</p>
              <div className="flex flex-row items-center space-x-4">
                <img src={firstToken?.icon} alt="" className="w-6 h-6" />
                <span className="font-poppins_semi_bold text-lg">
                  {numberWithCommas(firstTokenVolume)}
                </span>
              </div>
            </div>
            <div className="price-pool-share-row">
              <p className="font-poppins_light">VEUSD Deposited</p>
              <div className="flex flex-row items-center space-x-4">
                <img src={secondToken?.icon} alt="" className="w-6 h-6" />
                <span className="font-poppins_semi_bold text-lg">
                  {numberWithCommas(secondTokenVolume)}
                </span>
              </div>
            </div>
            <div className="price-pool-share-row items-start">
              <p className="self-start font-poppins_light">Rates</p>
              <div className="flex flex-col justify-end">
                <p className="text-right">1 VET = 565 VEUSD</p>
                <p className="text-right">1 VEUSD = 0.0234 VET</p>
              </div>
            </div>
            <div className="price-pool-share-row">
              <p>Share a Pool</p>
              <p>0.00005958%</p>
            </div>
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
            className="transition delay-500 animate-[spin_1.5s_ease-in-out_infinite] w-[10.5rem] h-[10.5rem] self-center my-8"
          />
          <div className="flex flex-col space-y-4">
            <p className="text-[1.7rem] text-center">Waiting For Confirmation</p>
            <p className="text-sm text-center">
              Supplying 5,000 VET and 9,000 VEUSD
            </p>
            <p className="text-sm text-center text-[#678BCA] cursor-pointer">
              Confirm this transaction in your wallet
            </p>
          </div>
        </div>

        {/* STEP 4 */}
        <div
          className={`${
            step === 4 ? "" : "hidden"
          } flex flex-col justify-center`}
        >
          <div className="liquid-wrapper px-3 py-5 col-center">
            <div className="flex flex-row justify-between items-start">
              <div className="flex flex-col space-y-2">
                <div className="flex flex-row items-center space-x-3">
                  <LiquidPairIcon
                    iconAsset1={firstToken?.icon}
                    iconAsset2={secondToken?.icon}
                    iconSize="6"
                  />
                  <p className="font-poppins_semi_bold text-sm">{`${firstToken?.assetsChain}/${secondToken?.assetsChain}`}</p>
                </div>
                <p className="w-2/3 text-base font-poppins_light">0.03908</p>
              </div>
              <img src={IcCollapse} alt="" className="w-10 h-10" />
            </div>
            <div className="col mt-8 space-y-4">
              <div className="full-row-between-center space-x-4">
                <img src={firstToken?.icon} alt="" className="w-6 h-6"/>
                <p className="flex-grow font-poppins_semi_bold text-lg">{`Pooled ${firstToken?.assetsChain}`}</p>
                <p className="text-base font-poppins_light">{numberWithCommas(firstTokenVolume)}</p>
              </div>
              <div className="full-row-between-center space-x-4">
                <img src={secondToken?.icon} alt="" className="w-6 h-6"/>
                <p className="flex-grow font-poppins_semi_bold text-lg">{`Pooled ${secondToken?.assetsChain}`}</p>
                <p className="text-base font-poppins_light">{numberWithCommas(secondTokenVolume)}</p>
              </div>
              <div className="full-row-between-center">
                <p className="text-vbLine text-base font-poppins_light">Share a Pool</p>
                <p className="text-vbLine text-base font-poppins_light">{"<0.01%"}</p>
              </div>
            </div>
            <button
              onClick={removeLiquidity}
              className="btn-modal-veb w-full h-12 mt-8 text-base bg-btn-veb"
            >
              Remove
            </button>
            <p
              onClick={handleAddLiquidity}
              className="flex flex-1 self-center text-[#22D4EC] mt-7 text-sm text-center cursor-pointer"
            >
              + Add liquidity instead
            </p>
          </div>
          <p className="mt-8 self-center text-base font-poppins_light text-[#678BCA]">
            Don’t see a pool you joined?
          </p>
          {/* <button className="text-base text-[#0CD2EC] bor"></button> */}
          <SecondaryButton
            label="Find other LP tokens"
            labelColor="#0CD2EC"
            className="mt-4 w-[35%] h-9 btn-modal-secondary self-center"
            labelClassName="text-xs"
          />
        </div>
      </div>

      {step === 1 || step === 2 || step === 4 ? (
        <div className="footer-modal mt-6">
          <button
            onClick={(e) => {
              handlerStepToStep(e);
            }}
            className={`btn-modal-veb w-full h-13 text-sm font-poppins_medium ${
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
    </Modal>
  );
};

export default ModalAddLiquidity;

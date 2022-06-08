import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { Range } from "react-range";
import { TailSpin } from "react-loading-icons";
import "./styles.scss";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { numberWithCommas } from "../../../utils/lib";
import IcWarningCircle from "../../../assets/images/ic-warning-circle.svg";
import IcBackWhite from "../../../assets/images/buttons/ic_back_white.svg";
import IcSettingWhite from "../../../assets/images/buttons/ic_setting_white.svg";
import IcHistoryWhite from "../../../assets/images/buttons/ic_history_white.svg";
import IcPlusGradient from "../../../assets/images/buttons/ic_plus_gradient.svg";

import Assets from "./Asset";

import IcNext1 from "../../../assets/images/ic_factory.svg";

// import BtnBorrow from './BtnBorrow';
// import BtnBorrowApprove from './BtnBorrowApprove';

import * as actions from "../../../actions";
import {
  selectFirstToken,
  selectLiquidReducer,
  selectSecondToken,
  selectOpenAddLiquidState,
} from "../../../reducers/liquid.reducer";
import useAddLiquidFacade from "./hook";
import GradientStrokeWrapper from "../../partials/GradientStrokeWrapper";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30%)",
    background: "#182233",
    borderRadius: "0.5rem",
    borderWidth: "1px",
    borderColor: "#3EE8FF",
    padding: "2.75rem",
    width: "640px",
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
    closeModal,
    closeModalAndDashboard,
    handlerStepToStep,
    setFirstTokenVolume,
    setSecondTokenVolume,
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
      <div className="flex flex-row items-center justify-between">
        {/* <button className="btn-modal-back" onClick={closeModal} /> */}
        <div className="flex flex-row space-x-8">
          <img
            src={IcBackWhite}
            alt="Back"
            className="cursor-pointer"
            onClick={closeModalAndDashboard}
          />
          <div className="flex flex-col space-y-4">
            <span className="text-white text-2xl font-bold">Add Liquidity</span>
            <div className="flex flex-row items-center space-x-1">
              <img
                src={IcWarningCircle}
                alt=""
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-white text-base">
                Add liquidity to recieve LP tokens{" "}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-row space-x-8">
          <img
            src={IcSettingWhite}
            alt="Setting"
            className="w-8 h-8 cursor-pointer"
            // onClick={closeModal}
          />
          <img
            src={IcHistoryWhite}
            alt="History"
            className="w-8 h-8 cursor-pointer"
            // onClick={closeModal}
          />
        </div>
      </div>

      <div className="content-modal mt-8">
        {/* STEP 1 */}
        <div className={`${step === 1 ? "" : "hidden"} flex flex-1 flex-col justify-center`}>
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
          />

          {firstToken && secondToken && (
            <div className="flex flex-1 flex-col mt-8">
              <p>Price and pool share</p>
              <div className="flex flex-1 flex-row justify-between items-center mt-4 px-6 py-4 border-2 border-[#4F92A7] rounded-lg">
                <div className="flex flex-col px-4 space-y-2 items-center">
                  <p>323.366</p>
                  <p>VEUSB per VET</p>
                </div>
                <div className="flex flex-col px-4 space-y-2 items-center">
                  <p>0.0686648</p>
                  <p>VET per VEUSD</p>
                </div>
                <div className="flex flex-col px-4 space-y-2 items-center">
                  <p>{"<0,01%"}</p>
                  <p>Share of Pool</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STEP 2 */}
        <div className={step === 2 ? "" : "hidden"}>
          {/* <div className="mt-4">
            <p className="w-full font-montserrat text-center text-lg text-[#A0D911] leading-6">
              Please select your interest rate
            </p>
            <p className="w-4/5 font-poppins text-base text-center text-[#F5F5F5] leading-6 m-auto pt-6">
              Choose either stable or variable APY for your loan. Please click
              on the desired rate type and read the info box for more
              information on each option.
            </p>
          </div>

          <div className="flex flex-row space-x-6 justify-center px-16 my-12 text-lg font-poppins text-[#FAFAFA]">
            {/* <div onClick={e => { handlerChangeRate(1) }} className={`basis-1/2 bg-[#20314E] rounded-xl flex flex-col items-center justify-center h-44 cursor-pointer border-[2px] border-solid border-[#373368] ${rate === 1 ? "bg-gradient-border" : ""}`}>
                            <div className="bg-[#4D4B86] rounded-full w-12 h-12 flex items-center place-content-center">
                                <img src={IcNext} alt={"next"} className="w-7 h-7" />
                            </div>
                            <div className='pt-6 text-base'>Stable APY</div>
                            <div className='pt-1 font-bold text-sm'>6.21 %</div>
                        </div> */}
          {/* <div
              onClick={(e) => {
                handlerChangeRate(2);
              }}
              className={`basis-1/2 bg-[#20314E] rounded-xl flex flex-col items-center justify-center h-44 cursor-pointer border-[2px] border-solid border-[#373368] ${
                rate === 2 ? "bg-gradient-border" : ""
              }`}
            >
              <div className="bg-[#4D4B86] rounded-full w-12 h-12 flex items-center place-content-center">
                <img src={IcNext1} alt={"next"} className="w-7 h-7" />
              </div>
              <div className="pt-6 text-base">Variable APY</div>
              <div className="pt-1 font-bold text-sm">0.04 %</div>
            </div>
          </div> */}
        </div>

        {/* STEP 3 */}
        {/* <div className={step === 3 ? "" : "hidden"}>
          <div className="mt-4">
            <p className="w-full font-montserrat text-center text-lg text-[#A0D911] leading-6">
              Borrow overview
            </p>
            <p className="w-4/5 font-poppins text-base text-center text-[#F5F5F5] leading-6 m-auto pt-6">
              These are your transaction details. Make sure to check if this is
              correct before submitting.
            </p>
          </div>

          <div className="border-2 border-solid border-[#4F92A7] mx-8 p-6 mt-10">
            <div className="flex justify-between text-lg font-poppins">
              <div className="text-[#FAFAFA] font-light">Amount</div>
              <div className="flex items-center">
                <img
                  className="w-6 h-6"
                  src={dataToken ? dataToken?.icon : ""}
                  alt="Token VEBank"
                />
                <span className="font-poppins font-bold pl-2">
                  {numberWithCommas(amount)}
                </span>
                <span className="text-[#BFBFBF] pl-2">
                  {dataToken ? dataToken?.assetsChain : ""}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-poppins">
              <div className="text-[#FAFAFA]"></div>
              <div>
                <span className="font-poppins font-thin text-sm">
                  {numberWithCommas(amount)} $
                </span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-poppins pt-4">
              <div className="text-[#FAFAFA] font-light">Interest (APY)</div>
              <div>
                <span className="font-poppins font-bold">0.4</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-poppins pt-4">
              <div className="text-[#FAFAFA] font-light">
                Interest rate type
              </div>
              <div>
                <span className="font-poppins font-bold">Variable</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-poppins pt-4">
              <div className="text-[#FAFAFA] font-light">New health factor</div>
              <div>
                <span className="font-poppins font-bold text-[#FF4D4F]">
                  1.03
                </span>
              </div>
            </div>
          </div>

          <div className="border-2 border-solid border-[#4F92A7] mx-8 my-12">
            <div className="flex justify-between text-lg font-poppins bg-[#0F1B2F]">
              <div
                className={`text-[#FAFAFA] text-base text-center font-light  w-1/2 p-1 bg-btn-veb ${
                  pending === true ? "bg-pending" : ""
                } ${transaction ? "bg-success" : ""}`}
              >
                1 Borrow
              </div>
              <div
                className={`text-[#FAFAFA] text-base text-center font-light w-1/2 p-1 ${
                  pending === true ? "bg-pending" : ""
                } ${transaction ? "bg-success" : ""}`}
              >
                2 {pending ? "Pending" : "Finished"}
              </div>
            </div>

            <div className="flex justify-between text-lg font-poppins p-6">
              <div>
                <div className="font-light text-base">
                  {transaction ? (
                    <label className="text-[#50e3ab]">2/2 Borrow</label>
                  ) : (
                    <>
                      <label className="text-[#50e3ab]">1/2 Borrow</label>
                      <div className="text-[#FAFAFA] pt-2">
                        Please submit to borrow
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="pt-1 flex flex-row">
                {pending ? <TailSpin className="w-6 h-6 m-4" /> : ""}

                {
                  transaction ? (
                    <button
                      onClick={(e) => {
                        closeModalAndDashboard(e);
                      }}
                      className={`btn-modal-veb bg-btn-veb`}
                      type="submit"
                    >
                      Dashboard
                    </button>
                  ) : (
                    showBtnView()
                  )
                  // <BtnBorrow pending={pending} amount={amount} rate={rate} />
                }
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {step === 1 || step === 2 ? (
        <div className="footer-modal text-lg pt-12">
          <button
            onClick={(e) => {
              handlerStepToStep(e);
            }}
            className={`btn-modal-veb w-full h-16 text-base ${
              continueAvailable ? "bg-btn-veb" : ""
            } `}
            // disabled={!continueAvailable}
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

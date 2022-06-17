import { useEffect, useState } from "react";
import Modal from "react-modal";
import { Range } from "react-range";
import { TailSpin } from "react-loading-icons";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { numberWithCommas } from "../../utils/lib";

import { stakeConstants } from "../../constants";
import { selectStakeReducer } from "../../reducers/stake.reducer";
import IcWarningCircle from "../../assets/images/ic-warning-circle.svg";
import SecondaryButton from "../partials/SecondaryButton";

import IcNext from "../../assets/images/ic_next.svg";
import IcNext1 from "../../assets/images/ic_factory.svg";

// import BtnBorrow from './BtnBorrow';
// import BtnBorrowApprove from './BtnBorrowApprove';

import * as actions from "../../actions";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30%)",
    background: "#182233",
    border: "none",
    borderRadius: "8px",
    padding: 0,
    width: "33%",
  },
};

const ModalStake = () => {
  const [amount, setAmount] = useState(0);
  const [values, setValues] = useState([0]);
  const [step, setStep] = useState(1);
  const [rate, setRate] = useState(2);

  const {
    dataToken,
    accountBalance,
    accountApprove,
    accountStableDebtApprove,
    accountVariableDebtApprove,
    errorCode,
    message,
    transaction,
    pending,
    isOpen,
  } = useSelector(selectStakeReducer, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    resetFrm();
  }, [dataToken]);

  useEffect(() => {
    setStep(1);
  }, [isOpen]);

  const resetFrm = () => {
    setAmount(0);
    setValues([0]);
    setStep(1);
    setRate(2);
  };

  const closeModal = (e) => {
    dispatch({
      type: stakeConstants.MODAL_CLOSE_STAKE,
    });
    if (transaction) {
      dispatch(actions.reloadAccountAssets());
    }
  };

  const closeModalAndDashboard = () => {
    closeModal();
    resetFrm();
  };

  const onChangeRangeAmount = (values) => {
    setValues(values);
    setAmount(values[0]);
  };

  const onChangeAmount = (e) => {
    const { value } = e.target;
    // if (value <= accountBalance) {
    setAmount(value);
    setValues([value]);
    // }
  };

  const handlerStepToStep = (e) => {
    if (step === 1 && amount > 0) {
      setStep(2);
    }

    if (step === 2 && rate > 0) {
      setStep(3);
    }
  };

  const handlerChangeRate = (value) => {
    setRate(value);
  };

  const showCheckStepContinue = () => {
    if (amount !== 0 && amount > 0) return true;
  };

  const showFactor = () => {
    if (step === 1 && amount > 0) {
      return (
        <div className="font-poppins font-light">
          New health factor <span className="font-bold">1.03</span>
        </div>
      );
    }
  };

  const showBtnView = () => {
    let btn = "";

    if (dataToken) {
      if (accountApprove === 0) {
        // btn = <BtnBorrowApprove dataToken={dataToken} pending={pending} rate={rate} />;
      } else {
        // btn = <BtnBorrow dataToken={dataToken} pending={pending} amount={amount} rate={rate} />;
      }
    }

    return btn;
  };

  const onConfirmClicked = (e) => {
    // TODO: Stake the entered value
    closeModalAndDashboard();
  };

  return (
    <Modal
      // isOpen={Object.keys(data).length > 0 ? true : false}
      isOpen={isOpen}
      ariaHideApp={false}
      style={customStyles}
      portalClassName="modal-veb"
      overlayClassName="overlay-lur"
    >
      <div className="header-modal">
        <h2>Stake</h2>
        <button className="btn-modal-close" onClick={closeModal}></button>
      </div>

      <div className="content-modal">
        <div className={step === 1 ? "" : "hidden"}>
          {/* <div className="mt-4">
            <p className="w-full font-montserrat text-center text-lg text-[#A0D911] leading-6">
              How much would you like to borrow?
            </p>
            <p className="w-4/5 font-poppins text-base text-center text-[#F5F5F5] leading-6 m-auto pt-6">
              Please enter an amount you would like to borrow. The maximum
              amount you can borrow is shown below.
            </p>
          </div> */}

          <div className="flex justify-between px-8 mt-6 text-lg font-sf_pro">
            <div className="flex items-center space-x-2">
              <p className="text-[#FAFAFA]">Balance</p>
              <img
                src={IcWarningCircle}
                alt=""
                className="w-4 h-4 cursor-pointer"
              />
            </div>
            <div>
              <span className="font-poppins font-bold">{accountBalance}</span>
              <span className="text-[#BFBFBF] pl-2">
                {dataToken ? dataToken?.assetsChain : ""}
              </span>
            </div>
          </div>

          <div className="bg-gradient-search rounded-lg flex flex-row mt-2 mx-8 py-4 px-4 justify-between">
            <img
              className="w-12 h-8 pr-3"
              src={dataToken ? dataToken?.iconStake : ""}
              alt="Token VEBank"
            />

            <input
              value={amount}
              onChange={onChangeAmount}
              className="bg-transparent focus:outline-none placeholder-slate-400 font-poppins appearance-none text-base w-full"
              type="text"
              placeholder={"Amount"}
            />

            <span
              onClick={(e) => {
                onChangeRangeAmount([accountBalance]);
              }}
              className="font-poppins font-bold text-[#A0D911] text-lg cursor-pointer"
            >
              Max
            </span>
          </div>

          {/* <div className="flex justify-between px-8 mt-12 font-poppins text-sm leading-4 text-slate-200">
            <label>Safer</label>
            {showFactor()}
            <label>Riskier</label>
          </div>

          <div className="px-8">
            <Range
              step={1}
              min={0}
              max={100}
              values={values}
              onChange={(values) => {
                onChangeRangeAmount(values);
              }}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className="w-full h-3 pr-2 my-4 bg-gradient-range-amount rounded-md"
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  className="w-3 h-3 transform translate-x-10 bg-slate-50 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                />
              )}
            />
          </div> */}
        </div>
      </div>

      <div className="footer-modal mt-4 px-8 py-12">
        {/* <button
            onClick={e => { handlerStepToStep(e) }}
            className={`btn-modal-veb w-full ${showCheckStepContinue() ? "bg-btn-veb" : ""} `} >Continue</button> */}
        <div className="flex flex-row flex-1 justify-between items-center space-x-11">
          {/* <SecondaryButton
            label="Cancel"
            onClick={closeModal}
            className="flex-1"
          /> */}
          {/* <button onClick={closeModal} className="flex-1 btn-modal-veb">
            Cancel
          </button> */}
          <SecondaryButton
            label="Cancel"
            onClick={closeModal}
            className="w-full btn-modal-secondary h-11"
          />
          <button
            onClick={showCheckStepContinue() && onConfirmClicked}
            className={`w-full btn-modal-veb ${
              showCheckStepContinue() ? "bg-btn-veb" : ""
            }`}
            disabled={parseFloat(amount) <= 0}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalStake;

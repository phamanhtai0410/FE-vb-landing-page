import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "../../../actions";
import {
  selectFirstToken,
  selectLiquidReducer,
  selectOpenAddLiquidState,
  selectSecondToken,
} from "../../../reducers/liquid.reducer";

const useAddLiquidFacade = () => {
  const dispatch = useDispatch();

  const firstToken = useSelector(selectFirstToken, shallowEqual);
  const secondToken = useSelector(selectSecondToken, shallowEqual);
  const isAddLiquidModalOpen = useSelector(selectOpenAddLiquidState);
  const [step, setStep] = useState(1);
  const [continueAvailable, setContinueAvailable] = useState(false);
  const [firstTokenVolume, setFirstTokenVolume] = useState("");
  const [secondTokenVolume, setSecondTokenVolume] = useState("");
  const [primaryButtonLabel, setPrimaryButtonLabel] = useState("Invalid pair");

  const onSelectFirstCurrency = useCallback((e) => {
    dispatch(actions.selectFirstToken());
  }, []);
  const onSelectSecondCurrency = useCallback((e) => {
    dispatch(actions.selectSecondToken());
  }, []);

  const onChangeFirstTokenAmount = useCallback((value) => {
    // if (value <= accountBalance) {
    setFirstTokenVolume(value);
    // }
  }, []);

  const onChangeSecondTokenAmount = useCallback((value) => {
    // if (value <= accountBalance) {
    setSecondTokenVolume(value);
    // }
  }, []);

  const closeModal = () => {
    dispatch(actions.closeLiquidity());
  };

  const resetFrm = () => {
    setFirstTokenVolume("");
    setSecondTokenVolume("");
    setStep(1);
  };

  const closeModalAndDashboard = () => {
    closeModal();
    resetFrm();
  };

  const handlerStepToStep = (e) => {
    if (
      step === 1 &&
      //   firstToken &&
      //   secondToken &&
      firstTokenVolume > 0 &&
      secondTokenVolume > 0
    ) {
      setStep(2);
    }

    // if (step === 2) {
    //   setStep(3);
    // }
  };

  const showCheckStepContinue = () => {
    console.log("Checking Step", step);
    switch (step) {
      case 1: {
        if (!firstToken || !secondToken) {
          setPrimaryButtonLabel("Invalid pair");
        } else if (
          firstTokenVolume.length === 0 ||
          secondTokenVolume.length === 0 ||
          firstTokenVolume <= 0 ||
          secondTokenVolume <= 0
        ) {
          setPrimaryButtonLabel("Enter an amount");
        } else {
          setPrimaryButtonLabel("Continue");
          return true;
        }
        return false;
      }
      case 2: {
        break;
      }
      default: {
        break;
      }
    }

    //    if (step === 2) {
    //      return true;
    //    }
  };

  useEffect(() => {
    setStep(1);
  }, [isAddLiquidModalOpen]);

  useEffect(() => {
    switch (step) {
      case 1: {
        if (!firstToken || !secondToken) {
          setPrimaryButtonLabel("Invalid pair");
        } else if (
          firstTokenVolume.length === 0 ||
          secondTokenVolume.length === 0 ||
          firstTokenVolume <= 0 ||
          secondTokenVolume <= 0
        ) {
          setPrimaryButtonLabel("Enter an amount");
        } else {
          setPrimaryButtonLabel("Continue");
          setContinueAvailable(true);
        }
        setContinueAvailable(false);
        break;
      }
      case 2: {
        break;
      }
      default: {
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstToken, secondToken, firstTokenVolume, secondTokenVolume]);

  return {
    step,
    firstToken,
    secondToken,
    continueAvailable,
    isAddLiquidModalOpen,
    firstTokenVolume,
    secondTokenVolume,
    primaryButtonLabel,
    closeModal,
    handlerStepToStep,
    closeModalAndDashboard,
    showCheckStepContinue,
    onSelectFirstCurrency,
    onSelectSecondCurrency,
    setFirstTokenVolume,
    setSecondTokenVolume,
    onChangeFirstTokenAmount,
    onChangeSecondTokenAmount,
  };
};

export default useAddLiquidFacade;

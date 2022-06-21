import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "../../../actions";
import {
  selectFirstToken,
  selectOpenAddLiquidState,
  selectOpenRemoveLiquidState,
  selectSecondToken,
} from "../../../reducers/liquid.reducer";

const useRemoveLiquidFacade = () => {
  const dispatch = useDispatch();

  const firstToken = useSelector(selectFirstToken, shallowEqual);
  const secondToken = useSelector(selectSecondToken, shallowEqual);
  const isRemoveLiquidModalOpen = useSelector(selectOpenRemoveLiquidState);

  const [step, setStep] = useState(1);
  const [amountPercentage, setAmountPercentage] = useState(0);
  const [continueAvailable, setContinueAvailable] = useState(false);
  const [firstTokenVolume, setFirstTokenVolume] = useState("");
  const [secondTokenVolume, setSecondTokenVolume] = useState("");
  const [primaryButtonLabel, setPrimaryButtonLabel] =
    useState("Enter an amount");

  const isEnableBtnEnabled = useMemo(() => {
    if (amountPercentage === 0) {
      return false;
    } else if (continueAvailable) {
      return false;
    }
    return true;
  }, [continueAvailable, amountPercentage]);

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
    dispatch(actions.closeRemoveLiquidity());
  };

  const resetFrm = () => {
    setStep(1);
    setContinueAvailable(false);
    setAmountPercentage(0);
    setPrimaryButtonLabel("Enter an amount")
  };

  const closeModalAndDashboard = () => {
    if (step === 1 || step === 4) {
      closeModal();
      resetFrm();
    } else if (step === 2) {
      setStep(1);
      setPrimaryButtonLabel("Continue");
    }
  };

  const handlerStepToStep = () => {
    if (step === 1) {
      setStep(2);
      setPrimaryButtonLabel("Continue");
    }

    if (step === 2) {
      setStep(3);
      setTimeout(() => {
        setStep(4);
        setPrimaryButtonLabel("Close");
      }, 2000);
    }
  };

  const removeLiquidity = () => {};

  const onSelectMileStone = (percentage) => {
    console.log("🐶🐶  ~ onSelectMileStone ~ percentage", percentage);
    setAmountPercentage(percentage);
  };

  const onEnableClicked = () => {
    setContinueAvailable(true);
    setPrimaryButtonLabel("Remove");
  };

  const findOtherLiquidPoolTokens = () => {};

  useEffect(() => {
    setStep(1);
  }, [isRemoveLiquidModalOpen]);

  useEffect(() => {
    switch (step) {
      case 1: {
        if (!firstToken || !secondToken) {
          setPrimaryButtonLabel("Invalid pair");
          setContinueAvailable(false);
        } else if (
          firstTokenVolume.length === 0 ||
          secondTokenVolume.length === 0 ||
          firstTokenVolume <= 0 ||
          secondTokenVolume <= 0
        ) {
          setPrimaryButtonLabel("Enter an amount");
          setContinueAvailable(false);
        } else {
          setContinueAvailable(true);
          setPrimaryButtonLabel("Supply");
        }
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

  useEffect(
    () => () => {
      // On unmount
      closeModalAndDashboard();
    },
    []
  );

  return {
    step,
    isEnableBtnEnabled,
    amountPercentage,
    firstToken,
    secondToken,
    continueAvailable,
    isRemoveLiquidModalOpen,
    firstTokenVolume,
    secondTokenVolume,
    primaryButtonLabel,
    closeModal,
    onEnableClicked,
    removeLiquidity,
    onSelectMileStone,
    handlerStepToStep,
    closeModalAndDashboard,
    onSelectFirstCurrency,
    onSelectSecondCurrency,
    findOtherLiquidPoolTokens,
    onChangeFirstTokenAmount,
    onChangeSecondTokenAmount,
  };
};

export default useRemoveLiquidFacade;

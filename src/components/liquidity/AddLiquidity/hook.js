import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "../../../actions";
import {
  selectFirstToken,
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
    dispatch(actions.closeAddLiquidity());
  };

  const resetFrm = () => {
    setFirstTokenVolume("");
    setSecondTokenVolume("");
    setStep(1);
  };

  const closeModalAndDashboard = () => {
    if (step === 1) {
      closeModal();
      resetFrm();
    } else if (step === 2) {
      setStep(1);
      setPrimaryButtonLabel("Continue");
    } else if (step === 4) {
      setStep(2);
      setPrimaryButtonLabel("Confirm Supply");
    }
  };

  const handlerStepToStep = (e) => {
    if (
      step === 1 &&
      firstToken &&
      secondToken &&
      firstTokenVolume > 0 &&
      secondTokenVolume > 0
    ) {
      dispatch(actions.loadDetailAddLiquidity());
      setStep(2);
      setPrimaryButtonLabel("Confirm Supply");
    }

    if (step === 2) {
      setStep(3);
      handleAddLiquidity()
      // setTimeout(() => {
      //   setStep(4);
      //   setPrimaryButtonLabel("+ Add Liquidity");
      // }, 2000);
    }
  };

  const removeLiquidity = () => {};

  const handleAddLiquidity = () => {
    dispatch(
      actions.addLiquidity({
        firstAmount: firstTokenVolume,
        secondAmount: secondTokenVolume,
      })
    );
  };

  const findOtherLiquidPoolTokens = () => {};

  useEffect(() => {
    setStep(1);
  }, [isAddLiquidModalOpen]);

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
    firstToken,
    secondToken,
    continueAvailable,
    isAddLiquidModalOpen,
    firstTokenVolume,
    secondTokenVolume,
    primaryButtonLabel,
    closeModal,
    removeLiquidity,
    handleAddLiquidity,
    handlerStepToStep,
    closeModalAndDashboard,
    onSelectFirstCurrency,
    onSelectSecondCurrency,
    findOtherLiquidPoolTokens,
    onChangeFirstTokenAmount,
    onChangeSecondTokenAmount,
  };
};

export default useAddLiquidFacade;

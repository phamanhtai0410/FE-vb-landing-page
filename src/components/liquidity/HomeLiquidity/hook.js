import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as actions from "../../../actions";
import {
  selectApprovingState,
  selectPoolApproval,
  selectRemovingFinishState,
  selectRemovingState,
} from "../../../reducers/removeLiquidity.reducer";
import { selectUsersAddedPoolAddresses } from "../../../reducers/userAssetPools.reducer";
import { selectWeb3 } from "../../../reducers/web3.reducer";

const useLiquidityFacade = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {web3} = useSelector(selectWeb3, shallowEqual);
  const userPoolAddresses = useSelector(selectUsersAddedPoolAddresses);
  const isApproving = useSelector(selectApprovingState);
  const approvePoolState = useSelector(selectPoolApproval);
  const isRemoving = useSelector(selectRemovingState);
  const removePoolSuccessState = useSelector(selectRemovingFinishState);

  const [step, setStep] = useState(1);
  const [enableBtnLabel, setEnableBtnLabel] = useState("Enable");
  const [amountPercentage, setAmountPercentage] = useState(0);
  const [continueAvailable, setContinueAvailable] = useState(false);
  const [primaryButtonLabel, setPrimaryButtonLabel] =
    useState("Enter an amount");

  const isEnableBtnEnabled = useMemo(() => {
    return amountPercentage !== 0 && !isApproving && approvePoolState === 0;
  }, [amountPercentage, isApproving, approvePoolState]);

  const removeAvailable = useMemo(() => {
    return amountPercentage !== 0 && approvePoolState !== 0;
  }, [amountPercentage, approvePoolState]);

  const closeModal = () => {
    navigate(-1);
  };

  const resetFrm = () => {
    setStep(1);
    setContinueAvailable(false);
    setAmountPercentage(0);
    setPrimaryButtonLabel("Enter an amount");
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
      setPrimaryButtonLabel("Confirm");
    }
  };

  const addLiquidity = () => {
    navigate("/liquidity/add");
  }

  useEffect(() => {
    if (!isApproving) {
      if (approvePoolState === 0) {
        setEnableBtnLabel("Enable");
      } else {
        setEnableBtnLabel("Enabled");
        setContinueAvailable(true);
      }
    } else {
      setEnableBtnLabel("Enabling...");
    }
  }, [isApproving, approvePoolState]);

  useEffect(() => {
    if (web3) {
      fetchPoolAssets();
    }
  }, [web3]);

  async function fetchPoolAssets() {
    await dispatch(actions.getPoolAssets());
  }

  useEffect(() => {
    if (step === 3 && !isRemoving) {
      if (removePoolSuccessState === false) {
        // User decline or adding liquidity failed
        setStep(2);
      } else if (removePoolSuccessState === true) {
        setPrimaryButtonLabel("Close");
        setStep(4);
      }
    }
  }, [isRemoving, removePoolSuccessState, step]);

  return {
    step,
    userPoolAddresses,
    enableBtnLabel,
    removeAvailable,
    isEnableBtnEnabled,
    continueAvailable,
    primaryButtonLabel,
    closeModal,
    addLiquidity,
    handlerStepToStep,
    closeModalAndDashboard,
  };
};

export default useLiquidityFacade;

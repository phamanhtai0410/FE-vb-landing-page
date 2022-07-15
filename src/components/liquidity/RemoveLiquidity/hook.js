import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as actions from "../../../actions";
import { selectAssetByAddress } from "../../../reducers/assetsMarket.reducer";
import { selectPoolInfoByAddress } from "../../../reducers/assetsPool.reducer";
import { selectPriceByTokenAddress } from "../../../reducers/assetsPrice.reducer";
import {
  selectAddressTokenA,
  selectAddressTokenB,
  selectAmountTokenA,
  selectAmountTokenB,
  selectApprovingState,
  selectFirstTokenExchangeRate,
  selectPoolApproval,
  selectRemoveTransactionId,
  selectRemovingFinishState,
  selectRemovingState,
  selectSecondTokenExchangeRate,
} from "../../../reducers/removeLiquidity.reducer";
import { selectWeb3 } from "../../../reducers/web3.reducer";

const useRemoveLiquidFacade = () => {
  const dispatch = useDispatch();
  const { addressPool: poolAddress } = useParams();
  const navigation = useNavigate();

  const web3 = useSelector(selectWeb3);
  const txid = useSelector(selectRemoveTransactionId);
  const isApproving = useSelector(selectApprovingState);
  const approvePoolState = useSelector(selectPoolApproval);
  const isRemoving = useSelector(selectRemovingState);
  const removePoolSuccessState = useSelector(selectRemovingFinishState);
  const firstTokenAddress = useSelector(selectAddressTokenA);
  const firstTokenInfo = useSelector((state) =>
    selectAssetByAddress(state, firstTokenAddress)
  );
  const firstTokenAmount = useSelector(selectAmountTokenA);
  // const firstTokenPrice = useSelector((state) =>
  //   selectPriceByTokenAddress(state, firstTokenAddress)
  // );
  const secondTokenAddress = useSelector(selectAddressTokenB);
  const secondTokenInfo = useSelector((state) =>
    selectAssetByAddress(state, secondTokenAddress)
  );
  const secondTokenAmount = useSelector(selectAmountTokenB);
  // const secondTokenPrice = useSelector((state) =>
  //   selectPriceByTokenAddress(state, secondTokenAddress)
  // );

  const firstPerSecondTokenExchangeRate = useSelector(selectFirstTokenExchangeRate);

  // useMemo(
  //   () => nFormatter(firstTokenPrice / secondTokenPrice, 5),
  //   [firstTokenPrice, secondTokenPrice]
  // );
  const secondPerFirstTokenExchangeRate = useSelector(selectSecondTokenExchangeRate);

  // useMemo(
  //   () => nFormatter(secondTokenPrice / firstTokenPrice, 5),
  //   [firstTokenPrice, secondTokenPrice]
  // );

  const [step, setStep] = useState(1);
  const [enableBtnLabel, setEnableBtnLabel] = useState("Enable");
  const [amountPercentage, setAmountPercentage] = useState(0);
  const [continueAvailable, setContinueAvailable] = useState(false);
  const [primaryButtonLabel, setPrimaryButtonLabel] =
    useState("Enter an amount");

  const amountTokenA = useMemo(() => {
    return firstTokenAmount * (amountPercentage / 100.0) || 0;
  }, [firstTokenAmount, amountPercentage]);

  const amountTokenB = useMemo(() => {
    return secondTokenAmount * (amountPercentage / 100.0) || 0;
  }, [secondTokenAmount, amountPercentage]);

  const isEnableBtnEnabled = useMemo(() => {
    return amountPercentage !== 0 && !isApproving && approvePoolState === 0;
  }, [amountPercentage, isApproving, approvePoolState]);

  const removeAvailable = useMemo(() => {
    return amountPercentage !== 0 && approvePoolState !== 0;
  }, [amountPercentage, approvePoolState]);

  const closeModal = () => {
    navigation(-1);
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

    if (step === 2) {
      setStep(3);
      removeLiquidity();
    }
  };

  const removeLiquidity = () => {
    dispatch(
      actions.removeLiquidity({
        amount: amountPercentage,
        poolAddress,
        amountTokenA,
        amountTokenB,
        tokenAInfo: firstTokenInfo,
        tokenBInfo: secondTokenInfo,
      })
    );
  };

  const onSelectMileStone = (percentage) => {
    setAmountPercentage(percentage);
  };

  const onEnableClicked = async () => {
    await dispatch(
      actions.approvePoolLiquidity({
        poolAddress,
        addressTokenA: firstTokenAddress,
        addressTokenB: secondTokenAddress,
        tokenAInfo: firstTokenInfo,
        tokenBInfo: secondTokenInfo,
      })
    );
  };

  useEffect(() => {
    if (amountPercentage !== 0) {
      setPrimaryButtonLabel("Remove");
    } else {
      setPrimaryButtonLabel("Enter an amount");
    }
  }, [amountPercentage]);

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
    if (poolAddress && web3) {
      dispatch(actions.loadDetailRemoveLiquidity(poolAddress));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolAddress, web3]);

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
    txid,
    firstTokenInfo,
    secondTokenInfo,
    amountTokenA,
    amountTokenB,
    enableBtnLabel,
    firstPerSecondTokenExchangeRate,
    secondPerFirstTokenExchangeRate,
    removeAvailable,
    isEnableBtnEnabled,
    amountPercentage,
    continueAvailable,
    primaryButtonLabel,
    closeModal,
    onEnableClicked,
    removeLiquidity,
    onSelectMileStone,
    handlerStepToStep,
    closeModalAndDashboard,
  };
};

export default useRemoveLiquidFacade;

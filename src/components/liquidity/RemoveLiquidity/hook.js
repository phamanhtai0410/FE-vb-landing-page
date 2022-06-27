import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as actions from "../../../actions";
import { selectPoolInfoByAddress } from "../../../reducers/assetsPool.reducer";
import { selectPriceByTokenAddress } from "../../../reducers/assetsPrice.reducer";
import {
  selectApprovingState,
  selectPoolApproval,
  selectRemovingFinishState,
  selectRemovingState,
} from "../../../reducers/removeLiquidity.reducer";
import { selectWeb3 } from "../../../reducers/web3.reducer";
import { nFormatter } from "../../../utils/lib";

const useRemoveLiquidFacade = () => {
  const dispatch = useDispatch();
  const { addressPool: poolAddress } = useParams();
  const navigation = useNavigate();

  const web3 = useSelector(selectWeb3);
  const poolData = useSelector((state) =>
    selectPoolInfoByAddress(state, poolAddress)
  );
  const firstTokenPrice = useSelector((state) =>
    selectPriceByTokenAddress(state, poolData?.addressTokenA)
  );
  const secondTokenPrice = useSelector((state) =>
    selectPriceByTokenAddress(state, poolData?.addressTokenB)
  );
  const isApproving = useSelector(selectApprovingState);
  const approvePoolState = useSelector(selectPoolApproval);
  const isRemoving = useSelector(selectRemovingState);
  const removePoolSuccessState = useSelector(selectRemovingFinishState);

  const firstPerSecondTokenPrice = useMemo(
    () => nFormatter(firstTokenPrice / secondTokenPrice, 5),
    [firstTokenPrice, secondTokenPrice]
  );
  const secondPerFirstTokenPrice = useMemo(
    () => nFormatter(secondTokenPrice / firstTokenPrice, 5),
    [firstTokenPrice, secondTokenPrice]
  );

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
    navigation(-1)
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
      // setTimeout(() => {
      //   setStep(4);
      //   setPrimaryButtonLabel("Close");
      // }, 2000);
    }
  };

  const removeLiquidity = () => {
    dispatch(
      actions.removeLiquidity({ amount: amountPercentage, poolAddress })
    );
  };

  const onSelectMileStone = (percentage) => {
    setAmountPercentage(percentage);
  };

  const onEnableClicked = async () => {
    await dispatch(actions.approvePoolLiquidity(poolAddress));
  };

  const loadPoolApproval = async () => {
    dispatch(actions.loadDetailRemoveLiquidity(poolAddress));
  };

  useEffect(() => {
    if (web3) {
      fetchMarketAssets();
    }
  }, [web3]);

  async function fetchMarketAssets() {
    await dispatch(actions.getPoolAssets());
  }

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
    if (poolAddress) {
      loadPoolApproval();
    }
  }, [poolAddress]);

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

  useEffect(
    () => () => {
      // On unmount
      closeModalAndDashboard();
    },
    []
  );

  return {
    step,
    poolData,
    enableBtnLabel,
    firstPerSecondTokenPrice,
    secondPerFirstTokenPrice,
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

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import * as actions from "../../../actions";
import { selectAssetByAddress } from "../../../reducers/assetsMarket.reducer";
import { selectPriceByTokenAddress } from "../../../reducers/assetsPrice.reducer";
import { selectPoolInfoByAddress } from "../../../reducers/assetsPool.reducer";
import {
  selectAddingLiquidityFinishState,
  selectAddingLiquidityState,
  selectApproveFirstToken,
  selectApproveSecondToken,
  selectFirstToken,
  selectSecondToken,
} from "../../../reducers/liquid.reducer";
import { nFormatter } from "../../../utils/lib";
import { selectBalanceById } from "../../../reducers/accountBalance.reducer";

const useAddLiquidFacade = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addressPool: poolAddress } = useParams();

  const poolInfo = useSelector((state) =>
    selectPoolInfoByAddress(state, poolAddress)
  );
  const firstToken = useSelector(selectFirstToken, shallowEqual);
  const secondToken = useSelector(selectSecondToken, shallowEqual);
  const isAddingLiquidity = useSelector(selectAddingLiquidityState);
  const addLiquidityState = useSelector(selectAddingLiquidityFinishState);
  const approveFirstToken = useSelector(selectApproveFirstToken);
  const approveSecondToken = useSelector(selectApproveSecondToken);
  const firstTokenInfo = useSelector((state) =>
    selectAssetByAddress(state, firstToken)
  );
  const secondTokenInfo = useSelector((state) =>
    selectAssetByAddress(state, secondToken)
  );
  const firstTokenBalance = useSelector((state) =>
    selectBalanceById(state, firstToken)
  );
  const secondTokenBalance = useSelector((state) =>
    selectBalanceById(state, secondToken)
  );
  const firstTokenPrice = useSelector((state) =>
    selectPriceByTokenAddress(state, firstToken)
  );
  const secondTokenPrice = useSelector((state) =>
    selectPriceByTokenAddress(state, secondToken)
  );

  const firstPerSecondTokenPrice = useMemo(
    () => nFormatter(firstTokenPrice / secondTokenPrice, 6),
    [firstTokenPrice, secondTokenPrice]
  );
  const secondPerFirstTokenPrice = useMemo(
    () => nFormatter(secondTokenPrice / firstTokenPrice, 6),
    [firstTokenPrice, secondTokenPrice]
  );

  const [step, setStep] = useState(1);
  const [continueAvailable, setContinueAvailable] = useState(false);
  const [firstTokenVolume, setFirstTokenVolume] = useState("");
  const [secondTokenVolume, setSecondTokenVolume] = useState("");
  const [primaryButtonLabel, setPrimaryButtonLabel] = useState("Invalid pair");

  const onSelectFirstCurrency = useCallback(
    (e) => {
      dispatch(actions.selectFirstToken());
    },
    [dispatch]
  );
  const onSelectSecondCurrency = useCallback(
    (e) => {
      dispatch(actions.selectSecondToken());
    },
    [dispatch]
  );

  const onChangeFirstTokenAmount = useCallback(
    (value) => {
      const secondTokenAmount = value * firstPerSecondTokenPrice;
      if (value <= firstTokenBalance && secondTokenAmount <= secondTokenBalance) {
        setFirstTokenVolume(value);
        // setSecondTokenVolume(secondTokenAmount);
      }
    },
    [firstPerSecondTokenPrice, firstTokenBalance, secondTokenBalance]
  );

  const onChangeSecondTokenAmount = useCallback(
    (value) => {
      const firstTokenAmount = value * secondPerFirstTokenPrice;
      if (value <= secondTokenBalance && firstTokenAmount <= firstTokenBalance) {
        setSecondTokenVolume(value);
        // setFirstTokenVolume(value * secondPerFirstTokenPrice);
      }
    },
    [secondPerFirstTokenPrice, firstTokenBalance, secondTokenBalance]
  );

  const closeModal = () => {
    navigate(-1);
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
      handleAddLiquidity();
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

  useEffect(() => {
    if (step === 3 && !isAddingLiquidity) {
      if (addLiquidityState === false) {
        // User decline or adding liquidity failed
        setStep(2);
      } else if (addLiquidityState === true) {
        setPrimaryButtonLabel("+ Add Liquidity");
        setStep(4);
      }
    }
  }, [isAddingLiquidity, addLiquidityState, step]);

  useEffect(() => {
    if (dispatch && poolInfo) {
      dispatch(actions.setFirstToken(poolInfo?.addressTokenA));
      dispatch(actions.setSecondToken(poolInfo?.addressTokenB));
    }
  }, [dispatch, poolInfo]);

  return {
    step,
    firstToken,
    secondToken,
    continueAvailable,
    firstTokenVolume,
    secondTokenVolume,
    primaryButtonLabel,
    approveFirstToken,
    approveSecondToken,
    firstTokenInfo,
    secondTokenInfo,
    firstPerSecondTokenPrice,
    secondPerFirstTokenPrice,
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

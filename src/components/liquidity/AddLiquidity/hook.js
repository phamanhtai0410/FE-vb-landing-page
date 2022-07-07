import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as actions from "../../../actions";
import { selectAssetByAddress } from "../../../reducers/assetsMarket.reducer";
import { selectPoolInfoByAddress } from "../../../reducers/assetsPool.reducer";
import {
  selectAddingLiquidityFinishState,
  selectAddingLiquidityState,
  selectApproveFirstToken,
  selectApproveSecondToken,
  selectFirstToken,
  selectFirstTokenExchangeRate,
  selectTotalSupply,
  selectSecondToken,
  selectSecondTokenExchangeRate,
  selectReserveA,
  selectReserveB,
  selectLiquidityPool,
} from "../../../reducers/liquid.reducer";
import { nFormatter } from "../../../utils/lib";
import { selectBalanceById } from "../../../reducers/accountBalance.reducer";
import RouteName from "../../../constants/routeName.constants";

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

  const userCurrentLiquidityPool = useSelector(selectLiquidityPool);
  const totalSupply = useSelector(selectTotalSupply);
  const reserveB = useSelector(selectReserveA);
  const reserveA = useSelector(selectReserveB);

  // const firstTokenPrice = useSelector((state) =>
  //   selectPriceByTokenAddress(state, firstToken)
  // );
  // const secondTokenPrice = useSelector((state) =>
  //   selectPriceByTokenAddress(state, secondToken)
  // );

  const [step, setStep] = useState(1);
  const [continueAvailable, setContinueAvailable] = useState(false);
  const [firstTokenVolume, setFirstTokenVolume] = useState("");
  const [secondTokenVolume, setSecondTokenVolume] = useState("");
  const [primaryButtonLabel, setPrimaryButtonLabel] = useState("Invalid pair");

  const firstPerSecondTokenExchangeRate =
    useSelector(selectFirstTokenExchangeRate) ||
    secondTokenVolume / firstTokenVolume;

  // useMemo(
  //   () => nFormatter(firstTokenPrice / secondTokenPrice, 6),
  //   [firstTokenPrice, secondTokenPrice]
  // );
  const secondPerFirstTokenExchangeRate =
    useSelector(selectSecondTokenExchangeRate) ||
    firstTokenVolume / secondTokenVolume;

  const liquidityEstimated = useMemo(() => {
    if (totalSupply === 0 || totalSupply === 0.0) {
      console.log("🐶🐶  ~ liquidityEstimated ~ totalSupply", totalSupply);
      console.log(
        "🐶🐶  ~ useAddLiquidFacade ~ firstTokenVolume",
        firstTokenVolume
      );
      console.log(
        "🐶🐶  ~ liquidityEstimated ~ Number(process.env.MINIMUM_LIQUIDITY)",
        process.env.REACT_APP_MINIMUM_LIQUIDITY
      );
      return (
        Math.sqrt(firstTokenVolume * secondTokenVolume) -
        Number(process.env.REACT_APP_MINIMUM_LIQUIDITY)
      );
    }
    return Math.min(
      (firstTokenVolume * totalSupply) / reserveA,
      (secondTokenVolume * totalSupply) / reserveB
    );
  }, [totalSupply, firstTokenVolume, reserveA, secondTokenVolume, reserveB]);
  console.log(
    "🐶🐶  ~ liquidityEstimated ~ liquidityEstimated",
    liquidityEstimated
  );

  const shareAPool = useMemo(
    () =>
      ((liquidityEstimated + Number(userCurrentLiquidityPool)) * 100.0) /
      (Number(totalSupply) + liquidityEstimated),
    [liquidityEstimated, totalSupply, userCurrentLiquidityPool]
  );

  // useMemo(
  //   () => nFormatter(secondTokenPrice / firstTokenPrice, 6),
  //   [firstTokenPrice, secondTokenPrice]
  // );

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
      if (totalSupply === 0) {
        setFirstTokenVolume(value);
      } else {
        const secondTokenAmount = value * firstPerSecondTokenExchangeRate;
        // if (
        //   value <= firstTokenBalance &&
        //   secondTokenAmount <= secondTokenBalance
        // ) {
        // if (value <= firstTokenBalance) {
        setFirstTokenVolume(value);
        setSecondTokenVolume(secondTokenAmount);
        // }
      }
    },
    [firstPerSecondTokenExchangeRate, totalSupply]
  );

  const onChangeSecondTokenAmount = useCallback(
    (value) => {
      if (totalSupply === 0) {
        setSecondTokenVolume(value);
      } else {
        const firstTokenAmount = value * secondPerFirstTokenExchangeRate;
        // if (
        //   value <= secondTokenBalance &&
        //   firstTokenAmount <= firstTokenBalance
        // ) {
        // if (value <= secondTokenBalance) {
        setSecondTokenVolume(value);
        setFirstTokenVolume(firstTokenAmount);
        // }
      }
    },
    [totalSupply, secondPerFirstTokenExchangeRate]
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
      dispatch(actions.loadDetailAddLiquidity(poolAddress));
      setStep(2);
      setPrimaryButtonLabel("Confirm Supply");
    }

    if (step === 2) {
      setStep(3);
      handleAddLiquidity();
    }
  };

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
        } else if (
          firstTokenVolume > firstTokenBalance ||
          secondTokenVolume > secondTokenBalance
        ) {
          setContinueAvailable(false);
          setPrimaryButtonLabel("Balance not available");
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
        navigate(RouteName.LIQUIDITY);
      }
    }
  }, [isAddingLiquidity, addLiquidityState, step, navigate]);

  useEffect(() => {
    if (dispatch && poolInfo) {
      dispatch(actions.setFirstToken(poolInfo?.addressTokenA));
      dispatch(actions.setSecondToken(poolInfo?.addressTokenB));
    }
    return () => {
      resetFrm();
      dispatch(actions.clearSelectedTokens());
    };
  }, [dispatch, poolInfo]);

  useEffect(() => {
    dispatch(actions.loadDetailAddLiquidity(poolAddress));
  }, [dispatch, poolAddress]);

  return {
    step,
    shareAPool,
    liquidityEstimated,
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
    firstPerSecondTokenExchangeRate,
    secondPerFirstTokenExchangeRate,
    closeModal,
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

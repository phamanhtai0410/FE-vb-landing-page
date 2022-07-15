import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectDesireToken,
  selectSourceToken,
  // swapTokenDesire,
  openModalSelectToken,
  selectExchangeRate,
  selectIsSwap,
  selectPairsFee,
  selectLoadingFee,
  selectAmountsOut,
  selectAmountsIn,
  selectLoadingGetAmountOut,
  selectLoadingGetAmountIn,
  selectAccountApprove,
  selectLoadingSwap,
  selectLoadingExchangeRate,
} from "../../reducers/swap.reducer";
import { selectAssetByAddress } from "../../reducers/assetsMarket.reducer";
import { selectPriceByTokenAddress } from "../../reducers/assetsPrice.reducer";
import { useMemo } from "react";
import { selectBalanceById } from "../../reducers/accountBalance.reducer";
import { selectAccount } from "../../reducers/web3.reducer";
import * as actions from "../../actions";
import {
  checkApproveToken,
  checkAssetExistsPools,
  checkTotalSupplyAvailable,
  getAmountsIn,
  getAmountsOut,
  getPairsFee,
  onApproveTokenForAccount,
} from "../../actions";
import { useDebouncedCallback } from "use-debounce";

const useSwapFacade = () => {
  const dispatch = useDispatch();
  const account = useSelector(selectAccount);
  const [inputAmountIn, setInputAmountIn] = useState("");
  const [inputAmountOut, setInputAmountOut] = useState("");
  const [inputSlippage, setInputSlippage] = useState(0.1);
  const [pressSwap, setPressSwap] = useState(false);
  const [showErr, setShowErr] = useState(false);
  // const [userInput, setUserInput] = useState("");
  const userInputRef = useRef(inputAmountIn);
  const amountInRef = useRef(inputAmountIn);
  const amountOutRef = useRef(inputAmountOut);

  const sourceTokenAddress = useSelector(selectSourceToken);
  const desireTokenAddress = useSelector(selectDesireToken);

  const exchangeRate = useSelector(selectExchangeRate);
  const isSwap = useSelector(selectIsSwap);
  const fee = useSelector(selectPairsFee);
  const loadingFee = useSelector(selectLoadingFee);
  const loadingSwap = useSelector(selectLoadingSwap);
  const loadingGetAmountOut = useSelector(selectLoadingGetAmountOut);
  const loadingGetAmountIn = useSelector(selectLoadingGetAmountIn);
  const amountsOut = useSelector(selectAmountsOut);
  const amountsIn = useSelector(selectAmountsIn);
  const accountApprove = useSelector(selectAccountApprove);
  const loadingExchangeRate = useSelector(selectLoadingExchangeRate);

  const sourceTokenInfo = useSelector((state) =>
    selectAssetByAddress(state, sourceTokenAddress)
  );
  const desireTokenInfo = useSelector((state) =>
    selectAssetByAddress(state, desireTokenAddress)
  );
  const sourceTokenPrice = useSelector((state) =>
    selectPriceByTokenAddress(state, sourceTokenAddress)
  );
  const desireTokenPrice = useSelector((state) =>
    selectPriceByTokenAddress(state, desireTokenAddress)
  );
  const sourceTokenBalance = useSelector((state) =>
    selectBalanceById(state, sourceTokenAddress)
  );
  const desireTokenBalance = useSelector((state) =>
    selectBalanceById(state, desireTokenAddress)
  );
  const vthoBalance = useSelector((state) =>
    selectBalanceById(state, process.env.REACT_APP_TOKEN_VTHO)
  );

  const swapFee = useMemo(
    () => (inputAmountIn * (fee * 0.1)) / 100,
    [fee, inputAmountIn]
  );

  const sourcePerDesireTokenPrice = useMemo(
    () => sourceTokenPrice / desireTokenPrice,
    [sourceTokenPrice, desireTokenPrice]
  );
  const desireTokenAmount = useMemo(
    () => inputAmountIn * exchangeRate,
    [inputAmountIn, exchangeRate]
  );

  const desirePerSourceTokenPrice = useMemo(
    () => desireTokenPrice / sourceTokenPrice,
    [sourceTokenPrice, desireTokenPrice]
  );
  const sourceTokenAmount = useMemo(
    () => inputAmountOut * desirePerSourceTokenPrice,
    [inputAmountOut, desirePerSourceTokenPrice]
  );

  const amountOutMin = useMemo(
    () => inputAmountOut - (inputAmountOut * inputSlippage) / 100,
    [inputAmountOut, inputSlippage]
  );

  const onSwapDesireToken = () => {
    setPressSwap(true);
    dispatch(actions.swapTokenDesire());
  };

  const onSwapAssetToken = () => {
    dispatch(
      actions.swapAsset({
        amountInToSwap: inputAmountIn,
        minAmountOut: amountOutMin,
        tokenAInfo: sourceTokenInfo,
        tokenBInfo: desireTokenInfo,
      })
    );
  };

  const onApproveToken = () => {
    dispatch(
      onApproveTokenForAccount({
        tokenInfo: sourceTokenInfo,
      })
    );
  };

  const onShowModalSelectToken = (nameToken) => {
    dispatch(openModalSelectToken(nameToken));
  };

  const checkBalance = useCallback(
    (amount) => {
      if (parseFloat(amount) > sourceTokenBalance) {
        setShowErr(true);
        setInputAmountIn(amount);
      } else {
        setShowErr(false);
        setInputAmountIn(amount);
      }
    },
    [sourceTokenBalance]
  );

  const getAmountOutDebounced = useDebouncedCallback((value) => {
    dispatch(
      getAmountsOut({
        inputAmountIn: value,
        tokenAInfo: sourceTokenInfo,
        tokenBInfo: desireTokenInfo,
      })
    );
  }, 1000);

  const getAmountsInDebounced = useDebouncedCallback((value) => {
    dispatch(
      getAmountsIn({
        inputAmountOut: value,
        tokenAInfo: sourceTokenInfo,
        tokenBInfo: desireTokenInfo,
      })
    );
  }, 1000);

  const onChangeSourceInput = useCallback(
    (value) => {
      userInputRef.current = value;
      checkBalance(value);
      if (value !== "") {
        getAmountOutDebounced(value);
      } else {
        setInputAmountOut("");
      }
      // setInputAmountOut(value !== "" ? value * exchangeRate : "");
      // dispatch(
      //   getPairsFee({
      //     tokenAInfo: sourceTokenInfo,
      //     tokenBInfo: desireTokenInfo,
      //   })
      // );
    },
    [checkBalance, getAmountOutDebounced]
  );

  const onChangeDesireInput = useCallback(
    (value) => {
      userInputRef.current = value;
      setInputAmountOut(value);
      if (value !== "") {
        getAmountsInDebounced(value);
      } else {
        setInputAmountIn("");
      }
      // setInputAmountIn(value !== "" ? value * desirePerSourceTokenPrice : "");
      // dispatch(
      //   getPairsFee({
      //     tokenAInfo: sourceTokenInfo,
      //     tokenBInfo: desireTokenInfo,
      //   })
      // );
    },
    [getAmountsInDebounced]
  );

  useEffect(() => {
    dispatch(
      checkAssetExistsPools({
        tokenAInfo: sourceTokenInfo,
        tokenBInfo: desireTokenInfo,
      })
    );
    dispatch(
      getPairsFee({
        tokenAInfo: sourceTokenInfo,
        tokenBInfo: desireTokenInfo,
      })
    );
  }, [sourceTokenAddress, desireTokenAddress]);

  useEffect(() => {
    dispatch(
      checkApproveToken({
        tokenInfo: sourceTokenInfo,
      })
    );
  }, [dispatch, sourceTokenInfo, account]);

  useEffect(() => {
    if (pressSwap) {
      amountInRef.current = inputAmountOut;
      if (amountInRef.current === userInputRef.current) {
        setInputAmountIn(userInputRef.current);
        setInputAmountOut("");
        getAmountOutDebounced(userInputRef.current);
      }
      setPressSwap(false);
    } else {
      getAmountOutDebounced(inputAmountIn);
    }
  }, [sourceTokenAddress]);

  useEffect(() => {
    if (pressSwap) {
      amountOutRef.current = inputAmountIn;
      if (amountOutRef.current === userInputRef.current) {
        setInputAmountOut(userInputRef.current);
        setInputAmountIn("");
        getAmountsInDebounced(userInputRef.current);
      }
      setPressSwap(false);
    } else {
      getAmountOutDebounced(inputAmountIn);
    }
  }, [desireTokenAddress]);

  useEffect(() => {
    setInputAmountOut(amountsOut);
  }, [amountsOut]);

  useEffect(() => {
    checkBalance(amountsIn);
    dispatch(checkTotalSupplyAvailable());
  }, [amountsIn, dispatch]);

  return {
    isSwap,
    showErr,
    swapFee,
    account,
    loadingFee,
    amountOutMin,
    userInputRef,
    inputAmountOut,
    sourceTokenAddress,
    desireTokenAddress,
    sourceTokenInfo,
    desireTokenInfo,
    sourceTokenPrice,
    desireTokenPrice,
    sourceTokenBalance,
    desireTokenBalance,
    vthoBalance,
    sourcePerDesireTokenPrice,
    exchangeRate,
    desireTokenAmount,
    setInputAmountOut,
    onSwapAssetToken,
    onSwapDesireToken,
    onShowModalSelectToken,
    inputSlippage,
    setInputSlippage,
    inputAmountIn,
    setInputAmountIn,
    sourceTokenAmount,
    onChangeDesireInput,
    onChangeSourceInput,
    loadingGetAmountIn,
    loadingGetAmountOut,
    accountApprove,
    onApproveToken,
    loadingSwap,
    loadingExchangeRate,
  };
};

export default useSwapFacade;

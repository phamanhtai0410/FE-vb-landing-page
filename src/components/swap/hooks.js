import { useCallback, useEffect, useState } from "react";
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
  getAmountsIn,
  getAmountsOut,
  getPairsFee,
  onApproveTokenForAccount,
} from "../../actions";

const useSwapFacade = () => {
  const dispatch = useDispatch();
  const account = useSelector(selectAccount);
  const [inputAmountIn, setInputAmountIn] = useState("");
  const [inputAmountOut, setInputAmountOut] = useState("");
  const [inputSlippage, setInputSlippage] = useState("0.1");
  const [pressSwap, setPressSwap] = useState(false);
  const [showErr, setShowErr] = useState(false);

  const sourceTokenAddress = useSelector(selectSourceToken);
  const desireTokenAddress = useSelector(selectDesireToken);

  const exchangeRate = useSelector(selectExchangeRate);
  const isSwap = useSelector(selectIsSwap);
  const swapFee = useSelector(selectPairsFee);
  const loadingFee = useSelector(selectLoadingFee);
  const loadingSwap = useSelector(selectLoadingSwap);
  const loadingGetAmountOut = useSelector(selectLoadingGetAmountOut);
  const loadingGetAmountIn = useSelector(selectLoadingGetAmountIn);
  const amountsOut = useSelector(selectAmountsOut);
  const amountsIn = useSelector(selectAmountsIn);
  const accountApprove = useSelector(selectAccountApprove);

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

  const checkBalance = (amount) => {
    if (parseInt(amount) > sourceTokenBalance) {
      setShowErr(true);
      setInputAmountIn(amount);
    } else {
      setShowErr(false);
      setInputAmountIn(amount);
    }
  };

  const onChangeSourceInput = useCallback(
    (value) => {
      checkBalance(value);
      if (value !== "") {
        dispatch(
          getAmountsOut({
            inputAmountIn: value,
            tokenAInfo: sourceTokenInfo,
            tokenBInfo: desireTokenInfo,
          })
        );
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
    [desireTokenInfo, dispatch, sourceTokenBalance, sourceTokenInfo]
  );

  const onChangeDesireInput = useCallback(
    (value) => {
      setInputAmountOut(value);
      if (value !== "") {
        dispatch(
          getAmountsIn({
            inputAmountOut: value,
            tokenAInfo: sourceTokenInfo,
            tokenBInfo: desireTokenInfo,
          })
        );
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
    [desireTokenInfo, dispatch, sourceTokenInfo]
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
  }, [dispatch, sourceTokenInfo]);

  useEffect(() => {
    if (pressSwap) {
      checkBalance(inputAmountOut);
      // setInputAmountIn(inputAmountOut);
      setPressSwap(false);
    } else {
      setInputAmountOut(
        inputAmountIn !== "" ? inputAmountIn * exchangeRate : ""
      );
    }
  }, [sourceTokenAddress, exchangeRate]);

  useEffect(() => {
    if (pressSwap) {
      setInputAmountOut(inputAmountIn);
      setPressSwap(false);
    } else {
      setInputAmountOut(
        inputAmountIn !== "" ? inputAmountIn * exchangeRate : ""
      );
    }
  }, [desireTokenAddress, exchangeRate]);

  useEffect(() => {
    setInputAmountOut(amountsOut);
  }, [amountsOut]);

  useEffect(() => {
    checkBalance(amountsIn);
    // setInputAmountIn(amountsIn);
  }, [amountsIn]);

  return {
    isSwap,
    showErr,
    swapFee,
    account,
    loadingFee,
    amountOutMin,
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
  };
};

export default useSwapFacade;

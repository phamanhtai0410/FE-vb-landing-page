import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectDesireToken,
  selectSourceToken,
  // swapTokenDesire,
  openModalSelectToken,
} from "../../reducers/swap.reducer";
import { selectAssetByAddress } from "../../reducers/assetsMarket.reducer";
import { selectPriceByTokenAddress } from "../../reducers/assetsPrice.reducer";
import { useMemo } from "react";
import { selectBalanceById } from "../../reducers/accountBalance.reducer";
import { selectAccount } from "../../reducers/web3.reducer";
import * as actions from "../../actions";

const useSwapFacade = () => {
  const dispatch = useDispatch();
  const account = useSelector(selectAccount);
  const [inputAmount, setInputAmount] = useState("");
  const [inputAmountIn, setInputAmountIn] = useState("");
  const [inputSlippage, setInputSlippage] = useState("0.1");

  const sourceTokenAddress = useSelector(selectSourceToken);
  const desireTokenAddress = useSelector(selectDesireToken);

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
    () => inputAmount * sourcePerDesireTokenPrice,
    [inputAmount, sourcePerDesireTokenPrice]
  );

  const desirePerSourceTokenPrice = useMemo(
    () => desireTokenPrice / sourceTokenPrice,
    [sourceTokenPrice, desireTokenPrice]
  );
  const sourceTokenAmount = useMemo(
    () => inputAmountIn * desirePerSourceTokenPrice,
    [inputAmountIn, desirePerSourceTokenPrice]
  );

  const onSwapDesireToken = () => {
    dispatch(actions.swapTokenDesire());
  };

  const onSwapAssetToken = () => {
    dispatch(
      actions.swapAsset({
        amountToSwap: inputAmount,
        amountOutMinIn: (desireTokenAmount * inputSlippage) / 100,
        tokenAInfo: sourceTokenInfo,
        tokenBInfo: desireTokenInfo,
      })
    );
  };

  const onShowModalSelectToken = (nameToken) => {
    dispatch(openModalSelectToken(nameToken));
  };

  const onChangeSourceInput = useCallback(
    (value) => {
      setInputAmount(value);
      setInputAmountIn(value !== "" ? value * sourcePerDesireTokenPrice : "");
    },
    [sourcePerDesireTokenPrice]
  );

  const onChangeDesireInput = useCallback(
    (value) => {
      setInputAmountIn(value);
      setInputAmount(value !== "" ? value * desirePerSourceTokenPrice : "");
    },
    [desirePerSourceTokenPrice]
  );

  return {
    account,
    inputAmount,
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
    desireTokenAmount,
    setInputAmount,
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
  };
};

export default useSwapFacade;

import React, { useState } from "react";
import TradeChart from "../components/trade/TradeChart";
import Swap from "../components/swap/Swap";
import IcVeBank from "../assets/images/ic_vebank.svg";
import IcVThor from "../assets/images/ic_vtho.svg";
import IcVeUSD from "../assets/images/ic_veusd.svg";
import IcVeChain from "../assets/images/ic_vechain.svg";

const COIN_TYPES = [
  {
    symbol: "VB",
    icon: IcVeBank,
    price: 10,
  },
  {
    symbol: "VTHO",
    icon: IcVThor,
    price: 20,
  },
  {
    symbol: "VEUSD",
    icon: IcVeUSD,
    price: 1,
  },
  {
    symbol: "VET",
    icon: IcVeChain,
    price: 15,
  },
];

const SwapPage = () => {
  const [swapToken, setSwapToken] = useState({
    from: {
      symbol: COIN_TYPES[0].symbol,
      icon: COIN_TYPES[0].icon,
      price: COIN_TYPES[0].price,
    },
    to: {
      symbol: COIN_TYPES[1].symbol,
      icon: COIN_TYPES[1].icon,
      price: COIN_TYPES[1].price,
    },
  });

  return (
    <section className="box-borrows mx-auto bg-cover bg-center">
      <div className="w-full h-full pb-9 min-h-screen flex items-center justify-center bg-content -z-50">
        <div className="w-full md:w-[568px] p-2">
          <div className="rounded-md border border-vbLine bg-popupVb h-full p-8">
            <Swap
              coinType={COIN_TYPES}
              getSwapToken={(data) => setSwapToken(data)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SwapPage;

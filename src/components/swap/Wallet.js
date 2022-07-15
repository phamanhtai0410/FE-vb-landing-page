import React from "react";
import useSwapFacade from "./hooks";


const Wallet = () => {
  const {
    sourceTokenInfo,
  } = useSwapFacade();
  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex flex-row justify-between w-full">
        <span className="font-poppins font-[700] text-xl text-white">
          My Wallet
        </span>
        <span className="font-poppins font-[600] text-base text-white">
          0.009  {sourceTokenInfo?.assetsChain}
        </span>
      </div>
      <div className="h-[1px] bg-[#4B5C86]"></div>
      <span className="font-poppins text-xs text-[#678BCA]">
        You don’t have any tokens in your connected wallet in Ethereum Mainnet.
      </span>
    </div>
  );
};

export default Wallet;

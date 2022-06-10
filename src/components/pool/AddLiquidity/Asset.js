import "./styles.scss";
import React, { useState, useCallback } from "react";
import IcDropDown from "../../../assets/images/ic_dropdown.svg";
import { numberWithCommas } from "../../../utils/lib";

const Assets = ({
  assetData = {},
  volume = "",
  onClickSelectCurrency = () => {},
  onVolumeChange = () => {},
  inputRef = {},
}) => {

  const [value, setValue] = useState("")

  const onClickMaxButton = () => {
    onVolumeChange(7000);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row flex-1 justify-between">
        <div
          onClick={onClickSelectCurrency}
          className="flex flex-row items-center space-x-2 cursor-pointer"
        >
          {assetData?.icon && (
            <img src={assetData?.icon} alt="" className="mr-2 w-6 h-6" />
          )}
          {assetData?.assetsChain ? (
            <span className="text-[#FAFAFA] text-base font-bold">
              {assetData?.assetsChain}
            </span>
          ) : (
            <span className="text-[#FAFAFA] text-base">Select a currency</span>
          )}
          <img src={IcDropDown} alt={"Dropdown"} className="w-2 h-2" />
        </div>
        <div className="flex flex-row space-x-1">
          <span className="text-[#BFBFBF] text-xl">
            {assetData?.totalSupplied !== null ? "Balance " : "_"}
          </span>
          {assetData?.totalSupplied !== null && (
            <span className="font-bold text-xl text-[#fff] ml-2">
              {assetData?.totalSupplied || "7,000"}
            </span>
          )}
        </div>
      </div>
      <div className="relative flex flex-1 mt-4">
        <input
          // ref={inputRef}
          placeholder="0.0"
          value={volume}
          onChange={e => onVolumeChange(e.target.value)}
          className="flex flex-1 px-4 py-6 focus:outline-none placeholder:text-vbDisableText font-[poppins_bold] text-2xl border-2 border-[#4F92A7] rounded-lg bg-transparent"
          type="number"
        />
        <button
          className="absolute right-0 top-1/3 right-4 font-poppins_bold text-[#A0D911] text-base"
          onClick={onClickMaxButton}
        >
          MAX
        </button>
      </div>
    </div>
  );
};

export default React.memo(Assets);

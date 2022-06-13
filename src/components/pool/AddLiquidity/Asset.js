import "./styles.scss";
import React from "react";
import IcDropDown from "../../../assets/images/ic_dropdown.svg";

const Assets = ({
  assetData,
  volume = "",
  className = "",
  onClickSelectCurrency = () => {},
  onVolumeChange = () => {},
}) => {

  const onClickMaxButton = () => {
    onVolumeChange(assetData?.totalSupplied);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex flex-row flex-1 justify-between">
        <div
          onClick={onClickSelectCurrency}
          className="flex flex-row items-center space-x-2 cursor-pointer"
        >
          {assetData?.icon && (
            <img src={assetData?.icon} alt="" className="mr-1 w-6 h-6" />
          )}
          {assetData?.assetsChain ? (
            <span className="text-[#FAFAFA] text-sm font-poppins_semi_bold">
              {assetData?.assetsChain}
            </span>
          ) : (
            <span className="text-[#FAFAFA] text-sm">Select a currency</span>
          )}
          <img src={IcDropDown} alt={"Dropdown"} className="w-2 h-2" />
        </div>
        <div className="flex flex-row space-x-1">
          <span className="text-[#BFBFBF] text-base mr-1.5">
            {assetData?.totalSupplied || assetData?.totalSupplied == 0
              ? "Balance"
              : "_"}
          </span>
          {assetData?.totalSupplied && (
            <span className="font-poppins_semi_bold text-base text-[#fff] ml-2">
              {assetData?.totalSupplied || "0"}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 mt-3 relative">
        <input
          // ref={inputRef}
          placeholder="0.0"
          value={volume}
          onChange={(e) => onVolumeChange(e.target.value)}
          className="flex flex-1 px-3 py-4 focus:outline-none placeholder:text-vbDisableText font-poppins_semi_bold text-lg border-2 border-[#4F92A7] rounded-lg bg-transparent"
          type="number"
        />
        {assetData && (
          <button
            className="absolute right-2 self-center font-poppins_semi_bold text-[#A0D911] text-lg"
            onClick={onClickMaxButton}
          >
            MAX
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(Assets);

import "./styles.scss";
import React, { useMemo } from "react";
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

  const isBalanceAvailable = useMemo(
    () => assetData?.totalSupplied || assetData?.totalSupplied == 0,
    [assetData]
  );

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex flex-row flex-1 justify-between">
        <div
          onClick={onClickSelectCurrency}
          className="flex flex-row items-center space-x-2 cursor-pointer"
        >
          {assetData?.icon && (
            <img src={assetData?.icon} alt="" className="mr-1.5 w-8 h-8" />
          )}
          {assetData?.assetsChain ? (
            <span className="text-[#FAFAFA] text-base font-poppins_semi_bold">
              {assetData?.assetsChain}
            </span>
          ) : (
            <span className="text-[#FAFAFA] text-lg">Select a currency</span>
          )}
          <img src={IcDropDown} alt={"Dropdown"} className="w-2 h-2" />
        </div>
        <div className="flex flex-row space-x-1 items-center">
          <span className="text-grey-6 font-poppins_light text-xl mr-1.5">
            {isBalanceAvailable ? "Balance" : "_"}
          </span>
          {isBalanceAvailable && (
            <span className="font-poppins_semi_bold text-xl text-grey-1 ml-2">
              {assetData?.totalSupplied || "0"}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 mt-4 relative">
        <input
          placeholder="0.0"
          value={volume}
          onChange={(e) => onVolumeChange(e.target.value)}
          className="flex flex-1 px-4 py-6 focus:outline-none placeholder:text-vbDisableText font-poppins_semi_bold text-2xl border-2 border-[#4F92A7] rounded-lg bg-transparent"
          type="number"
        />
        {assetData && (
          <button
            className="absolute right-3 self-center font-poppins_semi_bold text-[#A0D911] text-2xl"
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

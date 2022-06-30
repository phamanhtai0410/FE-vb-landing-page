import React from "react";
import IcArrow from "../../assets/images/ic_arrow_right.svg";

const TrendingPairs = () => {
  const data = [
    { from: "USDC", to: "USDT" },
    { from: "DAI", to: "ETH" },
    { from: "DAI", to: "USDT" },
    { from: "WBTC", to: "ETH" },
    { from: "DAI", to: "USDC" },
    { from: "USDC", to: "ETH" },
  ];
  return (
    <div className="flex flex-col w-full space-y-6">
      <span className="font-poppins font-[700] text-xl text-white">
        Trending pairs
      </span>
      <div className="h-[1px] bg-[#4B5C86]"></div>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-wrap">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-row bg-[#182844] py-[6px] px-[8px] rounded space-x-[10px] mr-[6px] flex-1 mb-6"
            >
              <span className="font-poppins font-[600] text-sm text-white">
                {item.from}
              </span>
              <img className="cursor-pointer" src={IcArrow} alt="Transfer" />
              <span className="font-poppins font-[600] text-sm text-white">
                {item.to}
              </span>
            </div>
          ))}
          {/* <div className="flex flex-row bg-[#182844] py-[6px] px-[8px] rounded space-x-[10px]">
            <span className="font-poppins font-[600] text-sm text-white">
              USDC
            </span>
            <img className="cursor-pointer" src={IcArrow} alt="Refresh" />
            <span className="font-poppins font-[600] text-sm text-white">
              USDT
            </span>
          </div>
          <div className="flex flex-row bg-[#182844] py-[6px] px-[8px] rounded space-x-[10px] ml-[0px]">
            <span className="font-poppins font-[600] text-sm text-white">
              USDC
            </span>
            <img className="cursor-pointer" src={IcArrow} alt="Refresh" />
            <span className="font-poppins font-[600] text-sm text-white">
              USDT
            </span>
          </div>
          <div className="flex flex-row bg-[#182844] py-[6px] px-[8px] rounded space-x-[10px]">
            <span className="font-poppins font-[600] text-sm text-white">
              USDC
            </span>
            <img className="cursor-pointer" src={IcArrow} alt="Refresh" />
            <span className="font-poppins font-[600] text-sm text-white">
              USDT
            </span>
          </div>
          <div className="flex flex-row bg-[#182844] py-[6px] px-[8px] rounded space-x-[10px] ml-[6px]">
            <span className="font-poppins font-[600] text-sm text-white">
              USDC
            </span>
            <img className="cursor-pointer" src={IcArrow} alt="Refresh" />
            <span className="font-poppins font-[600] text-sm text-white">
              USDT
            </span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default TrendingPairs;

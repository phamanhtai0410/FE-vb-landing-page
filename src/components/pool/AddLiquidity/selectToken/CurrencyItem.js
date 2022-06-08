import React from "react";

const CurrencyItem = ({ icon }) => {
  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-row">
        <img src={icon} alt="token icon" />
        <div className="flex">
          <p className="text-white font-bold">VET</p>
          <p className="text-white">Vechain</p>
        </div>
      </div>
      <p>1,000</p>
    </div>
  );
};

export default React.memo(CurrencyItem);

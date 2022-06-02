import React from "react";

const LiquidPairIcon = ({ iconAsset1 = "", iconAsset2 = "" }) => (
  <div className="flex -space-x-2 overflow-hidden">
    <img
      className="inline-block h-8 w-8 rounded-full z-10"
      src={iconAsset1}
      alt=""
    />
    <img
      className="inline-block h-8 w-8 rounded-full"
      src={iconAsset2}
      alt=""
    />
  </div>
);

export default React.memo(LiquidPairIcon);

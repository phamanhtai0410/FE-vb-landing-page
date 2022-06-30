import React from "react";
import GradientStrokeWrapper from "../partials/GradientStrokeWrapper";

const HighlightedAssetIcon = ({
  icon,
  colors = ["#B9DDFF4D", "#12C9C917"],
}) => {
  return (
    <div className="relative flex w-6 h-6 p-[2px] justify-center items-center rounded-full">
      <img src={icon} alt="" />
      <GradientStrokeWrapper
        strokeWidth="0.25rem"
        colors={colors}
        className="opacity-20"
        borderRadius="1rem"
      />
    </div>
  );
};

export default React.memo(HighlightedAssetIcon);

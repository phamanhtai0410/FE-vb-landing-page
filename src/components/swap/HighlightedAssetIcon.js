import React from "react";
import GradientStrokeWrapper from "../partials/GradientStrokeWrapper";

const HighlightedAssetIcon = ({
  icon,
  colors = ["#B9DDFF", "#12C9C9"],
}) => {
  return (
    <div className="relative flex w-6 h-6 p-[2px] justify-center items-center rounded-full">
      <img src={icon} alt="" />
      <GradientStrokeWrapper
        strokeWidth="0.25rem"
        colors={colors}
        opacities={[0.3, 0.09]}
        borderRadius="1rem"
      />
    </div>
  );
};

export default HighlightedAssetIcon;

import React from "react";
import { PartialConstants } from "../../constants/partial.constants";
import GradientStrokeWrapper from "./GradientStrokeWrapper";

const SecondaryButton = ({
  label = "Button",
  labelColor = "#fff",
  onClick = () => {},
  className = "",
  labelClassName = "",
  borderRadius = "0.5rem", // 8px,
}) => (
  <div className={`flex justify-center relative ${className}`}>
    <GradientStrokeWrapper
      colors={PartialConstants.PRIMARY_GRADIENT_COLOR_LIST}
      borderRadius={borderRadius}
    />
    <button
      className={`absolute w-full h-full top-0 z-10 text-[${labelColor}] ${labelClassName}`}
      onClick={onClick}
    >
      {label}
    </button>
  </div>
);

export default React.memo(SecondaryButton);

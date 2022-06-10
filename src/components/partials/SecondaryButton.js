import React from "react";
import { PartialConstants } from "../../constants/partial.constants";
import GradientStrokeWrapper from "./GradientStrokeWrapper";

const SecondaryButton = ({
  label = "Button",
  labelColor = "white",
  onClick = () => {},
  className = "",
}) => (
  <div className={`flex justify-center relative ${className}`}>
    <GradientStrokeWrapper
      colors={PartialConstants.PRIMARY_GRADIENT_COLOR_LIST}
    />
    <button
      className={`absolute w-full h-full top-0`}
      onClick={onClick}
      style={{ zIndex: "10", color: labelColor, fontSize: "16px" }}
    >
      {label}
    </button>
  </div>
);

export default React.memo(SecondaryButton);

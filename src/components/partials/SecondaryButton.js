import React, { Fragment } from "react";
import GradientStrokeWrapper from "./GradientStrokeWrapper";

const SecondaryButton = ({
  label = "Button",
  onClick = () => {},
  className = "",
}) => (
  <div className={`flex justify-center relative ${className}`}>
    <GradientStrokeWrapper className="flex flex-shrink svg-bg" />
    <button
      className={`relative w-full`}
      onClick={onClick}
      style={{ zIndex: "10", color: "white", fontSize: "16px" }}
    >
      {label}
    </button>
  </div>
);

export default SecondaryButton;

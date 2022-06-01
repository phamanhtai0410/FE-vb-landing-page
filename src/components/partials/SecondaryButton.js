import React, { Fragment } from "react";
import GradientStrokeWrapper from "./GradientStrokeWrapper";

const SecondaryButton = ({
  label = "Button",
  onClick = () => {},
  className = "",
}) => (
  <Fragment className={`relative ${className}`}>
    <GradientStrokeWrapper
      borderRadius={8}
      style={{
        top: 0,
        left: 0,
        overflow: "visible",
      }}
    />
    <div className="relative flex-1">
      <button onClick={onClick}>{label}</button>
    </div>
  </Fragment>
);

export default SecondaryButton;

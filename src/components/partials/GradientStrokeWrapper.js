import React from "react";
import { PartialConstants } from "../../constants/partial.constants";

const borderId = "borderId";

const GradientStrokeWrapper = ({
  x1 = "0",
  y1 = "0.5",
  x2 = "1",
  y2 = "0.5",
  angle = 0,
  colors = PartialConstants.PRIMARY_GRADIENT_COLOR_LIST,
  borderRadius = "0.5rem", // 8px
  strokeWidth = 1,
  style,
  className = "",
}) => {
  return (
    <svg width="0" height="0" style={style} className={`svg-bg ${className}`}>
      <defs>
        <linearGradient
          id="grad1"
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          gradientTransform={`rotate(${angle})`}
        >
          {colors?.map((item, index) => (
            <stop
              key={index}
              offset={item?.offset ? item?.offset : null}
              stopColor={item.stopColor}
            />
          ))}
        </linearGradient>
      </defs>
      <symbol overflow="visible" id={borderId}>
        <rect
          width="100%"
          height="100%"
          rx={borderRadius}
          ry={borderRadius}
          stroke="url('#grad1')"
          strokeWidth={strokeWidth}
          fill="#00000000"
        ></rect>
      </symbol>
      <use xlinkHref={`#${borderId}`} />
    </svg>
  );
};

export default GradientStrokeWrapper;

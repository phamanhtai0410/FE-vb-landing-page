import React from "react";
import { PartialConstants } from "../../constants/partial.constants";
import { getTimeStamp } from "../../utils/lib";

const GradientStrokeWrapper = ({
  x1 = "0",
  y1 = "0.5",
  x2 = "1",
  y2 = "0.5",
  angle = 0,
  colors = PartialConstants.PRIMARY_GRADIENT_COLOR_LIST,
  locations = [],
  borderRadius = "0.5rem", // 8px
  strokeWidth = "0.1rem",
  style,
  className = "",
}) => {
  // This will ensure the borderId for every entity is unique
  const _borderId = getTimeStamp();
  if (colors.length !== 0 && locations.length === 0) {
    const partial = 1 / colors.length;
    for (let i = 1; i <= colors.length; ++i) locations.push(partial * i);
  }
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
          {colors?.map((color, index) => (
            <stop
              key={index}
              offset={locations[index]}
              stopColor={color}
            />
          ))}
        </linearGradient>
      </defs>
      <symbol overflow="visible" id={_borderId}>
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
      <use xlinkHref={`#${_borderId}`} />
    </svg>
  );
};

export default React.memo(GradientStrokeWrapper);

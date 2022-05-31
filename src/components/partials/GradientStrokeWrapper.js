import React from "react";

const borderId = "borderId";

const GradientStrokeWrapper = ({
  x1 = "0",
  y1 = "0",
  x2 = "1",
  y2 = "1",
  transform = "rotate(360)",
  stop = [
    { offset: "0%", stopColor: "#0FE3E3" },
    { offset: "51.04%", stopColor: "#02A4FF" },
  ],
  rx = "16",
  ry = "16",
  borderRadius = 0,
  strokeWidth = 1,
  style,
  className = "",
}) => {
  return (
    <svg width="0" height="0" style={style} className={className}>
      <linearGradient
        id="linear"
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        gradientTransform={transform}
      >
        {stop?.map((item, index) => (
          <stop
            key={index}
            offset={item.offset ? item.offset : null}
            stopColor={item.stopColor}
          ></stop>
        ))}
      </linearGradient>
      <symbol overflow="visible" id={borderId}>
        <rect
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          stroke="url(#linear)"
          strokeWidth={strokeWidth}
          radius={borderRadius}
        ></rect>
      </symbol>
      <use xlinkHref={borderId} />
    </svg>
  );
};

export default GradientStrokeWrapper;

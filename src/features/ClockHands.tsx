import React from "react";

interface ClockHandProps {
  angle: number;
  length: number;
  width: number;
  color: string;
  centerX: number;
  centerY: number;
}

const ClockHand: React.FC<ClockHandProps> = ({
  angle,
  length,
  width,
  color,
  centerX,
  centerY,
}) => {
  const rad = (angle * Math.PI) / 180;
  const x = centerX + Math.cos(rad) * length;
  const y = centerY + Math.sin(rad) * length;

  return (
    <line
      x1={centerX}
      y1={centerY}
      x2={x}
      y2={y}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
};

export default ClockHand;
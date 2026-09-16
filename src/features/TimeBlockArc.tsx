import React from "react";

interface TimeBlockArcProps {
  startHour: number;
  endHour: number;
  radius: number;
  centerX: number;
  centerY: number;
  color: string;
  opacity?: number;
  selected?: boolean;
  onPointerDown?: (event: React.PointerEvent<SVGPathElement>) => void;
}

const TimeBlockArc: React.FC<TimeBlockArcProps> = ({
  startHour,
  endHour,
  radius,
  centerX,
  centerY,
  color,
  opacity = 0.5,
  selected = false,
  onPointerDown,
}) => {
  const startAngle = (startHour * 15 - 90) * (Math.PI / 180);
  const endAngle = (endHour * 15 - 90) * (Math.PI / 180);
  const x1 = centerX + radius * Math.cos(startAngle);
  const y1 = centerY + radius * Math.sin(startAngle);
  const x2 = centerX + radius * Math.cos(endAngle);
  const y2 = centerY + radius * Math.sin(endAngle);
  const duration = (endHour - startHour + 24) % 24;

  return (
    <path
      d={`M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${duration > 12 ? 1 : 0} 1 ${x2},${y2} Z`}
      fill={color}
      opacity={opacity}
      stroke={selected ? "#1e3a8a" : "transparent"}
      strokeWidth={selected ? 3 : 0}
      className="cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
    />
  );
};

export default TimeBlockArc;

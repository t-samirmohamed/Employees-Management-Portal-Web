import React from "react";

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const CheckIcon: React.FC<CheckIconProps> = ({
  className,
  width = 16,
  height = 16,
  color = "currentColor",
  ...props
}) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.5312 3.96875L7.53125 12L4.65625 9.125M4.375 12.0312L1.46875 9.125M11.3438 3.96875L7.375 8.53125"
      stroke={color}
      strokeWidth="1.375"
      strokeMiterlimit="10"
      strokeLinecap="square"
    />
  </svg>
);

export default CheckIcon;

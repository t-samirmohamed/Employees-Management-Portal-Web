import React from "react";

interface PlusCircleIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const PlusCircleIcon: React.FC<PlusCircleIconProps> = ({
  className,
  width = 18,
  height = 18,
  color = "currentColor",
  ...props
}) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.58333 5.625C9.58333 5.27982 9.30351 5 8.95833 5C8.61316 5 8.33333 5.27982 8.33333 5.625V8.33333H5.625C5.27982 8.33333 5 8.61316 5 8.95833C5 9.30351 5.27982 9.58333 5.625 9.58333H8.33333V12.2917C8.33333 12.6368 8.61316 12.9167 8.95833 12.9167C9.30351 12.9167 9.58333 12.6368 9.58333 12.2917V9.58333H12.2917C12.6368 9.58333 12.9167 9.30351 12.9167 8.95833C12.9167 8.61316 12.6368 8.33333 12.2917 8.33333H9.58333V5.625Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.95833 17.9167C4.01078 17.9167 0 13.9059 0 8.95833C0 4.01078 4.01078 0 8.95833 0C13.9059 0 17.9167 4.01078 17.9167 8.95833C17.9167 13.9059 13.9059 17.9167 8.95833 17.9167ZM1.25 8.95833C1.25 13.2155 4.70114 16.6667 8.95833 16.6667C13.2155 16.6667 16.6667 13.2155 16.6667 8.95833C16.6667 4.70114 13.2155 1.25 8.95833 1.25C4.70114 1.25 1.25 4.70114 1.25 8.95833Z"
      fill={color}
    />
  </svg>
);

export default PlusCircleIcon;

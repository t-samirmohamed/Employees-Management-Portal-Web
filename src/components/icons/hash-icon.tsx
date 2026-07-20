import React from "react";

interface HashIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const HashIcon: React.FC<HashIconProps> = ({
  className,
  width = 17,
  height = 17,
  color = "currentColor",
  ...props
}) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.875 0.5625C4.875 0.25184 4.62316 0 4.3125 0C4.00184 0 3.75 0.25184 3.75 0.5625V3.75H0.5625C0.25184 3.75 0 4.00184 0 4.3125C0 4.62316 0.25184 4.875 0.5625 4.875H3.75V11.25H0.5625C0.25184 11.25 0 11.5018 0 11.8125C0 12.1232 0.25184 12.375 0.5625 12.375H3.75V15.5625C3.75 15.8732 4.00184 16.125 4.3125 16.125C4.62316 16.125 4.875 15.8732 4.875 15.5625V12.375H11.25V15.5625C11.25 15.8732 11.5018 16.125 11.8125 16.125C12.1232 16.125 12.375 15.8732 12.375 15.5625V12.375H15.5625C15.8732 12.375 16.125 12.1232 16.125 11.8125C16.125 11.5018 15.8732 11.25 15.5625 11.25H12.375V4.875H15.5625C15.8732 4.875 16.125 4.62316 16.125 4.3125C16.125 4.00184 15.8732 3.75 15.5625 3.75H12.375V0.5625C12.375 0.25184 12.1232 0 11.8125 0C11.5018 0 11.25 0.25184 11.25 0.5625V3.75H4.875V0.5625ZM11.25 11.25V4.875H4.875V11.25L11.25 11.25Z"
      fill={color}
    />
  </svg>
);

export default HashIcon;

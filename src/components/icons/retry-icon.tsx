import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const RetryIcon: React.FC<IconProps> = ({
  className,
  width = 15,
  height = 15,
  color = "currentColor",
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.16667 1C3.76091 1 1 3.76091 1 7.16667C1 10.5724 3.76091 13.3333 7.16667 13.3333C10.5724 13.3333 13.3333 10.5724 13.3333 7.16667C13.3333 6.89052 13.5572 6.66667 13.8333 6.66667C14.1095 6.66667 14.3333 6.89052 14.3333 7.16667C14.3333 11.1247 11.1247 14.3333 7.16667 14.3333C3.20863 14.3333 0 11.1247 0 7.16667C0 3.20863 3.20863 0 7.16667 0C9.03212 0 10.7315 0.713222 12.0062 1.88077V0.5C12.0062 0.223858 12.23 0 12.5062 0C12.7823 0 13.0062 0.223858 13.0062 0.5V2.58813C13.0062 3.24795 12.1858 3.54868 11.7589 3.05084C10.6292 1.79126 8.99064 1 7.16667 1Z"
      fill={color}
    />
  </svg>
);

export default RetryIcon;

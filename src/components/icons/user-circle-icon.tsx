import React from "react";

interface UserCircleIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const UserCircleIcon: React.FC<UserCircleIconProps> = ({
  className,
  width = 15,
  height = 15,
  color = "currentColor",
  ...props
}) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.16667 0C3.20863 0 0 3.20863 0 7.16667C0 11.1247 3.20863 14.3333 7.16667 14.3333C11.1247 14.3333 14.3333 11.1247 14.3333 7.16667C14.3333 3.20863 11.1247 0 7.16667 0ZM7.16109 3.33333C5.96384 3.33333 4.99205 4.30271 4.99205 5.5C4.99205 6.69729 5.96384 7.66667 7.16109 7.66667C8.35835 7.66667 9.33014 6.69729 9.33014 5.5C9.33014 4.30271 8.35835 3.33333 7.16109 3.33333ZM10.5273 10.1534C8.74898 8.23346 5.54981 8.33247 3.80921 10.1504L3.68421 10.2754C3.58736 10.3723 3.53448 10.5046 3.53792 10.6415C3.54136 10.7785 3.60081 10.908 3.7024 10.9998C4.61846 11.8282 5.8342 12.3333 7.16674 12.3333C8.49928 12.3333 9.71502 11.8282 10.6311 10.9998C10.7327 10.908 10.7921 10.7785 10.7956 10.6415C10.799 10.5046 10.7461 10.3723 10.6493 10.2754L10.5273 10.1534Z"
      fill={color}
    />
  </svg>
);

export default UserCircleIcon;

import React from "react";

interface CircleXIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const CircleXIcon: React.FC<CircleXIconProps> = ({
  className,
  width = 15,
  height = 15,
  color = "currentColor",
  ...props
}) => {
  return (
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
        d="M5.52024 4.81313C5.32499 4.61786 5.0084 4.61784 4.81313 4.81309C4.61786 5.00835 4.61784 5.32493 4.81309 5.5202L6.4596 7.16688L4.81352 8.81313C4.61827 9.0084 4.61829 9.32499 4.81356 9.52024C5.00883 9.71549 5.32541 9.71547 5.52067 9.5202L7.16667 7.87402L8.81267 9.5202C9.00792 9.71547 9.3245 9.71549 9.51977 9.52024C9.71505 9.32499 9.71506 9.0084 9.51981 8.81313L7.87374 7.16688L9.52024 5.5202C9.71549 5.32493 9.71547 5.00835 9.5202 4.81309C9.32493 4.61784 9.00835 4.61786 8.81309 4.81313L7.16667 6.45974L5.52024 4.81313Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.16667 14.3333C3.20863 14.3333 0 11.1247 0 7.16667C0 3.20863 3.20863 0 7.16667 0C11.1247 0 14.3333 3.20863 14.3333 7.16667C14.3333 11.1247 11.1247 14.3333 7.16667 14.3333ZM1 7.16667C1 10.5724 3.76091 13.3333 7.16667 13.3333C10.5724 13.3333 13.3333 10.5724 13.3333 7.16667C13.3333 3.76091 10.5724 1 7.16667 1C3.76091 1 1 3.76091 1 7.16667Z"
        fill={color}
      />
    </svg>
  );
};

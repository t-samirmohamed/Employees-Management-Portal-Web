import React from "react";

interface TimerIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const TimerIcon: React.FC<TimerIconProps> = ({
  className,
  width = 22,
  height = 22,
  color = "currentColor",
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5083 5.74915C11.5083 5.33493 11.1725 4.99915 10.7583 4.99915C10.3441 4.99915 10.0083 5.33493 10.0083 5.74915V8.63633C9.13441 8.94521 8.5083 9.77864 8.5083 10.7583C8.5083 12.0009 9.51566 13.0083 10.7583 13.0083C11.1044 13.0083 11.4322 12.9302 11.7251 12.7906L13.2349 14.3003C13.5278 14.5932 14.0026 14.5932 14.2955 14.3003C14.5884 14.0074 14.5884 13.5325 14.2955 13.2396L12.7875 11.7316C12.929 11.437 13.0083 11.1069 13.0083 10.7583C13.0083 9.77864 12.3822 8.94521 11.5083 8.63633V5.74915ZM11.5083 10.7583C11.5083 10.9662 11.4237 11.1543 11.2872 11.2901C11.1516 11.425 10.9647 11.5083 10.7583 11.5083C10.3441 11.5083 10.0083 11.1725 10.0083 10.7583C10.0083 10.3441 10.3441 10.0083 10.7583 10.0083C11.1725 10.0083 11.5083 10.3441 11.5083 10.7583Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.75 0C4.81294 0 0 4.81294 0 10.75C0 16.6871 4.81294 21.5 10.75 21.5C16.6871 21.5 21.5 16.6871 21.5 10.75C21.5 4.81294 16.6871 0 10.75 0ZM1.5 10.75C1.5 5.64137 5.64137 1.5 10.75 1.5C15.8586 1.5 20 5.64137 20 10.75C20 15.8586 15.8586 20 10.75 20C5.64137 20 1.5 15.8586 1.5 10.75Z"
        fill={color}
      />
    </svg>
  );
};

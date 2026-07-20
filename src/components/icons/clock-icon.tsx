import React from "react";

interface ClockIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const ClockIcon: React.FC<ClockIconProps> = ({
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
        d="M10.1869 4.85355C10.3821 4.65829 10.3821 4.34171 10.1869 4.14645C9.99162 3.95118 9.67504 3.95118 9.47978 4.14645L7.16671 6.45951L5.85354 5.14643C5.65827 4.95118 5.34169 4.95119 5.14643 5.14646C4.95118 5.34173 4.95119 5.65831 5.14646 5.85357L6.45961 7.16662L6.14645 7.47978C5.95118 7.67504 5.95118 7.99162 6.14645 8.18689C6.34171 8.38215 6.65829 8.38215 6.85355 8.18689L7.16674 7.8737L7.47971 8.18665C7.67498 8.38191 7.99156 8.3819 8.18682 8.18663C8.38207 7.99136 8.38206 7.67478 8.18679 7.47952L7.87384 7.1666L10.1869 4.85355Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.16667 0C3.20863 0 0 3.20863 0 7.16667C0 11.1247 3.20863 14.3333 7.16667 14.3333C11.1247 14.3333 14.3333 11.1247 14.3333 7.16667C14.3333 3.20863 11.1247 0 7.16667 0ZM1 7.16667C1 3.76091 3.76091 1 7.16667 1C10.5724 1 13.3333 3.76091 13.3333 7.16667C13.3333 10.5724 10.5724 13.3333 7.16667 13.3333C3.76091 13.3333 1 10.5724 1 7.16667Z"
        fill={color}
      />
    </svg>
  );
};

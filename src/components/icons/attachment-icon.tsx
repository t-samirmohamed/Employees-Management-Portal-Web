import React from "react";

interface AttachmentIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const AttachmentIcon: React.FC<AttachmentIconProps> = ({
  className,
  width = 11,
  height = 13,
  color = "currentColor",
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 11 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.83333 1C2.26853 1 1 2.26853 1 3.83333V7.50004C1 9.98533 3.01472 12 5.5 12C7.98528 12 10 9.98533 10 7.50004V6.50004C10 6.2239 10.2239 6.00004 10.5 6.00004C10.7761 6.00004 11 6.2239 11 6.50004V7.50004C11 10.5376 8.53757 13 5.5 13C2.46243 13 0 10.5376 0 7.50004L0 3.83333C0 1.71624 1.71624 0 3.83333 0C5.95043 0 7.66667 1.71624 7.66667 3.83333V7.5C7.66667 8.69662 6.69662 9.66667 5.5 9.66667C4.30338 9.66667 3.33333 8.69662 3.33333 7.5V4.83333C3.33333 4.55719 3.55719 4.33333 3.83333 4.33333C4.10948 4.33333 4.33333 4.55719 4.33333 4.83333V7.5C4.33333 8.14433 4.85567 8.66667 5.5 8.66667C6.14433 8.66667 6.66667 8.14433 6.66667 7.5V3.83333C6.66667 2.26853 5.39814 1 3.83333 1Z"
        fill={color}
      />
    </svg>
  );
};

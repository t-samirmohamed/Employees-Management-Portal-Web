import React from "react";

interface HourglassIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const HourglassIcon: React.FC<HourglassIconProps> = ({
  className,
  width = 12,
  height = 14,
  color = "currentColor",
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.625 0C0.279822 0 0 0.279822 0 0.625C0 0.970178 0.279822 1.25 0.625 1.25H0.78125V2.57102C0.78125 4.46713 1.9034 6.10499 3.52903 6.875C1.9034 7.64501 0.78125 9.28287 0.78125 11.179V12.5H0.625C0.279822 12.5 0 12.7798 0 13.125C0 13.4702 0.279822 13.75 0.625 13.75H10.625C10.9702 13.75 11.25 13.4702 11.25 13.125C11.25 12.7798 10.9702 12.5 10.625 12.5H10.4688V11.179C10.4688 9.28287 9.3466 7.64501 7.72097 6.875C9.3466 6.10499 10.4688 4.46713 10.4688 2.57102V1.25H10.625C10.9702 1.25 11.25 0.970178 11.25 0.625C11.25 0.279822 10.9702 0 10.625 0H0.625ZM9.25781 1.25H1.99219V2.57102C1.99219 4.54795 3.61865 6.15057 5.625 6.15057C7.63135 6.15057 9.25781 4.54795 9.25781 2.57102V1.25Z"
        fill={color}
      />
    </svg>
  );
};

import React from 'react';

interface CircleCheckIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const CircleCheckIcon: React.FC<CircleCheckIconProps> = ({
  className,
  width = 15,
  height = 15,
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 7.16667C0 11.1247 3.20867 14.3333 7.16667 14.3333C11.1247 14.3333 14.3333 11.1247 14.3333 7.16667C14.3333 3.20867 11.1247 0 7.16667 0C3.20867 0 0 3.20867 0 7.16667ZM10.284 4.67533C10.5553 4.92399 10.5733 5.34598 10.3247 5.61732L6.65801 9.61732C6.53534 9.75132 6.36266 9.82933 6.18133 9.83333C5.99933 9.83733 5.824 9.76669 5.69533 9.63802L4.02866 7.97135C3.768 7.71135 3.768 7.28865 4.02866 7.02865C4.28866 6.76798 4.71134 6.76798 4.97134 7.02865L6.146 8.20267L9.34199 4.71602C9.59066 4.44468 10.0127 4.42666 10.284 4.67533Z"
        fill="currentColor"
      />
    </svg>
  );
};

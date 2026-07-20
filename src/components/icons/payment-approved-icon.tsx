import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const PaymentApprovedIcon: React.FC<IconProps> = ({
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
      d="M5.67122 9.4233C5.76122 9.57464 5.92455 9.66663 6.09989 9.66663H6.10055C6.10481 9.66663 6.10922 9.66647 6.11372 9.66631C6.11838 9.66615 6.12314 9.66598 6.12789 9.66598C6.31322 9.65531 6.47788 9.5433 6.55522 9.37464C6.57055 9.3413 8.11322 6.01063 10.0739 4.93863C10.3159 4.80597 10.4052 4.50196 10.2725 4.25996C10.1399 4.01796 9.83589 3.92862 9.59389 4.06129C7.93722 4.96729 6.61989 7.10728 6.01055 8.23662C5.43655 7.62995 4.78388 7.25331 4.74788 7.23265C4.50855 7.09598 4.20389 7.17928 4.06655 7.41861C3.92989 7.65795 4.01255 7.96328 4.25189 8.10061C4.26122 8.10595 5.21388 8.6593 5.67122 9.4233Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 7.16667C0 11.1187 3.21467 14.3333 7.16667 14.3333C11.1187 14.3333 14.3333 11.1187 14.3333 7.16667C14.3333 3.21467 11.1187 0 7.16667 0C3.21467 0 0 3.21467 0 7.16667ZM1 7.16667C1 3.76667 3.76667 1 7.16667 1C10.5667 1 13.3333 3.76667 13.3333 7.16667C13.3333 10.5667 10.5667 13.3333 7.16667 13.3333C3.76667 13.3333 1 10.5667 1 7.16667Z"
      fill={color}
    />
  </svg>
);

export default PaymentApprovedIcon;

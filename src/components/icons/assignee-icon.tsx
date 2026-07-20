import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const AssigneeIcon: React.FC<IconProps> = ({
  className,
  width = 17,
  height = 17,
  color = "currentColor",
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.05615 3.75C6.70923 3.75 5.61598 4.84055 5.61598 6.1875C5.61598 7.53445 6.70923 8.625 8.05615 8.625C9.40306 8.625 10.4963 7.53445 10.4963 6.1875C10.4963 4.84055 9.40306 3.75 8.05615 3.75ZM6.74098 6.1875C6.74098 5.46338 7.32904 4.875 8.05615 4.875C8.78325 4.875 9.37132 5.46338 9.37132 6.1875C9.37132 6.91162 8.78325 7.5 8.05615 7.5C7.32904 7.5 6.74098 6.91162 6.74098 6.1875Z"
      fill={color}
    />
    <path
      d="M5.09434 12.2009C6.63215 10.5903 9.48927 10.5286 11.0239 12.1937C11.2344 12.4221 11.5903 12.4367 11.8187 12.2261C12.0471 12.0156 12.0617 11.6597 11.8511 11.4313C9.85058 9.26064 6.2404 9.37147 4.28066 11.4241C4.06613 11.6488 4.07437 12.0048 4.29906 12.2193C4.52375 12.4339 4.87981 12.4256 5.09434 12.2009Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.0625 0C3.6097 0 0 3.6097 0 8.0625C0 12.5153 3.6097 16.125 8.0625 16.125C12.5153 16.125 16.125 12.5153 16.125 8.0625C16.125 3.6097 12.5153 0 8.0625 0ZM1.125 8.0625C1.125 4.23102 4.23102 1.125 8.0625 1.125C11.894 1.125 15 4.23102 15 8.0625C15 11.894 11.894 15 8.0625 15C4.23102 15 1.125 11.894 1.125 8.0625Z"
      fill={color}
    />
  </svg>
);

export default AssigneeIcon;

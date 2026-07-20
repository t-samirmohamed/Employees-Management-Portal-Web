import React from "react";

interface PencilIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

export const PencilIcon: React.FC<PencilIconProps> = ({
  className,
  width = 13,
  height = 15,
  color = "currentColor",
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 13 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M2.59955 8.76364L9.0865 2.2767L12.3067 5.49685L5.81971 11.9838C5.01272 12.791 4.51952 13.2843 3.9123 13.6236C3.5736 13.8129 3.05986 13.9782 2.53415 14.1245C1.9935 14.275 1.37146 14.4231 0.777618 14.5645L0.769776 14.5663C0.55864 14.6166 0.33654 14.5537 0.183071 14.4003C0.0296018 14.2468 -0.0332618 14.0247 0.0170087 13.8136L0.0187437 13.8063C0.160173 13.2123 0.308331 12.59 0.458829 12.0492C0.605125 11.5235 0.770462 11.0097 0.959725 10.671C1.29904 10.0638 1.79237 9.57062 2.59955 8.76364Z"
        fill={color}
      />
      <path
        d="M13 3.88707L12.2741 4.61297L9.05398 1.39281L9.77988 0.666916C10.6691 -0.222305 12.1108 -0.222306 13 0.666915C13.8893 1.55614 13.8893 2.99785 13 3.88707Z"
        fill={color}
      />
      <path
        d="M6.45833 12.9167C5.9981 12.9167 5.625 13.2898 5.625 13.75C5.625 14.2102 5.9981 14.5833 6.45833 14.5833H11.4583C11.9186 14.5833 12.2917 14.2102 12.2917 13.75C12.2917 13.2898 11.9186 12.9167 11.4583 12.9167H6.45833Z"
        fill={color}
      />
    </svg>
  );
};

import { cn } from "@/lib/utils";

interface SaudiRiyalIconProps {
  size?: number;
  className?: string;
}

export function SaudiRiyalIcon({ size = 16, className }: SaudiRiyalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block mx-1", className)}
    >
      <g clipPath="url(#clip0_saudi_riyal)">
        <path
          d="M9.4935 13.0386C9.27651 13.5198 9.13308 14.0419 9.07812 14.5895L13.6701 13.6134C13.8871 13.1323 14.0304 12.6101 14.0855 12.0625L9.4935 13.0386Z"
          fill="currentColor"
        />
        <path
          d="M13.6665 10.69C13.8835 10.209 14.0269 9.68672 14.0819 9.13915L10.5049 9.89993V8.43745L13.6664 7.76559C13.8834 7.28455 14.0268 6.7623 14.0818 6.21474L10.5048 6.97486V1.71534C9.95664 2.02309 9.46987 2.43273 9.07418 2.91593V7.27904L7.64361 7.58311V1C7.09551 1.30764 6.60873 1.71739 6.21304 2.2006V7.88707L3.01214 8.56725C2.79514 9.04829 2.6516 9.57054 2.59654 10.1181L6.21304 9.34955V11.1913L2.33725 12.0149C2.12026 12.4959 1.97683 13.0182 1.92188 13.5658L5.97874 12.7036C6.30899 12.6349 6.59283 12.4397 6.77737 12.171L7.52138 11.068V11.0677C7.59861 10.9536 7.64361 10.816 7.64361 10.6678V9.04548L9.07418 8.74141V11.6664L13.6664 10.6898L13.6665 10.69Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_saudi_riyal">
          <rect
            width="12.16"
            height="13.5906"
            fill="white"
            transform="translate(1.92188 1)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

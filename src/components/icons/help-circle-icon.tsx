export function HelpCircleIcon({
  className,
  width = 16,
  height = 16,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.06065 5.9987C6.21739 5.55314 6.52675 5.17744 6.93395 4.93812C7.34116 4.6988 7.81991 4.61132 8.28543 4.69117C8.75096 4.77102 9.17319 5.01305 9.47737 5.37438C9.78154 5.73572 9.94802 6.19305 9.94732 6.66536C9.94732 7.9987 7.94732 8.66536 7.94732 8.66536M8.00065 11.332H8.00732M14.6673 7.9987C14.6673 11.6806 11.6825 14.6654 8.00065 14.6654C4.31875 14.6654 1.33398 11.6806 1.33398 7.9987C1.33398 4.3168 4.31875 1.33203 8.00065 1.33203C11.6825 1.33203 14.6673 4.3168 14.6673 7.9987Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

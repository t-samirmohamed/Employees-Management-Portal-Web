export function ContainerIcon({ className }: { className?: string }) {
  return (
    <svg
      width="9"
      height="10"
      viewBox="0 0 9 10"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M0 9.5V8.5H6V9.5H0ZM2.825 7.075L0 4.25L1.05 3.175L3.9 6L2.825 7.075ZM6 3.9L3.175 1.05L4.25 0L7.075 2.825L6 3.9ZM8.3 9L1.775 2.475L2.475 1.775L9 8.3L8.3 9Z"
        fill="currentColor"
      />
    </svg>
  );
}

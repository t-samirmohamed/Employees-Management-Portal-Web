import { cn } from "@/lib/utils";

export function ChevronIcon({
  isOpen,
  className,
}: {
  isOpen?: boolean;
  className?: string;
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "shrink-0 transition-transform duration-200",
        isOpen ? "rotate-180" : "rotate-0",
        className
      )}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

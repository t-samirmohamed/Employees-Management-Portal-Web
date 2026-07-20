import React from 'react';

interface SearchIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const SearchIcon: React.FC<SearchIconProps> = ({ className, ...props }) => {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.6875 0C2.54638 0 0 2.54638 0 5.6875C0 8.82862 2.54638 11.375 5.6875 11.375C7.10058 11.375 8.3933 10.8597 9.38797 10.0067L11.7948 12.4135C11.9657 12.5844 12.2427 12.5844 12.4135 12.4135C12.5844 12.2427 12.5844 11.9657 12.4135 11.7948L10.0067 9.38797C10.8597 8.3933 11.375 7.10058 11.375 5.6875C11.375 2.54638 8.82862 0 5.6875 0ZM0.875 5.6875C0.875 3.02963 3.02963 0.875 5.6875 0.875C8.34537 0.875 10.5 3.02963 10.5 5.6875C10.5 8.34537 8.34537 10.5 5.6875 10.5C3.02963 10.5 0.875 8.34537 0.875 5.6875Z"
        fill="currentColor"
      />
    </svg>
  );
};

import React from "react";

export const AppIcon: React.FC = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#1E1E2E" />
      <path d="M5 12H10L7.5 14.5L10 17H5" fill="#00FFFF" />
      <path d="M14 7L19 12L14 17" fill="#00FFFF" />
      <path d="M14 7L10 17" stroke="#00FFFF" strokeWidth="1.5" />
    </svg>
  );
};

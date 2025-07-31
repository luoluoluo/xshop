"use client";

import { useState } from "react";

type SortOrder = "asc" | "desc";

interface ProductSortSelectorProps {
  onSortChange: (order: SortOrder) => void;
  defaultOrder?: SortOrder;
}

export const ProductSortSelector = ({
  onSortChange,
  defaultOrder = "asc",
}: ProductSortSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<SortOrder>(defaultOrder);

  const handleSortChange = (order: SortOrder) => {
    setCurrentOrder(order);
    onSortChange(order);
    setIsOpen(false);
  };

  const sortOptions = [
    { value: "asc", label: "价格从低到高" },
    { value: "desc", label: "价格从高到低" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
      >
        <span>
          {sortOptions.find((option) => option.value === currentOrder)?.label}
        </span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value as SortOrder)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currentOrder === option.value ? "bg-gray-100" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

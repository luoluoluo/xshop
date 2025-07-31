"use client";

import { useState, useMemo } from "react";
import { Product } from "@/generated/graphql";
import { ProductItem } from "./product-item";
import { ProductSortSelector } from "./product-sort-selector";

type SortOrder = "latest" | "asc" | "desc";

interface ProductListProps {
  products: Product[];
}

export const ProductList = ({ products }: ProductListProps) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    setActiveSearchTerm("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    // 先按搜索词过滤
    const filtered = products.filter((product) =>
      product.title?.toLowerCase().includes(activeSearchTerm.toLowerCase()),
    );

    // 再按排序规则排序
    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case "latest": {
          // 按创建时间倒序（最新的在前）
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        case "asc": {
          // 价格从低到高
          const priceA = a.price || 0;
          const priceB = b.price || 0;
          return priceA - priceB;
        }
        case "desc": {
          // 价格从高到低
          const priceC = a.price || 0;
          const priceD = b.price || 0;
          return priceD - priceC;
        }
        default:
          return 0;
      }
    });
  }, [products, sortOrder, activeSearchTerm]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        {/* 搜索框和搜索按钮 */}
        <div className="flex w-full sm:w-80 gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="搜索产品..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-8"
            />
            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            搜索
          </button>
        </div>

        {/* 排序选择器 */}
        <ProductSortSelector
          onSortChange={setSortOrder}
          defaultOrder={sortOrder}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredAndSortedProducts.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      {/* 无搜索结果提示 */}
      {activeSearchTerm && filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">没有找到匹配的产品</div>
      )}
    </div>
  );
};

"use client";

import { Empty } from "@/components/empty";
import { LinkItem } from "@/components/link/link-item";
import { ProductItem } from "@/components/product/product-item";
import { Link, Product } from "@/generated/graphql";
import { useState } from "react";

interface ContentTabsProps {
  products: Product[];
  links: Link[];
}

export const ContentTabs = ({ products, links }: ContentTabsProps) => {
  const [activeTab, setActiveTab] = useState<"products" | "links">("links");

  return (
    <div className="mt-4 lg:mt-8">
      {/* Tabs Navigation */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("links")}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "links"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            链接
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "products"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            商店
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[20rem]">
        {activeTab === "products" ? (
          products?.length ? (
            <div className="my-4">
              <div className="w-full columns-2 gap-4 space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="break-inside-avoid mb-4">
                    <ProductItem product={product} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Empty title="暂无产品" className="min-h-[20rem]" />
          )
        ) : links?.length ? (
          <div className="my-4">
            <div className="w-full columns-2 gap-4 space-y-4">
              {links.map((link) => (
                <div key={link.id} className="break-inside-avoid mb-4">
                  <LinkItem link={link} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Empty title="暂无链接" className="min-h-[20rem]" />
        )}
      </div>
    </div>
  );
};

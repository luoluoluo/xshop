"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/generated/graphql";
import { cn } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import { AmountFormat } from "../amount";
import { BuyNumber } from "./buy-number";
import { CheckoutSheet } from "./checkout-sheet";

export const BuyCard = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="fixed z-10 bottom-0 left-0 w-full border-t shadow-inner">
      <div className="container flex items-center justify-between bg-white  px-4 h-14 lg:h-16  box-border">
        <div className="flex gap-2">
          <Image
            priority
            width={480}
            height={480}
            src={`${product.image}?w=960&h=960`}
            alt=""
            className="w-12 h-12 rounded object-cover object-center hidden lg:block"
          />
          <div className="flex flex-col justify-center">
            <div className="text-black hidden lg:block max-w-md overflow-hidden text-nowrap h-6 leading-6">
              {product.title}
            </div>
            {/* {product.description ? <div className="text-gray-500 mt-1">{product.description}</div> : null} */}
            <AmountFormat
              value={(product?.price || 0) * quantity}
              className="lg:mt-1"
            />
          </div>
        </div>
        <div className="flex items-center lg:items-end gap-2 bg-white">
          <div>
            <BuyNumber
              value={quantity}
              onChange={(value) => {
                setQuantity(value || 1);
              }}
            />
          </div>
          <CheckoutSheet product={product} quantity={quantity}>
            <Button size="sm" className={cn("w-full")}>
              立即购买
            </Button>
          </CheckoutSheet>
        </div>
      </div>
    </div>
  );
};

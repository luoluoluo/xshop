"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/generated/graphql";
import { cn } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import { AmountFormat } from "../amount";
import { CheckoutSheet } from "./checkout-sheet";
import { ShareDialog } from "../share-dialog/share-dialog";
import { generateProductPosterUrl } from "../product/product-poster";
import { Icons } from "../icons";
import { useAuth } from "@/contexts/auth";
import { getLoginUrl } from "@/utils/auth.client";

export const BuyCard = ({ product }: { product: Product }) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { me } = useAuth();

  let btnText = "立即购买";
  let btnDisabled = false;
  if ((product?.stock ?? 0) <= 0) {
    btnText = "已售罄";
    btnDisabled = true;
  } else if (!product.isActive) {
    btnText = "已下架";
    btnDisabled = true;
  }

  const handleShare = () => {
    if (loading) return;
    setLoading(true);
    generateProductPosterUrl(product, me)
      .then((url) => {
        setPosterUrl(url);
        setShareDialogOpen(true);
      })
      .catch((error) => {
        console.error("生成商品海报失败:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="fixed z-10 bottom-0 left-0 w-full border-t shadow-inner">
      <div className="container flex items-center justify-between bg-white  px-4 h-14 lg:h-16  box-border">
        <div className="flex gap-2">
          <Image
            priority
            width={960}
            height={960}
            src={`${product.images?.[0]}?w=960&h=960`}
            alt=""
            className="w-8 h-8 lg:w-12 lg:h-12 rounded object-cover object-center"
          />
          <div className="flex flex-col justify-center">
            <AmountFormat value={product?.price || 0} className="lg:mt-1" />
          </div>
        </div>
        <div className="flex items-center lg:items-end gap-2 bg-white">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShare()}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <Icons.share className="w-4 h-4" />
            分享
          </Button>
          <CheckoutSheet product={product}>
            <Button
              onClick={(e) => {
                if (!me) {
                  e.preventDefault();
                  window.location.href = getLoginUrl();
                }
              }}
              size="sm"
              className={cn("w-full", btnDisabled ? "bg-gray-300" : "")}
              disabled={btnDisabled}
            >
              {btnText}
            </Button>
          </CheckoutSheet>
        </div>
      </div>
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        posterUrl={posterUrl}
        posterTitle="海报"
        commission={product?.commission || undefined}
        userName={product.title || undefined}
      />
    </div>
  );
};

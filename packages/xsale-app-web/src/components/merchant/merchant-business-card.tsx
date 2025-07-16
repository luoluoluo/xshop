"use client";
import { cn } from "@/utils";
import { Merchant } from "@/generated/graphql";
import { Contact } from "../contact/contact";
import { Button } from "../ui/button";
import { MerchantImages } from "./merchant-images";

export const sliceText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) => {
  let currentText = text;
  while (currentText.length > 0) {
    const w = ctx.measureText(currentText).width;
    if (w < maxWidth) {
      return {
        end: currentText.length,
        text: currentText,
      };
    }
    currentText = currentText.slice(0, currentText.length - 1);
  }
  return {
    end: 0,
    text: "",
  };
};

export const MerchantBusinessCard = function ({
  merchant,
  className,
}: {
  merchant?: Merchant;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <MerchantImages
        data={merchant?.images || []}
        className="mt-4 rounded overflow-hidden"
      />
      <div className="w-full h-auto shadow rounded p-4 mt-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center">
              <img
                src={merchant?.logo || ""}
                alt={merchant?.name || ""}
                className="w-auto h-4 object-contain rounded flex-shrink-0"
              />
              <div className="text-base leading-none ml-1 font-bold">
                {merchant?.name}
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {merchant?.address}
            </div>
          </div>
          <Contact merchant={{ ...merchant!, phone: "", wechatQrcode: "" }}>
            <Button size="sm" className="text-xs">
              立即联系
            </Button>
          </Contact>
        </div>
        <div className="text-base mt-4 text-gray-500 border-t pt-4">
          {merchant?.businessScope}
        </div>
      </div>

      {merchant?.description ? (
        <div className="shadow mt-4 p-4 rounded">
          <div
            className="w-full wysiwyg"
            dangerouslySetInnerHTML={{
              __html: merchant?.description || "",
            }}
          />
        </div>
      ) : null}
      {/* <Dialog
        open={!!canvasUrl}
        onOpenChange={open => {
          if (!open) setCanvasUrl(undefined);
        }}
      >
        <DialogContent onInteractOutside={e => e.preventDefault()} onOpenAutoFocus={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>长按图片，保存到手机</DialogTitle>
          </DialogHeader>
          {canvasUrl ? <NextImage src={canvasUrl} width={400} height={400} alt="名片" className="w-full h-auto" /> : null}
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

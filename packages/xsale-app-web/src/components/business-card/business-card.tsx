"use client";
import { cn } from "@/utils";
// import { QRCodeCanvas } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Merchant } from "@/generated/graphql";
import { getChannel } from "@/utils/index.client";
import NextImage from "next/image";
import QRCode from "qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Contact } from "../contact/contact";

export const sliceText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  while (true) {
    let end = text.length;
    const w = ctx.measureText(text).width;
    if (w < maxWidth) {
      return {
        end,
        text
      };
    }
    text = text.slice(0, end - 1);
  }
};

export const BusinessCard = function ({
  merchant,
  className,
  showAction
}: {
  merchant?: Merchant;
  className?: string;
  showAction?: boolean;
}) {
  const [canvasUrl, setCanvasUrl] = useState<string>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState<"hire" | "download">();

  const businessCardWidth = 1440;
  const businessCardHeight = 864;

  useEffect(() => {
    if (!merchant) {
      return;
    }
    const u = new URL(window.location.href);
    u.searchParams.set("aff", merchant?.affiliate?.id!);
    setUrl(u.toString());
  }, [merchant]);

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, onSuccess: () => void) => {
    // 背景图
    const backgroundImg = new Image();
    backgroundImg.crossOrigin = "anonymous";
    backgroundImg.src = "/images/business-card.jpg";
    backgroundImg.onload = () => {
      // 绘制背景图，覆盖整个画布
      ctx.drawImage(backgroundImg, 0, 0, businessCardWidth, businessCardHeight);

      // 可选：添加半透明遮罩层以确保文字可读性
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(0, 0, businessCardWidth, businessCardHeight);
      onSuccess();
    };
  }, []);

  const drawContent = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const logoX = 64,
        logoY = 64,
        logoW = 64,
        logoH = 64;
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.src = `${merchant?.logo}?w=64&h=64`; // 图片路径
      logoImg.onload = () => {
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.roundRect(logoX, logoY, logoW, logoH, [8]);
        ctx.stroke();
        const pattern = ctx.createPattern(logoImg, "no-repeat");
        if (pattern) {
          ctx.translate(logoX, logoY);
          ctx.fillStyle = pattern;
          ctx.fill();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
      };

      const nameX = 144,
        nameY = 118;
      ctx.fillStyle = "#18181b";
      ctx.font = "64px Microsoft YaHei";
      ctx.fillText(`${merchant?.name || ""}`, nameX, nameY);

      const affiliateNameX = 64,
        affiliateNameY = nameY + 256;
      ctx.fillStyle = "#18181b";
      ctx.font = "96px Microsoft YaHei";
      ctx.fillText(merchant?.affiliate?.name || "", affiliateNameX, affiliateNameY);

      let phoneX = 64,
        phoneY = affiliateNameY + 128;
      ctx.fillStyle = "#18181b";
      ctx.font = "bold 64px Microsoft YaHei";
      ctx.fillText("电话：", phoneX, phoneY);
      ctx.fillStyle = "#18181b";
      ctx.font = "64px Microsoft YaHei";
      ctx.fillText(merchant?.affiliate?.phone || "", phoneX + 192, phoneY);

      let addressX = 64,
        addressY = phoneY + 96;
      ctx.fillStyle = "#18181b";
      ctx.font = "bold 64px Microsoft YaHei";
      ctx.fillText("地址：", addressX, addressY);
      ctx.fillStyle = "#18181b";
      ctx.font = "64px Microsoft YaHei";
      ctx.fillText(sliceText(ctx, merchant?.address || "", businessCardWidth - 320).text, addressX + 192, addressY);

      let businessX = 64,
        businessY = 800;
      ctx.fillStyle = "#18181b";
      ctx.font = "bold 64px Microsoft YaHei";
      ctx.fillText(sliceText(ctx, merchant?.businessScope || "", businessCardWidth - 128).text, businessX, businessY);

      const qrcodeX = 1176,
        qrcodeY = 64,
        qrcodeW = 200,
        qrcodeH = 200;
      // 二维码
      QRCode.toCanvas(url, {
        width: qrcodeW,
        margin: 0
      })
        .then(res => {
          ctx.drawImage(res, qrcodeX, qrcodeY, qrcodeW, qrcodeH);
        })
        .catch(e => {
          console.log(e, 111);
        });
      ctx.fillStyle = "#18181b";
      ctx.font = "22px Microsoft YaHei";
      ctx.fillText("微信扫码，查看更多", qrcodeX, qrcodeY + qrcodeH + 32);
    },
    [merchant, url]
  );

  const drawBusinessCard = useCallback(() => {
    if (!merchant || !url) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // ctx.reset();

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, businessCardWidth, businessCardHeight);
    drawBackground(ctx, () => {
      drawContent(ctx);
    });
  }, [merchant, url, drawBackground, drawContent]);

  useEffect(() => {
    drawBusinessCard();
  }, [merchant, url, drawBusinessCard]);

  return (
    <div className={cn(className)}>
      {/* <div
        dangerouslySetInnerHTML={{
          __html: canvas1
        }}
      /> */}
      {/* <QRCodeCanvas ref={qrcodeCanvas} value="2222"  size={256} className=" hidden" /> */}
      <canvas
        ref={canvasRef}
        width={businessCardWidth}
        height={businessCardHeight}
        className="w-full h-auto shadow rounded"
      ></canvas>
      {showAction && url ? (
        <>
          <div className="mt-4 flex justify-between gap-4">
            {/* </Button> */}
            <Button
              variant="outline"
              onClick={() => {
                if (loading === "download") return;
                setLoading("download");
                if (getChannel() === "wechat") {
                  const res = canvasRef.current?.toDataURL();
                  setCanvasUrl(res);
                } else {
                  canvasRef.current?.toBlob(blob => {
                    if (!blob) return;
                    // const newImg = document.createElement("img");
                    const url = URL.createObjectURL(blob);
                    const el = document.createElement("a");
                    el.href = url;
                    el.download = `${merchant?.name}的名片.png`;
                    el.target = "_blank";
                    el.click();
                  });
                }
                setLoading(undefined);
              }}
              className="w-full"
            >
              下载名片
            </Button>

            <Contact merchant={merchant!}>
              <Button className="w-full">立即联系</Button>
            </Contact>
          </div>
          <div className="shadow mt-4 p-4 rounded">
            <div
              className="w-full overflow-hidden transition-[max-height] ease-in-out duration-200 max-h-32 lg:max-h-fit whitespace-pre-wrap wysiwyg"
              dangerouslySetInnerHTML={{ __html: merchant?.description || "" }}
            />
          </div>
        </>
      ) : null}
      <Dialog
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
      </Dialog>
    </div>
  );
};

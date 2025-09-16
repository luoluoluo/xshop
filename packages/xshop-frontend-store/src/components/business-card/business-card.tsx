"use client";
import { AFFILIATE_ID_KEY, cn } from "@/utils";
// import { QRCodeCanvas } from "qrcode.react";
import { User } from "@/generated/graphql";
import QRCode from "qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import { Clipboard } from "../clipboard";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { useAuth } from "@/contexts/auth";
import { ShareDialog } from "../share-dialog/share-dialog";

import { Contact } from "../contact/contact";

export const sliceText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) => {
  while (text.length > 0) {
    const end = text.length;
    const w = ctx.measureText(text).width;
    if (w < maxWidth) {
      return {
        end,
        text,
      };
    }
    text = text.slice(0, end - 1);
  }
};

export const BusinessCard = function ({
  user,
  className,
}: {
  user?: User;
  className?: string;
}) {
  const { me } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [canvasUrl, setCanvasUrl] = useState<string>();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState<"hire" | "download">();
  const url = `https://xltzx.com/${user?.slug}`;

  // 名片尺寸 90mm * 54mm
  const scale = 16;
  const businessCardWidth = 90 * scale;
  const businessCardHeight = 54 * scale;

  const drawBackground = useCallback(
    (ctx: CanvasRenderingContext2D, onSuccess: () => void) => {
      // 背景图
      const backgroundImg = new Image();
      backgroundImg.crossOrigin = "anonymous";
      backgroundImg.src = user?.backgroundImage
        ? `${user?.backgroundImage}?w=${businessCardWidth}&h=${businessCardHeight}`
        : "/images/business-card.jpg";
      backgroundImg.onload = () => {
        // 绘制背景图，覆盖整个画布
        ctx.drawImage(
          backgroundImg,
          0,
          0,
          businessCardWidth,
          businessCardHeight,
        );

        // 可选：添加半透明遮罩层以确保文字可读性
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(0, 0, businessCardWidth, businessCardHeight);
        onSuccess();
      };
    },
    [],
  );

  const drawContent = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // 设置文字基线为中间
      ctx.textBaseline = "middle";

      const photoX = 64,
        photoY = 64,
        photoW = 144,
        photoH = 144;
      // const logoX = 64,
      //   logoY = 64,
      //   logoW = 64,
      //   logoH = 64;
      const photoImg = new Image();
      photoImg.crossOrigin = "anonymous";
      photoImg.src = `${user?.avatar}?w=${photoW}&h=${photoH}`; // 图片路径
      photoImg.onload = () => {
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoW, photoH, [8]);
        ctx.stroke();
        const pattern = ctx.createPattern(photoImg, "no-repeat");
        if (pattern) {
          ctx.translate(photoX, photoY);
          ctx.fillStyle = pattern;
          ctx.fill();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
      };

      const nameX = photoW + 64 + 32,
        nameY = 64 + 64 / 2 + 8;
      ctx.fillStyle = "#18181b";
      ctx.font = "64px Microsoft YaHei";
      ctx.fillText(`${user?.name || ""}`, nameX, nameY);

      const titleX = photoW + 64 + 32,
        titleY = nameY + 64 + 16;
      ctx.fillStyle = "#333";
      ctx.font = "48px Microsoft YaHei";
      ctx.fillText(user?.title || "", titleX, titleY);

      /** 联系方式 start */
      let contactY = businessCardHeight - 64 - 24;
      const contactX = 64;
      const contactLabelX = 144;
      if (user?.slug) {
        const slugX = contactX,
          slugY = contactY;
        ctx.fillStyle = "#18181b";
        ctx.font = "48px Microsoft YaHei";
        ctx.fillText("网址：", slugX, slugY);
        ctx.fillStyle = "#18181b";
        ctx.font = "48px Microsoft YaHei";
        ctx.fillText(`${url}`, slugX + contactLabelX, slugY);

        contactY -= 80;
      }
      if (user?.email) {
        const emailX = contactX,
          emailY = contactY;
        ctx.fillStyle = "#18181b";
        ctx.font = "48px Microsoft YaHei";
        ctx.fillText("邮箱：", emailX, emailY);
        ctx.fillStyle = "#18181b";
        ctx.font = "48px Microsoft YaHei";
        ctx.fillText(user?.email || "", emailX + contactLabelX, emailY);

        contactY -= 80;
      }

      if (user?.wechatId) {
        const wechatX = contactX,
          wechatY = contactY;
        ctx.fillStyle = "#18181b";
        ctx.font = "48px Microsoft YaHei";
        ctx.fillText("微信：", wechatX, wechatY);
        ctx.fillStyle = "#18181b";
        ctx.font = "48px Microsoft YaHei";
        ctx.fillText(user?.wechatId || "", wechatX + contactLabelX, wechatY);

        contactY -= 80;
      }

      if (user?.phone) {
        const phoneX = contactX,
          phoneY = contactY;
        ctx.fillStyle = "#18181b";
        ctx.font = "48px Microsoft YaHei";
        ctx.fillText("电话：", phoneX, phoneY);
        ctx.fillStyle = "#18181b";
        ctx.font = "48px Microsoft YaHei";
        ctx.fillText(user?.phone || "", phoneX + contactLabelX, phoneY);
      }

      const qrcodeX = 1176,
        qrcodeY = businessCardHeight - 200 - 64,
        qrcodeW = 200,
        qrcodeH = 200;
      // 二维码
      QRCode.toCanvas(`${url}?${AFFILIATE_ID_KEY}=${me?.id}`, {
        width: 200,
        margin: 0,
      })
        .then((res) => {
          ctx.drawImage(res, qrcodeX, qrcodeY, qrcodeW, qrcodeH);
        })
        .catch((e) => {
          console.log(e, 111);
        });
    },
    [user, url],
  );

  const drawBusinessCard = useCallback(() => {
    if (!user || !url) return;

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
  }, [user, url, drawBackground, drawContent]);

  useEffect(() => {
    drawBusinessCard();
  }, [user, url, drawBusinessCard]);

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
      {url ? (
        <>
          <div className="mt-4 flex justify-between gap-4">
            {/* </Button> */}
            <Button
              variant="outline"
              onClick={() => {
                if (loading === "download") return;
                setLoading("download");
                // 生成名片图片用于分享
                const res = canvasRef.current?.toDataURL();
                setCanvasUrl(res);
                setShareDialogOpen(true);
                setLoading(undefined);
              }}
              className="w-full"
            >
              分享名片
            </Button>

            <Contact user={user}>
              <Button className="w-full">立即联系</Button>
            </Contact>
          </div>
          <div className="shadow mt-4 p-4 rounded relative">
            <div
              className={cn(
                `w-full overflow-hidden transition-[max-height] ease-in-out duration-200 max-h-24 lg:max-h-fit whitespace-pre-wrap`,
                expanded ? "max-h-fit" : "",
              )}
            >
              {user?.description}
              <div className="h-6"></div>
            </div>
            <div
              className={cn(
                `absolute bottom-4 left-0 w-full flex justify-center lg:hidden`,
                expanded ? "rotate-180" : "",
              )}
              onClick={() => setExpanded(!expanded)}
            >
              <Icons.arrow className="w-4 h-4 animate-bounce bg-white/20" />
            </div>
          </div>
        </>
      ) : null}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        posterTitle="名片"
        posterUrl={canvasUrl}
        userName={user?.name || undefined}
      />
    </div>
  );
};

"use client";

import { Product, User } from "@/generated/graphql";
import { AFFILIATE_ID_KEY } from "@/utils";
import QRCode from "qrcode";
import { useCallback, useEffect, useRef } from "react";

interface ProductPosterProps {
  product: Product;
  className?: string;
  me?: User;
}

export const ProductPoster = ({
  product,
  className,
  me,
}: ProductPosterProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generatePoster = useCallback(async () => {
    if (!canvasRef.current || !product) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 海报尺寸 750px * 1334px (iPhone 6/7/8 尺寸)
    const posterWidth = 750;
    const posterHeight = 1334;
    canvas.width = posterWidth;
    canvas.height = posterHeight;

    // 背景色
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, posterWidth, posterHeight);

    try {
      // 加载商品图片
      const productImage = new Image();
      productImage.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        productImage.onload = resolve;
        productImage.onerror = reject;
        productImage.src = `${product.images?.[0]}?w=750&h=750`;
      });

      // 绘制商品图片 (顶部，占海报的60%)
      const imageHeight = Math.floor(posterHeight * 0.6);
      const imageWidth = posterWidth;
      ctx.drawImage(productImage, 0, 0, imageWidth, imageHeight);

      // 添加渐变遮罩
      const gradient = ctx.createLinearGradient(
        0,
        imageHeight - 100,
        0,
        imageHeight,
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, imageHeight - 100, imageWidth, 100);

      // 生成二维码
      const productUrl = `${window.location.origin}/product/${product.id}`;
      const qrCodeDataUrl = await QRCode.toDataURL(productUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      const qrCodeImage = new Image();
      await new Promise((resolve, reject) => {
        qrCodeImage.onload = resolve;
        qrCodeImage.onerror = reject;
        qrCodeImage.src = qrCodeDataUrl;
      });

      // 内容区域 (底部40%)
      const contentY = imageHeight;
      const padding = 40;

      // 绘制商品标题
      ctx.fillStyle = "#333333";
      ctx.font =
        "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "left";

      // 标题换行处理
      const title = product.title || "";
      const maxTitleWidth = posterWidth - padding * 2;
      const titleLines = wrapText(ctx, title, maxTitleWidth);

      let currentY = contentY + padding + 40;
      titleLines.forEach((line, index) => {
        if (index < 3) {
          // 最多显示3行标题
          ctx.fillText(line, padding, currentY);
          currentY += 45;
        }
      });

      // 绘制价格
      ctx.fillStyle = "#ff4444";
      ctx.font =
        "bold 48px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "left";
      const priceText = `¥${(product.price || 0).toFixed(2)}`;
      ctx.fillText(priceText, padding, currentY + 20);

      // 绘制二维码 (右侧)
      const qrSize = 160;
      const qrX = posterWidth - padding - qrSize;
      const qrY = currentY - 20;
      ctx.drawImage(qrCodeImage, qrX, qrY, qrSize, qrSize);

      // 绘制二维码说明文字
      ctx.fillStyle = "#666666";
      ctx.font =
        "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("扫码查看详情", qrX + qrSize / 2, qrY + qrSize + 30);

      // 绘制底部装饰线
      ctx.strokeStyle = "#f0f0f0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, posterHeight - 60);
      ctx.lineTo(posterWidth - padding, posterHeight - 60);
      ctx.stroke();

      // 绘制底部文字
      ctx.fillStyle = "#999999";
      ctx.font =
        "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("长按识别二维码", posterWidth / 2, posterHeight - 20);

      // 生成海报URL
      const dataUrl = canvas.toDataURL("image/png", 0.9);
      console.log("商品海报生成成功:", dataUrl);
    } catch (error) {
      console.error("生成商品海报失败:", error);
    }
  }, [product]);

  // 文本换行函数
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ): string[] => {
    const words = text.split("");
    const lines: string[] = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i];
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine !== "") {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  useEffect(() => {
    void generatePoster();
  }, [generatePoster]);

  return (
    <canvas
      ref={canvasRef}
      width={750}
      height={1334}
      className={`w-full h-auto shadow rounded ${className || ""}`}
      style={{ display: "none" }}
    />
  );
};

// 导出生成海报URL的函数，供其他组件使用
export const generateProductPosterUrl = async (
  product: Product,
  me?: User,
): Promise<string> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法创建canvas上下文");

  // 海报尺寸
  const posterWidth = 750;
  const posterHeight = 1334;
  canvas.width = posterWidth;
  canvas.height = posterHeight;

  // 背景色
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, posterWidth, posterHeight);

  try {
    // 加载商品图片
    const productImage = new Image();
    productImage.crossOrigin = "anonymous";

    await new Promise((resolve, reject) => {
      productImage.onload = resolve;
      productImage.onerror = reject;
      productImage.src = `${product.images?.[0]}?w=750&h=750`;
    });

    // 绘制商品图片
    const imageHeight = Math.floor(posterHeight * 0.6);
    const imageWidth = posterWidth;
    ctx.drawImage(productImage, 0, 0, imageWidth, imageHeight);

    // 添加渐变遮罩
    const gradient = ctx.createLinearGradient(
      0,
      imageHeight - 100,
      0,
      imageHeight,
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 1)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, imageHeight - 100, imageWidth, 100);

    // 生成二维码
    let productUrl = `${window.location.origin}/product/${product.id}`;
    if (me) {
      productUrl = `${productUrl}?${AFFILIATE_ID_KEY}=${me.id}`;
    }

    const qrCodeDataUrl = await QRCode.toDataURL(productUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    const qrCodeImage = new Image();
    await new Promise((resolve, reject) => {
      qrCodeImage.onload = resolve;
      qrCodeImage.onerror = reject;
      qrCodeImage.src = qrCodeDataUrl;
    });

    // 内容区域
    const contentY = imageHeight;
    const padding = 40;

    // 绘制商品标题
    ctx.fillStyle = "#333333";
    ctx.font =
      "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "left";

    const title = product.title || "";
    const maxTitleWidth = posterWidth - padding * 2;
    const titleLines = wrapText(ctx, title, maxTitleWidth);

    let currentY = contentY + padding + 40;
    titleLines.forEach((line, index) => {
      if (index < 3) {
        ctx.fillText(line, padding, currentY);
        currentY += 45;
      }
    });

    // 绘制价格
    ctx.fillStyle = "#ff4444";
    ctx.font =
      "bold 48px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "left";
    const priceText = `¥${(product.price || 0).toFixed(2)}`;
    ctx.fillText(priceText, padding, currentY + 20);

    // 绘制二维码
    const qrSize = 160;
    const qrX = posterWidth - padding - qrSize;
    const qrY = currentY - 20;
    ctx.drawImage(qrCodeImage, qrX, qrY, qrSize, qrSize);

    // 绘制二维码说明文字
    ctx.fillStyle = "#666666";
    ctx.font =
      "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("扫码查看详情", qrX + qrSize / 2, qrY + qrSize + 30);

    // 绘制底部装饰线
    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, posterHeight - 60);
    ctx.lineTo(posterWidth - padding, posterHeight - 60);
    ctx.stroke();

    // 绘制底部文字
    ctx.fillStyle = "#999999";
    ctx.font =
      "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("长按识别二维码", posterWidth / 2, posterHeight - 20);

    return canvas.toDataURL("image/png", 0.9);
  } catch (error) {
    console.error("生成商品海报失败:", error);
    throw error;
  }
};

// 文本换行函数
const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] => {
  const words = text.split("");
  const lines: string[] = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + words[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine !== "") {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

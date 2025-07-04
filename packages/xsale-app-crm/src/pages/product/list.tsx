import { List, useTable } from "@refinedev/antd";
import { useGetIdentity, useTranslate } from "@refinedev/core";
import { Table, Tooltip, Button, Modal, Spin, message } from "antd";
import { parse } from "graphql";
import { getProducts } from "../../requests/product";
import { Affiliate, Merchant, Product } from "../../generated/graphql";
import {
  InfoCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import QRCode from "qrcode";
import React, { useState, useEffect } from "react";
import { Clipboard } from "../../components/clipboard";

// 二维码组件
const QRCodeImage: React.FC<{ content: string; size: number }> = ({
  content,
  size,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!content) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const dataUrl = await QRCode.toDataURL(content, {
          width: 128,
          margin: 1,
        });

        setQrCodeUrl(dataUrl);
      } catch (err) {
        console.error("Failed to generate QR code:", err);
        setQrCodeUrl("");
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [content, size]);

  if (loading) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
        }}
      >
        <Spin size="small" />
      </div>
    );
  }
  return (
    <img
      src={qrCodeUrl}
      alt="QR Code"
      style={{
        width: size,
        height: size,
        borderRadius: "4px",
      }}
    />
  );
};

export const ProductList = () => {
  const { data: me } = useGetIdentity<Affiliate>();
  const t = useTranslate();
  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getProducts),
    },
  });

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [generating, setGenerating] = useState(false);

  const getAffiliateLink = (id: string) => {
    return `${window.location.origin}/product/${id}?affiliateId=${me?.id}`;
  };

  // 简单的回退方案：在产品图片右下角添加二维码
  const getSimpleFallbackPoster = async (product: Product): Promise<string> => {
    if (!product.image) {
      throw new Error("产品图片缺失");
    }

    const qrCodeDataUrl = await QRCode.toDataURL(getAffiliateLink(product.id), {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    const posterImage = new Image();
    const qrCodeImage = new Image();

    return new Promise((resolve, reject) => {
      let loadedCount = 0;
      const checkBothLoaded = () => {
        loadedCount++;
        if (loadedCount === 2) {
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d")!;

            canvas.width = posterImage.naturalWidth;
            canvas.height = posterImage.naturalHeight;

            // 绘制产品图片
            ctx.drawImage(posterImage, 0, 0);

            // 在右下角添加二维码
            const qrSize = Math.min(
              150,
              Math.min(canvas.width, canvas.height) * 0.25,
            );
            const margin = 20;
            const qrX = canvas.width - qrSize - margin;
            const qrY = canvas.height - qrSize - margin;

            // 绘制白色背景
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

            // 绘制二维码
            ctx.drawImage(qrCodeImage, qrX, qrY, qrSize, qrSize);

            resolve(canvas.toDataURL("image/png", 0.9));
          } catch (error) {
            reject(error);
          }
        }
      };

      posterImage.onload = checkBothLoaded;
      posterImage.onerror = () => reject(new Error("产品图片加载失败"));

      qrCodeImage.onload = checkBothLoaded;
      qrCodeImage.onerror = () => reject(new Error("二维码生成失败"));

      posterImage.crossOrigin = "anonymous";
      qrCodeImage.crossOrigin = "anonymous";

      posterImage.src = product.image!;
      qrCodeImage.src = qrCodeDataUrl;
    });
  };

  // 使用product.poster和posterQrcodeConfig生成精确定位的海报
  const getPrecisionPoster = async (product: Product): Promise<string> => {
    if (!product.poster || !product.posterQrcodeConfig) {
      throw new Error("产品海报或二维码配置缺失");
    }

    if (
      !product.posterQrcodeConfig.x ||
      !product.posterQrcodeConfig.y ||
      !product.posterQrcodeConfig.w ||
      !product.posterQrcodeConfig.h
    ) {
      throw new Error("二维码配置不完整");
    }

    const config = {
      x: product.posterQrcodeConfig.x,
      y: product.posterQrcodeConfig.y,
      w: product.posterQrcodeConfig.w,
      h: product.posterQrcodeConfig.h,
    };

    const qrCodeDataUrl = await QRCode.toDataURL(getAffiliateLink(product.id), {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    const posterImage = new Image();
    const qrCodeImage = new Image();

    return new Promise((resolve, reject) => {
      let loadedCount = 0;
      const checkBothLoaded = () => {
        loadedCount++;
        if (loadedCount === 2) {
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d")!;

            canvas.width = posterImage.naturalWidth;
            canvas.height = posterImage.naturalHeight;

            // 绘制海报
            ctx.drawImage(posterImage, 0, 0);

            // 根据配置精确绘制二维码
            ctx.drawImage(qrCodeImage, config.x, config.y, config.w, config.h);

            // 在二维码下方添加文字"长按识别二维码"，带白色背景
            const text = "长按识别二维码";
            const fontSize = Math.max(12, config.w * 0.08); // 根据二维码大小调整字体大小
            const textY = config.y + config.h - fontSize / 2; // 紧贴QR码底部，无间隙

            ctx.font = `${fontSize}px Arial, "Microsoft YaHei", sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";

            // 计算文字位置（二维码中心对齐）
            const textX = config.x + config.w / 2;

            // 绘制白色背景矩形，宽度和QR码一致
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(
              config.x, // 和QR码左边对齐
              textY,
              config.w, // 宽度和QR码一致
              fontSize + 8, // 文字高度 + 上下padding
            );

            // 绘制黑色文字
            ctx.fillStyle = "#333333";
            ctx.fillText(text, textX, textY + 4); // 向下偏移4px作为上边距

            resolve(canvas.toDataURL("image/png", 0.9));
          } catch (error) {
            reject(error);
          }
        }
      };

      posterImage.onload = checkBothLoaded;
      posterImage.onerror = () => reject(new Error("海报加载失败"));

      qrCodeImage.onload = checkBothLoaded;
      qrCodeImage.onerror = () => reject(new Error("二维码生成失败"));

      posterImage.crossOrigin = "anonymous";
      qrCodeImage.crossOrigin = "anonymous";

      posterImage.src = product.poster!;
      qrCodeImage.src = qrCodeDataUrl;
    });
  };

  const getAffiliatePoster = async (product: Product): Promise<string> => {
    // 优先使用精确配置的海报
    if (product.poster && product.posterQrcodeConfig) {
      try {
        return await getPrecisionPoster(product);
      } catch (error) {
        console.warn("精确海报生成失败，回退到默认方式:", error);
      }
    }

    // 回退到简单方案：使用product.image
    if (!product.image) {
      throw new Error("产品图片是生成海报的必要条件");
    }

    return await getSimpleFallbackPoster(product);
  };

  const showPosterPreview = async (product: Product) => {
    // 检查是否有海报或图片
    if (!product.poster && !product.image) {
      message.error("该产品没有海报和图片，无法生成推广海报");
      return;
    }

    setGenerating(true);
    try {
      const posterDataUrl = await getAffiliatePoster(product);
      setPreviewImage(posterDataUrl);
      setPreviewProduct(product);
      setPreviewVisible(true);
    } catch (error) {
      console.error("Failed to generate poster:", error);
      message.error("海报生成失败：" + (error as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  const downloadCurrentPoster = () => {
    if (!previewImage || !previewProduct) return;

    const link = document.createElement("a");
    link.download = `${previewProduct.title || "product"}_poster.png`;
    link.href = previewImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success("海报下载成功");
  };

  const handleClosePreview = () => {
    setPreviewVisible(false);
    setPreviewImage("");
    setPreviewProduct(null);
  };

  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title={"ID"} />
          <Table.Column
            dataIndex="merchant"
            title={t("product.fields.merchant")}
            render={(merchant: Merchant) => {
              return (
                <div>
                  <div>{merchant?.name || "-"}</div>
                  <div className="text-sm text-gray-500">
                    {merchant?.phone || "-"}
                  </div>
                </div>
              );
            }}
          />
          <Table.Column
            dataIndex="merchantAffiliate"
            title={
              <Tooltip title="该商家的签约推广者，所有订单都返佣">
                {t("product.fields.merchantAffiliate")}
                <InfoCircleOutlined className="ml-1" />
              </Tooltip>
            }
            render={(_, record: Product) => {
              return (
                <div>
                  <div>{record?.merchant?.affiliate?.name || "-"}</div>
                  <div className="text-sm text-gray-500">
                    {record?.merchant?.affiliate?.phone || "-"}
                  </div>
                </div>
              );
            }}
          />
          <Table.Column dataIndex="title" title={t("product.fields.title")} />
          <Table.Column
            dataIndex="price"
            title={t("product.fields.price")}
            render={(price: number) => {
              return <span>{price?.toFixed(2)}</span>;
            }}
          />
          <Table.Column
            dataIndex="merchantAffiliateCommission"
            title={t("product.fields.merchantAffiliateCommission")}
            render={(commission: number) => {
              return <span>{commission?.toFixed(2)}</span>;
            }}
          />
          <Table.Column
            dataIndex="affiliateCommission"
            title={t("product.fields.affiliateCommission")}
            render={(commission: number) => {
              return <span>{commission?.toFixed(2)}</span>;
            }}
          />
          <Table.Column
            dataIndex="affiliateLink"
            title={"分佣链接"}
            render={(_, record: Product) => {
              const link = getAffiliateLink(record.id);
              return (
                <div className="flex flex-col gap-2">
                  <Button type="link" size="small" href={link} target="_blank">
                    {link}
                  </Button>
                  <Clipboard
                    value={link}
                    asChild
                    onSuccess={() => {
                      message.success("复制成功");
                    }}
                  >
                    <Button>复制链接</Button>
                  </Clipboard>
                </div>
              );
            }}
          />
          <Table.Column
            dataIndex="affiliateQRCode"
            title={"分佣二维码"}
            render={(_, record: Product) => {
              const link = getAffiliateLink(record.id);
              return <QRCodeImage content={link} size={64} />;
            }}
          />
          <Table.Column
            title={"推广海报"}
            render={(_, record: Product) => {
              return (
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => {
                    showPosterPreview(record).catch(console.error);
                  }}
                  disabled={!record.poster && !record.image}
                  loading={generating}
                >
                  生成海报
                </Button>
              );
            }}
          />
        </Table>
      </List>

      {/* 海报预览弹窗 */}
      <Modal
        title={`${previewProduct?.title || "产品"} - 推广海报预览`}
        open={previewVisible}
        onCancel={handleClosePreview}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleClosePreview}>
            关闭
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={downloadCurrentPoster}
          >
            下载海报
          </Button>,
        ]}
      >
        {previewImage ? (
          <div style={{ textAlign: "center" }}>
            <img
              src={previewImage}
              alt="推广海报"
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
              }}
            />
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="large" />
            <div style={{ marginTop: "10px" }}>生成海报中...</div>
          </div>
        )}
      </Modal>
    </>
  );
};

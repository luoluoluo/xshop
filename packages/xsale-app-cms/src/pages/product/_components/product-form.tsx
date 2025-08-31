import {
  Form,
  FormProps,
  Input,
  Select,
  Switch,
  InputNumber,
  Card,
  Row,
  Col,
  Spin,
  message,
} from "antd";
import { CustomUpload } from "../../../components/custom-upload";
import { CustomEditor } from "../../../components/custom-editor";
import { useEffect, useState, useCallback } from "react";
import {
  CreateProductInput,
  Merchant,
  MerchantPagination,
  UpdateProductInput,
} from "../../../generated/graphql";
import { request } from "../../../utils/request";
import { useTranslate } from "@refinedev/core";
import { getMerchants } from "../../../requests/merchant";
import QRCode from "qrcode";
import { debounce } from "lodash";
import {
  MERCHANT_AFFILIATE_COMMISSION_PERCENTAGE,
  PLATFORM_FEE_PERCENTAGE,
} from "../../../config/constant";

export const ProductForm = ({ formProps }: { formProps: FormProps }) => {
  const t = useTranslate();

  const [merchants, setMerchants] = useState<Merchant[]>();
  const [posterDimensions, setPosterDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const [generatingPreview, setGeneratingPreview] = useState(false);

  useEffect(() => {
    request<{ merchants?: MerchantPagination }>({
      query: getMerchants,
    }).then((res) => {
      setMerchants(res.data?.merchants?.data || []);
    });
  }, []);
  const price = Form.useWatch<number>("price", formProps.form);
  const poster = Form.useWatch<string>("poster", formProps.form);
  const posterQrcodeConfig = Form.useWatch(
    "posterQrcodeConfig",
    formProps.form,
  );

  // 监听poster变化，获取图片尺寸
  useEffect(() => {
    if (poster) {
      const img = new Image();
      img.onload = () => {
        setPosterDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.onerror = () => {
        setPosterDimensions(null);
      };
      img.src = poster;
    } else {
      setPosterDimensions(null);
    }
    // 清除之前的预览图片
    setPreviewImageUrl("");
  }, [poster]);

  // 创建防抖的预览生成函数
  const debouncedGeneratePreview = useCallback(
    debounce(async () => {
      if (!poster || !posterQrcodeConfig) return;

      const config = posterQrcodeConfig;
      if (
        config.x === undefined ||
        config.y === undefined ||
        !config.w ||
        !config.h
      ) {
        setPreviewImageUrl("");
        return;
      }

      setGeneratingPreview(true);
      try {
        const canvas = await generatePosterWithQRCode();
        setPreviewImageUrl(canvas.toDataURL());
      } catch (error) {
        console.error("生成预览失败:", error);
        setPreviewImageUrl("");
      } finally {
        setGeneratingPreview(false);
      }
    }, 500), // 500ms防抖延迟
    [poster, posterQrcodeConfig],
  );

  // 监听二维码配置变化，使用防抖生成预览
  useEffect(() => {
    if (poster && posterQrcodeConfig) {
      debouncedGeneratePreview();
    } else {
      setPreviewImageUrl("");
    }

    // 清理函数：组件卸载时取消防抖
    return () => {
      debouncedGeneratePreview.cancel();
    };
  }, [poster, posterQrcodeConfig, debouncedGeneratePreview]);

  const onFinish = (values: CreateProductInput | UpdateProductInput) => {
    values.sort = Number(values?.sort || 0);
    values.commission = Number(values?.commission || 0);

    values.price = Number(values?.price || 0);
    values.stock = Number(values?.stock || 0);

    if (formProps.onFinish) {
      formProps.onFinish(values);
    }
  };

  const generatePosterWithQRCode = async (): Promise<HTMLCanvasElement> => {
    if (!poster || !posterQrcodeConfig) {
      throw new Error("海报或二维码配置缺失");
    }

    // 生成二维码
    const qrCodeDataUrl = await QRCode.toDataURL(`${window.location.origin}`, {
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // 加载图片
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

            // 设置canvas尺寸为海报尺寸
            canvas.width = posterImage.naturalWidth;
            canvas.height = posterImage.naturalHeight;

            // 绘制海报
            ctx.drawImage(posterImage, 0, 0);

            // 绘制二维码到指定位置
            const config = posterQrcodeConfig;
            if (
              config.x !== undefined &&
              config.y !== undefined &&
              config.w &&
              config.h
            ) {
              ctx.drawImage(
                qrCodeImage,
                config.x,
                config.y,
                config.w,
                config.h,
              );
            }

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

            resolve(canvas);
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

      posterImage.src = poster;
      qrCodeImage.src = qrCodeDataUrl;
    });
  };

  const renderPreviewContent = () => {
    if (!poster) return null;

    // 如果有生成的预览图，显示它
    if (previewImageUrl) {
      return (
        <Spin spinning={generatingPreview}>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <h4>预览效果：</h4>
            <img
              src={previewImageUrl}
              alt="Poster with QR Code Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                border: "1px solid #d9d9d9",
                borderRadius: 6,
              }}
            />
          </div>
        </Spin>
      );
    }

    // 显示简单的布局预览
    const config = posterQrcodeConfig || {};
    if (config.x !== undefined || config.y !== undefined) {
      const qrCodeStyle = {
        position: "absolute" as const,
        left: `${config.x || 0}px`,
        top: `${config.y || 0}px`,
        width: `${config.w || 100}px`,
        height: `${config.h || 100}px`,
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "12px",
        border: "2px dashed #666",
      };

      return (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <h4>布局预览：</h4>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={poster}
              alt="Poster Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                border: "1px solid #d9d9d9",
                borderRadius: 6,
              }}
            />
            <div style={qrCodeStyle}>
              QR Code
              <br />
              {config.w}×{config.h}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Form {...{ ...formProps, onFinish }} layout="vertical">
      <Form.Item
        label={t("product.fields.merchant")}
        name={["merchantId"]}
        rules={[{ required: true }]}
      >
        <Select
          options={
            merchants?.map((item) => ({
              label: item.name,
              value: item.id,
              disabled: !item.isActive,
            })) || []
          }
        />
      </Form.Item>

      <Form.Item
        label={t("product.fields.image")}
        name={["image"]}
        rules={[{ required: true }]}
        extra="建议尺寸：正方形，宽高比为1:1"
      >
        <CustomUpload />
      </Form.Item>

      <Form.Item
        label="海报"
        name={["poster"]}
        extra="自动为每个推广者生成专属推广海报"
      >
        <CustomUpload />
      </Form.Item>

      {poster && (
        <Form.Item>
          <Card
            title={
              <div>
                <span>海报二维码配置</span>
                {posterDimensions && (
                  <span
                    style={{
                      marginLeft: 16,
                      color: "#666",
                      fontWeight: "normal",
                      fontSize: "14px",
                    }}
                  >
                    海报尺寸: {posterDimensions.width} ×{" "}
                    {posterDimensions.height}
                    px
                  </span>
                )}
              </div>
            }
            size="small"
          >
            {posterDimensions && (
              <div
                style={{
                  marginBottom: 16,
                  padding: 12,
                  backgroundColor: "#f0f9ff",
                  borderRadius: 6,
                  border: "1px solid #bae6fd",
                }}
              >
                <div style={{ fontSize: "13px", color: "#0369a1" }}>
                  <strong>参考信息：</strong>
                  <br />
                  海报宽度: {posterDimensions.width}px，高度:{" "}
                  {posterDimensions.height}px
                  <br />
                  请根据海报尺寸配置二维码的位置(X,Y坐标)和大小(宽度,高度)
                </div>
              </div>
            )}
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="X坐标" name={["posterQrcodeConfig", "x"]}>
                  <InputNumber
                    placeholder="X坐标"
                    style={{ width: "100%" }}
                    min={0}
                    max={posterDimensions?.width || undefined}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Y坐标" name={["posterQrcodeConfig", "y"]}>
                  <InputNumber
                    placeholder="Y坐标"
                    style={{ width: "100%" }}
                    min={0}
                    max={posterDimensions?.height || undefined}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="宽度" name={["posterQrcodeConfig", "w"]}>
                  <InputNumber
                    placeholder="宽度"
                    style={{ width: "100%" }}
                    min={1}
                    max={
                      posterDimensions
                        ? posterDimensions.width - (posterQrcodeConfig?.x || 0)
                        : undefined
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="高度" name={["posterQrcodeConfig", "h"]}>
                  <InputNumber
                    placeholder="高度"
                    style={{ width: "100%" }}
                    min={1}
                    max={
                      posterDimensions
                        ? posterDimensions.height - (posterQrcodeConfig?.y || 0)
                        : undefined
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            {renderPreviewContent()}
          </Card>
        </Form.Item>
      )}

      <Form.Item
        label={t("product.fields.title")}
        name={["title"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label={t("product.fields.description")} name={["description"]}>
        <Input maxLength={200} />
      </Form.Item>

      <Form.Item
        label={t("product.fields.price")}
        name={["price"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("product.fields.commission")}
        name={["commission"]}
        rules={[
          { required: true },
          {
            pattern: /^[1-9]\d*$/,
            message: "佣金比例必须为正整数",
          },
          {
            validator: (_, value) => {
              const rate = (value / (price ?? 0)) * 100;
              if (rate && rate > 30) {
                return Promise.reject(new Error("佣金比例不能大于30%"));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("product.fields.stock")}
        name={["stock"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("product.fields.content")}
        name={["content"]}
        rules={[{ required: true }]}
      >
        <CustomEditor />
      </Form.Item>

      <Form.Item label={t("fields.isActive.label")} name={["isActive"]}>
        <Switch />
      </Form.Item>
    </Form>
  );
};

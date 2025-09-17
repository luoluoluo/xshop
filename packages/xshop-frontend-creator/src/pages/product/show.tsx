import { Show } from "@refinedev/antd";
import { useShow, useTranslate } from "@refinedev/core";
import { Card, Row, Col, Tag, Image, Descriptions } from "antd";
import { parse } from "graphql";
import { PRODUCT_QUERY } from "../../requests/product.graphql";
import dayjs from "dayjs";

export const ProductShow = () => {
  const t = useTranslate();
  const { query } = useShow({
    meta: {
      gqlQuery: parse(PRODUCT_QUERY),
    },
  });
  const { data, isLoading } = query;

  const record = data?.data;

  const commissionRate =
    record?.price && record?.commission
      ? ((record.commission / record.price) * 100).toFixed(2)
      : "0.00";

  return (
    <Show isLoading={isLoading}>
      <Card title="产品图片" style={{ marginBottom: 16 }}>
        {record?.images && record.images.length > 0 ? (
          <Image.PreviewGroup>
            <Row gutter={[8, 8]}>
              {record.images.map((image: string, index: number) => (
                <Col key={index} span={8}>
                  <Image
                    src={image}
                    alt={`${record.title} - ${index + 1}`}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                    }}
                  />
                </Col>
              ))}
            </Row>
          </Image.PreviewGroup>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "#999",
            }}
          >
            暂无图片
          </div>
        )}
      </Card>

      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions column={1}>
          <Descriptions.Item label={t("product.fields.id")}>
            {record?.id}
          </Descriptions.Item>
          <Descriptions.Item label={t("product.fields.title")}>
            {record?.title}
          </Descriptions.Item>
          <Descriptions.Item label={t("product.fields.description")}>
            {record?.description || "暂无描述"}
          </Descriptions.Item>
          <Descriptions.Item label={t("product.fields.isActive.label")}>
            <Tag color={record?.isActive ? "green" : "red"}>
              {record?.isActive
                ? t("product.fields.isActive.true")
                : t("product.fields.isActive.false")}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="价格信息" style={{ marginBottom: 16 }}>
        <Descriptions column={1}>
          <Descriptions.Item label={t("product.fields.price")}>
            ¥{record?.price?.toFixed(2) || "0.00"}
          </Descriptions.Item>
          <Descriptions.Item label={t("product.fields.commission")}>
            ¥{record?.commission?.toFixed(2) || "0.00"}
          </Descriptions.Item>
          <Descriptions.Item label="佣金比例">
            <span style={{ color: "#1890ff", fontWeight: "bold" }}>
              {commissionRate}%
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="库存信息" style={{ marginBottom: 16 }}>
        <Descriptions column={1}>
          <Descriptions.Item label={t("product.fields.stock")}>
            <span
              style={{
                color:
                  record?.stock && record.stock > 0 ? "#52c41a" : "#ff4d4f",
                fontWeight: "bold",
              }}
            >
              {record?.stock || 0}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={t("fields.sort")}>
            {record?.sort || 0}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="时间信息">
        <Descriptions column={1}>
          <Descriptions.Item label={t("product.fields.createdAt")}>
            {record?.createdAt
              ? dayjs(record.createdAt).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Show>
  );
};

import { Show } from "@refinedev/antd";
import { useShow, useTranslate } from "@refinedev/core";
import { Card, Row, Col, Tag, Image, Descriptions } from "antd";
import { parse } from "graphql";
import { LINK_QUERY } from "../../requests/link.graphql";
import dayjs from "dayjs";

export const LinkShow = () => {
  const t = useTranslate();
  const { query } = useShow({
    meta: {
      gqlQuery: parse(LINK_QUERY),
    },
  });
  const { data, isLoading } = query;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Card title="链接信息" style={{ marginBottom: 16 }}>
        <Descriptions column={1}>
          <Descriptions.Item label={t("link.fields.id")}>
            {record?.id}
          </Descriptions.Item>
          <Descriptions.Item label={t("link.fields.name")}>
            {record?.name || "暂无名称"}
          </Descriptions.Item>
          <Descriptions.Item label={t("link.fields.url")}>
            {record?.url ? (
              <a href={record.url} target="_blank" rel="noopener noreferrer">
                {record.url}
              </a>
            ) : (
              "暂无链接"
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t("fields.sort")}>
            {record?.sort || 0}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="图片信息" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <strong>Logo</strong>
            </div>
            {record?.logo ? (
              <Image
                src={record.logo}
                alt="Logo"
                style={{
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "contain",
                }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#999",
                  border: "1px dashed #d9d9d9",
                  borderRadius: 6,
                }}
              >
                暂无Logo
              </div>
            )}
          </Col>
          <Col span={12}>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <strong>二维码</strong>
            </div>
            {record?.qrcode ? (
              <Image
                src={record.qrcode}
                alt="QR Code"
                style={{
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "contain",
                }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#999",
                  border: "1px dashed #d9d9d9",
                  borderRadius: 6,
                }}
              >
                暂无二维码
              </div>
            )}
          </Col>
        </Row>
      </Card>

      <Card title="用户信息" style={{ marginBottom: 16 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="用户ID">
            {record?.userId || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="用户名称">
            {record?.user?.name || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="时间信息">
        <Descriptions column={1}>
          <Descriptions.Item label={t("link.fields.createdAt")}>
            {record?.createdAt
              ? dayjs(record.createdAt).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label={t("link.fields.updatedAt")}>
            {record?.updatedAt
              ? dayjs(record.updatedAt).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Show>
  );
};

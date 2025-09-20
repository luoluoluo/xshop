import { List, useTable } from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Table, Tag, Space, Tooltip } from "antd";
import { parse } from "graphql";
import { VIEWS_QUERY } from "../../requests/views.graphql";
import { View } from "../../generated/graphql";
import dayjs from "dayjs";

export const ViewList = () => {
  const t = useTranslate();
  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(VIEWS_QUERY),
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="id"
          title={t("view.fields.id")}
          width={80}
          render={(id: string) => (
            <Tooltip title={id}>
              <span className="text-xs">{id.slice(0, 8)}...</span>
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="pageType"
          title={t("view.fields.pageType")}
          width={100}
          render={(pageType: string) => (
            <Tag
              color={
                pageType === "product"
                  ? "blue"
                  : pageType === "article"
                  ? "green"
                  : "default"
              }
            >
              {pageType || "unknown"}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex="product"
          title={t("view.fields.product")}
          width={200}
          render={(product: View["product"]) => {
            if (!product) return "-";
            return (
              <div className="max-w-48">
                <div className="font-medium truncate">{product.title}</div>
                <div className="text-xs text-gray-500 truncate">
                  {product.slug || product.id}
                </div>
              </div>
            );
          }}
        />
        <Table.Column
          dataIndex="article"
          title={t("view.fields.article")}
          width={200}
          render={(article: View["article"]) => {
            if (!article) return "-";
            return (
              <div className="max-w-48">
                <div className="font-medium truncate">{article.title}</div>
                <div className="text-xs text-gray-500 truncate">
                  {article.slug || article.id}
                </div>
              </div>
            );
          }}
        />
        <Table.Column
          dataIndex="user"
          title={t("view.fields.user")}
          width={150}
          render={(user: View["user"]) => {
            if (!user) return "-";
            return (
              <div className="max-w-36">
                <div className="font-medium truncate">
                  {user.name || "Unknown"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user.phone}
                </div>
              </div>
            );
          }}
        />
        <Table.Column
          dataIndex="ipAddress"
          title={t("view.fields.ipAddress")}
          width={120}
          render={(ipAddress: string) => (
            <Tooltip title={ipAddress}>
              <span className="text-xs font-mono">{ipAddress || "-"}</span>
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="userAgent"
          title={t("view.fields.userAgent")}
          width={200}
          render={(userAgent: string) => (
            <Tooltip title={userAgent}>
              <span className="text-xs truncate block max-w-48">
                {userAgent ? userAgent.substring(0, 50) + "..." : "-"}
              </span>
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="referer"
          title={t("view.fields.referer")}
          width={200}
          render={(referer: string) => (
            <Tooltip title={referer}>
              <span className="text-xs truncate block max-w-48 text-blue-600">
                {referer ? referer.substring(0, 50) + "..." : "-"}
              </span>
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="pageUrl"
          title={t("view.fields.pageUrl")}
          width={200}
          render={(pageUrl: string) => (
            <Tooltip title={pageUrl}>
              <span className="text-xs truncate block max-w-48 text-blue-600">
                {pageUrl ? pageUrl.substring(0, 50) + "..." : "-"}
              </span>
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="createdAt"
          title={t("view.fields.createdAt")}
          width={150}
          render={(createdAt: string) => {
            return dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss");
          }}
        />
      </Table>
    </List>
  );
};

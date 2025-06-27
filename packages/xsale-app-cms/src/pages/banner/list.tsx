import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";
import { parse } from "graphql";
import { deleteBanner, getBanners } from "../../requests/banner";
import { Merchant } from "../../generated/graphql";
import { Link } from "react-router-dom";

export const BannerList = () => {
  const t = useTranslate();
  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getBanners),
    },
    pagination: {
      mode: "off",
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column
          dataIndex="merchant"
          title={t("banner.fields.merchant")}
          render={(merchant: Merchant) => {
            return merchant?.name;
          }}
        />
        <Table.Column
          dataIndex="image"
          title={t("banner.fields.image")}
          render={(image: string) => {
            return <img className="w-auto h-16" src={image} />;
          }}
        />
        <Table.Column dataIndex="title" title={t("banner.fields.title")} />
        <Table.Column dataIndex="link" title={t("banner.fields.link")} />
        <Table.Column dataIndex="sort" title={t("fields.sort")} />
        <Table.Column
          dataIndex="isActive"
          title={t("fields.isActive.label")}
          render={(isActive: boolean) =>
            isActive ? t("fields.isActive.true") : t("fields.isActive.false")
          }
        />
        <Table.Column
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
                meta={{
                  gqlMutation: parse(deleteBanner),
                }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

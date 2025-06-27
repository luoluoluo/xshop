import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";
import { parse } from "graphql";
import { deleteMerchant, getMerchants } from "../../requests/merchant";
import { User } from "../../generated/graphql";

export const MerchantList = () => {
  const t = useTranslate();
  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getMerchants),
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column
          dataIndex="logo"
          title={t("merchant.fields.logo")}
          render={(logo: string) => {
            return logo ? <img className="w-auto h-16" src={logo} /> : "-";
          }}
        />
        <Table.Column
          dataIndex="affiliate"
          title="推广员"
          render={(affiliate: User) => affiliate?.name || "-"}
        />
        <Table.Column dataIndex="name" title={t("merchant.fields.name")} />
        <Table.Column dataIndex="phone" title={t("merchant.fields.phone")} />
        <Table.Column
          dataIndex="address"
          title={t("merchant.fields.address")}
        />
        <Table.Column
          dataIndex="balance"
          title={t("merchant.fields.balance")}
          render={(balance: number) => {
            return balance ? `¥${balance.toFixed(2)}` : "¥0.00";
          }}
        />
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
                  gqlMutation: parse(deleteMerchant),
                }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

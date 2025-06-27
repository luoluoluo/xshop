import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";
import { parse } from "graphql";
import { deleteAffiliate, getAffiliates } from "../../requests/affiliate";
import { User } from "../../generated/graphql";

export const AffiliateList = () => {
  const t = useTranslate();
  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getAffiliates),
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="name" title={t("affiliate.fields.name")} />
        <Table.Column dataIndex="phone" title={t("affiliate.fields.phone")} />
        <Table.Column
          dataIndex="balance"
          title={t("affiliate.fields.balance")}
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
                  gqlMutation: parse(deleteAffiliate),
                }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

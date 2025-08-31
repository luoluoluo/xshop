import { DeleteButton, List, useTable } from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";
import { parse } from "graphql";
import { deleteAffiliate, getAffiliates } from "../../requests/affiliate";

export const AffiliateList = () => {
  const t = useTranslate();

  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getAffiliates),
      variables: {},
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id" className="mt-4">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="name" title={t("affiliate.fields.name")} />
        <Table.Column dataIndex="phone" title={t("affiliate.fields.phone")} />
        <Table.Column
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
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

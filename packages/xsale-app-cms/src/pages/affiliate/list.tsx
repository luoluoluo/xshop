import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Space, Table, Tag, Form, Select } from "antd";
import { parse } from "graphql";
import { deleteAffiliate, getAffiliates } from "../../requests/affiliate";
import { getMerchants } from "../../requests/merchant";
import { User, AffiliateWhereInput } from "../../generated/graphql";
import { useState } from "react";
import { useSelect } from "@refinedev/antd";

export const AffiliateList = () => {
  const t = useTranslate();
  const [where, setWhere] = useState<AffiliateWhereInput>();

  const { selectProps: merchantSelectProps } = useSelect({
    resource: "merchants",
    meta: {
      gqlQuery: parse(getMerchants),
    },
    optionLabel: "name",
    optionValue: "id",
  });

  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getAffiliates),
      variables: {
        where,
      },
    },
  });

  return (
    <List>
      <Form layout="inline">
        <Form.Item name="merchantId" label="商家">
          <Select
            placeholder="请选择商家"
            allowClear
            style={{ width: 200 }}
            {...merchantSelectProps}
            onChange={(value: any) => {
              setWhere({
                ...where,
                merchantId: value,
              });
            }}
          />
        </Form.Item>
      </Form>
      <Table {...tableProps} rowKey="id" className="mt-4">
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
          dataIndex="merchantAffiliates"
          title="关联商家"
          render={(merchantAffiliates: any[]) => {
            if (!merchantAffiliates || merchantAffiliates.length === 0) {
              return <span style={{ color: "#999" }}>无</span>;
            }
            return (
              <div>
                {merchantAffiliates.map((item: any) => (
                  <Tag key={item.merchant.id} color="blue">
                    {item.merchant.name}
                  </Tag>
                ))}
              </div>
            );
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

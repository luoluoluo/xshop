import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Button, message, Space, Table, Form, Select } from "antd";
import { parse } from "graphql";
import { deleteProduct, getProducts } from "../../requests/product";
import { getMerchants } from "../../requests/merchant";
import { Merchant, Product, ProductWhereInput } from "../../generated/graphql";
import { Clipboard } from "../../components/clipboard";
import { useState } from "react";
import { useSelect } from "@refinedev/antd";

export const ProductList = () => {
  const t = useTranslate();
  const [where, setWhere] = useState<ProductWhereInput>();

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
      gqlQuery: parse(getProducts),
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
          dataIndex="image"
          title={t("product.fields.image")}
          render={(image: string) => {
            return <img className="w-auto h-16" src={image} />;
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
          dataIndex="commission"
          title={t("product.fields.commission")}
          render={(commission: number, record: Product) => {
            return (
              <span>
                {`${commission}%（${(
                  (commission / (record.price ?? 0)) *
                  100
                ).toFixed(2)}%）`}
              </span>
            );
          }}
        />

        <Table.Column
          dataIndex="link"
          title={"链接"}
          render={(_, record: Product) => {
            const link = `${window.location.origin}/product/${record.id}`;
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
              {/* <ShowButton hideText size="small" recordItemId={record.id} /> */}
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
                meta={{
                  gqlMutation: parse(deleteProduct),
                }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

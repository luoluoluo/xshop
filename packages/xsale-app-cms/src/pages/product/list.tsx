import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Button, message, Space, Table } from "antd";
import { parse } from "graphql";
import { deleteProduct, getProducts } from "../../requests/product";
import { Merchant, Product } from "../../generated/graphql";
import { Clipboard } from "../../components/clipboard";

export const ProductList = () => {
  const t = useTranslate();
  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getProducts),
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
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
          dataIndex="merchantAffiliate"
          title={t("product.fields.merchantAffiliate")}
          render={(_, record: Product) => {
            return (
              <div>
                <div>{record?.merchant?.affiliate?.name || "-"}</div>
                <div className="text-sm text-gray-500">
                  {record?.merchant?.affiliate?.phone || "-"}
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
          render={(commission: number) => {
            return <span>{commission?.toFixed(2)}</span>;
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

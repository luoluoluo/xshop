import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Button, message, Space, Table, Tooltip } from "antd";
import { parse } from "graphql";
import {
  DELETE_PRODUCT_MUTATION,
  PRODUCTS_QUERY,
} from "../../requests/product.graphql";
import { Product } from "../../generated/graphql";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Clipboard } from "../../components/clipboard";

export const ProductList = () => {
  const t = useTranslate();
  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(PRODUCTS_QUERY),
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={t("product.fields.id")} />
        <Table.Column
          dataIndex="images"
          title={t("product.fields.image")}
          render={(images: string[]) => {
            return <img className="w-auto h-16" src={images[0]} />;
          }}
        />
        <Table.Column
          dataIndex="title"
          title={t("product.fields.title")}
          render={(title: string) => {
            return (
              <div className="w-40 text-ellipsis overflow-hidden">{title}</div>
            );
          }}
        />
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
                {`${commission?.toFixed(2)}(${(
                  ((commission ?? 0) / (record.price ?? 0)) *
                  100
                ).toFixed(2)}%)`}
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
          fixed="right"
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space direction="vertical">
              <ShowButton size="small" recordItemId={record.id} />
              <EditButton size="small" recordItemId={record.id} />
              <DeleteButton
                size="small"
                recordItemId={record.id}
                meta={{
                  gqlMutation: parse(DELETE_PRODUCT_MUTATION),
                }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

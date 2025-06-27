import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { useGetIdentity, useTranslate, type BaseRecord } from "@refinedev/core";
import { Button, Space, Table, Tooltip } from "antd";
import { parse } from "graphql";
import { getProducts } from "../../requests/product";
import { Affiliate, Merchant, Product } from "../../generated/graphql";
import { InfoCircleOutlined } from "@ant-design/icons";

export const ProductList = () => {
  const { data: me } = useGetIdentity<Affiliate>();
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
            return merchant?.name;
          }}
        />
        <Table.Column
          dataIndex="merchantAffiliate"
          title={
            <Tooltip title="该商家的签约推广者，所有订单都返佣">
              {t("product.fields.merchantAffiliate")}
              <InfoCircleOutlined className="ml-1" />
            </Tooltip>
          }
          render={(_, record: Product) => {
            return record?.merchant?.affiliate?.name;
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
          dataIndex="merchantAffiliateCommission"
          title={t("product.fields.merchantAffiliateCommission")}
          render={(commission: number) => {
            return <span>{commission?.toFixed(2)}</span>;
          }}
        />
        <Table.Column
          dataIndex="affiliateCommission"
          title={t("product.fields.affiliateCommission")}
          render={(commission: number) => {
            return <span>{commission?.toFixed(2)}</span>;
          }}
        />
        <Table.Column
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <Button
                type="link"
                size="small"
                target="_blank"
                href={`/product/${record.id}?affiliateId=${me?.id}`}
              >
                分佣链接
              </Button>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

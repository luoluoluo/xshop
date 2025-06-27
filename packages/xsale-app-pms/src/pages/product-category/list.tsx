import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";
import { parse } from "graphql";
import {
  deleteProductCategory,
  getProductCategories,
} from "../../requests/product-category";
import { Merchant } from "../../generated/graphql";
import { arrayToTree } from "../../utils/tree";

export const ProductCategoryList = () => {
  const t = useTranslate();
  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getProductCategories),
    },
    pagination: {
      mode: "off",
    },
  });

  return (
    <List>
      <Table
        {...{
          ...tableProps,
          dataSource: arrayToTree((tableProps.dataSource as any) || []),
        }}
        rowKey="id"
      >
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column
          dataIndex="name"
          title={t("productCategory.fields.name")}
        />
        <Table.Column
          dataIndex="image"
          title={t("productCategory.fields.image")}
          render={(image: string) =>
            image ? (
              <img src={image} alt="" width={"auto"} height={40} />
            ) : (
              <>-</>
            )
          }
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
                  gqlMutation: parse(deleteProductCategory),
                }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

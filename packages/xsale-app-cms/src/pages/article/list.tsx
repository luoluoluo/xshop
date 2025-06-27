import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";
import { parse } from "graphql";
import { deleteArticle, getArticles } from "../../requests/article";

export const ArticleList = () => {
  const t = useTranslate();
  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getArticles),
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column
          dataIndex="category"
          title={t("article.fields.category")}
          render={(category: { name: string }) => {
            return category?.name;
          }}
        />
        <Table.Column
          dataIndex="image"
          title={t("article.fields.image")}
          render={(image: string) => {
            return <img className="w-auto h-16" src={image} />;
          }}
        />
        <Table.Column dataIndex="title" title={t("article.fields.title")} />
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
                  gqlMutation: parse(deleteArticle),
                }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";
import { parse } from "graphql";
import dayjs from "dayjs";
import { USERS_QUERY, DELETE_USER_MUTATION } from "../../requests/user.graphql";

export const UserList = () => {
  const t = useTranslate();
  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(USERS_QUERY),
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="name" title={t("user.fields.name")} />
        <Table.Column dataIndex="email" title={t("user.fields.email")} />
        <Table.Column
          dataIndex="roles"
          title={t("user.fields.roles")}
          render={(roles: any[]) =>
            roles?.map((role) => role.name).join(", ") || "-"
          }
        />
        <Table.Column
          dataIndex="isActive"
          title={t("fields.isActive.label")}
          render={(isActive: boolean) =>
            isActive ? t("fields.isActive.true") : t("fields.isActive.false")
          }
        />
        <Table.Column
          dataIndex={["createdAt"]}
          title={t("table.createdAt")}
          render={(value: any) => dayjs(value).format("YYYY-MM-DD HH:mm:ss")}
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
                  gqlMutation: parse(DELETE_USER_MUTATION),
                }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

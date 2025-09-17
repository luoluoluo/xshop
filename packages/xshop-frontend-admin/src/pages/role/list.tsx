import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Space, Table, Tag } from "antd";
import { parse } from "graphql";
import { DELETE_ROLE_MUTATION, ROLES_QUERY } from "../../requests/role.graphql";
import { Permission } from "../../generated/graphql";
import { useEffect, useState } from "react";
import { request } from "../../utils/request";
import { GET_PERMISSIONS_QUERY } from "../../requests/permission.graphql";
import dayjs from "dayjs";

export const RoleList = () => {
  const t = useTranslate();
  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(ROLES_QUERY),
    },
  });

  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    request<{ permissions?: Permission[] }>({
      query: GET_PERMISSIONS_QUERY,
    }).then((res) => {
      setPermissions(res.data?.permissions || []);
    });
  }, []);

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="name" title={t("role.fields.name")} />
        <Table.Column
          dataIndex="permissions"
          title={t("role.fields.permissions")}
          render={(permissionValues: string[]) => {
            return (
              <>
                {[...new Set(permissionValues || [])].map((value) => {
                  const permission = permissions.find(
                    (permission) => permission.value === value,
                  );
                  const ps = [permission?.resource];
                  if (permission?.action) {
                    ps.push(permission?.action);
                  }
                  return <Tag key={value}>{ps.join("-")}</Tag>;
                })}
              </>
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
                  gqlMutation: parse(DELETE_ROLE_MUTATION),
                }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

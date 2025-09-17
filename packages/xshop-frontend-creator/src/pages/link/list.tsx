import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import { Button, message, Space, Table, Tooltip, Image } from "antd";
import { parse } from "graphql";
import { DELETE_LINK_MUTATION, LINKS_QUERY } from "../../requests/link.graphql";
import { Link } from "../../generated/graphql";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Clipboard } from "../../components/clipboard";

export const LinkList = () => {
  const t = useTranslate();
  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(LINKS_QUERY),
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={t("link.fields.id")} />
        <Table.Column
          dataIndex="logo"
          title={t("link.fields.logo")}
          render={(logo: string) => {
            return logo ? (
              <Image
                className="w-16 h-16 object-cover"
                src={logo}
                alt="Logo"
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-400">
                无
              </div>
            );
          }}
        />
        <Table.Column
          dataIndex="name"
          title={t("link.fields.name")}
          render={(name: string) => {
            return (
              <div className="w-40 text-ellipsis overflow-hidden">{name}</div>
            );
          }}
        />
        <Table.Column
          dataIndex="url"
          title={t("link.fields.url")}
          render={(url: string) => {
            return (
              <div className="w-60 text-ellipsis overflow-hidden">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </div>
            );
          }}
        />
        <Table.Column
          dataIndex="qrcode"
          title={t("link.fields.qrcode")}
          render={(qrcode: string) => {
            return qrcode ? (
              <Image
                className="w-16 h-16 object-cover"
                src={qrcode}
                alt="QR Code"
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-400">
                无
              </div>
            );
          }}
        />
        <Table.Column
          dataIndex="sort"
          title={t("fields.sort")}
          render={(sort: number) => {
            return <span>{sort || 0}</span>;
          }}
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
                  gqlMutation: parse(DELETE_LINK_MUTATION),
                }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

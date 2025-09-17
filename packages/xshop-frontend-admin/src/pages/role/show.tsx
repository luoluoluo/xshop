import { DateField, MarkdownField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";
import { parse } from "graphql";
import { ROLE_QUERY } from "../../requests/role.graphql";

const { Title } = Typography;

export const RoleShow = () => {
  const { query, result } = useShow({
    meta: {
      gqlQuery: parse(ROLE_QUERY),
    },
  });
  const { data, isLoading } = query;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />
      <Title level={5}>{"Name"}</Title>
      <TextField value={record?.name} />
      <Title level={5}>{"Created At"}</Title>
      <DateField value={record?.createdAt} />
    </Show>
  );
};

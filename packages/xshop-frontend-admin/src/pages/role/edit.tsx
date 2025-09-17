import { Edit, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { ROLE_QUERY, UPDATE_ROLE_MUTATION } from "../../requests/role.graphql";
import { RoleForm } from "./_components/role-form";

export const RoleEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    meta: {
      gqlMutation: parse(UPDATE_ROLE_MUTATION),
    },
    queryMeta: {
      gqlQuery: parse(ROLE_QUERY),
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <RoleForm formProps={formProps} />
    </Edit>
  );
};

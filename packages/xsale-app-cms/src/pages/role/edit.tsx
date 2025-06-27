import { Edit, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { getRole, updateRole } from "../../requests/role";
import { RoleForm } from "./_components/role-form";

export const RoleEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    meta: {
      gqlMutation: parse(updateRole),
    },
    queryMeta: {
      gqlQuery: parse(getRole),
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <RoleForm formProps={formProps} />
    </Edit>
  );
};

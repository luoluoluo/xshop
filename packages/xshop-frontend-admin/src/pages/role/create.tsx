import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { CREATE_ROLE_MUTATION } from "../../requests/role.graphql";
import { RoleForm } from "./_components/role-form";

export const RoleCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(CREATE_ROLE_MUTATION),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <RoleForm formProps={formProps} />
    </Create>
  );
};

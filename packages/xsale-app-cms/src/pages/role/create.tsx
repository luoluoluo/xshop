import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { createRole } from "../../requests/role";
import { RoleForm } from "./_components/role-form";

export const RoleCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(createRole),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <RoleForm formProps={formProps} />
    </Create>
  );
};

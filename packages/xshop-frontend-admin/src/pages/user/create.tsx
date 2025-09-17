import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { CREATE_USER_MUTATION } from "../../requests/user.graphql";
import { UserForm } from "./_components/user-form";

export const UserCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(CREATE_USER_MUTATION),
    },
  });

  return (
    <Create saveButtonProps={{ ...saveButtonProps }}>
      <UserForm formProps={formProps} />
    </Create>
  );
};

import { Edit, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { getUser, updateUser } from "../../requests/user";
import { UserForm } from "./_components/user-form";
import { Role, UpdateUserInput, User } from "../../generated/graphql";
import { HttpError } from "@refinedev/core";

export const UserEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm<
    User,
    HttpError,
    UpdateUserInput
  >({
    meta: {
      gqlMutation: parse(updateUser),
    },
    queryMeta: {
      gqlQuery: parse(getUser),
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <UserForm
        formProps={{
          ...formProps,
          initialValues: {
            ...formProps.initialValues,
            roleIds: formProps.initialValues?.roles?.map((role: Role) => {
              return role.id;
            }),
          },
        }}
      />
    </Edit>
  );
};

import { Edit, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { USER_QUERY, UPDATE_USER_MUTATION } from "../../requests/user.graphql";
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
      gqlMutation: parse(UPDATE_USER_MUTATION),
    },
    queryMeta: {
      gqlQuery: parse(USER_QUERY),
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

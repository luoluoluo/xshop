import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { CREATE_WITHDRAWAL_MUTATION } from "../../requests/withdrawal.graphql";
import { WithdrawalForm } from "./_components/withdrawal-form";

export const WithdrawalCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(CREATE_WITHDRAWAL_MUTATION),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <WithdrawalForm formProps={formProps} />
    </Create>
  );
};

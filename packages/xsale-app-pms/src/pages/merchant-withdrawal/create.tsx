import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { createMerchantWithdrawal } from "../../requests/merchant-withdrawal";
import { MerchantWithdrawalForm } from "./_components/merchant-withdrawal-form";

export const MerchantWithdrawalCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(createMerchantWithdrawal),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <MerchantWithdrawalForm formProps={formProps} />
    </Create>
  );
};

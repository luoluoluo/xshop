import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { createAffiliateWithdrawal } from "../../requests/affiliate-withdrawal";
import { AffiliateWithdrawalForm } from "./_components/affiliate-withdrawal-form";

export const AffiliateWithdrawalCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(createAffiliateWithdrawal),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <AffiliateWithdrawalForm formProps={formProps} />
    </Create>
  );
};

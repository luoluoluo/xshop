import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { createMerchant } from "../../requests/merchant";
import { MerchantForm } from "./_components/merchant-form";

export const MerchantCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(createMerchant),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <MerchantForm formProps={formProps} />
    </Create>
  );
};

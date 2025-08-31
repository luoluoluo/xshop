import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { createAffiliate } from "../../requests/affiliate";
import { AffiliateForm } from "./_components/affiliate-form";

export const AffiliateCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(createAffiliate),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <AffiliateForm formProps={formProps} />
    </Create>
  );
};

import { Edit, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { getMerchant, updateMerchant } from "../../requests/merchant";
import { MerchantForm } from "./_components/merchant-form";

export const MerchantEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    meta: {
      gqlMutation: parse(updateMerchant),
    },
    queryMeta: {
      gqlQuery: parse(getMerchant),
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <MerchantForm formProps={formProps} />
    </Edit>
  );
};

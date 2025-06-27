import { Edit, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { getAffiliate, updateAffiliate } from "../../requests/affiliate";
import { AffiliateForm } from "./_components/affiliate-form";

export const AffiliateEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    meta: {
      gqlMutation: parse(updateAffiliate),
    },
    queryMeta: {
      gqlQuery: parse(getAffiliate),
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <AffiliateForm formProps={formProps} />
    </Edit>
  );
};

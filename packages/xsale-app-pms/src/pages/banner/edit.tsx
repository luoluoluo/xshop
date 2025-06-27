import { Edit, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { getBanner, updateBanner } from "../../requests/banner";
import { BannerForm } from "./_components/banner-form";

export const BannerEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    meta: {
      gqlMutation: parse(updateBanner),
    },
    queryMeta: {
      gqlQuery: parse(getBanner),
    },
  });
  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <BannerForm formProps={formProps} />
    </Edit>
  );
};

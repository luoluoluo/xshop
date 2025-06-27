import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { createBanner } from "../../requests/banner";
import { BannerForm } from "./_components/banner-form";

export const BannerCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(createBanner),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <BannerForm formProps={formProps} />
    </Create>
  );
};

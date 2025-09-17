import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { CREATE_LINK_MUTATION } from "../../requests/link.graphql";
import { LinkForm } from "./_components/link-form";

export const LinkCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(CREATE_LINK_MUTATION),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <LinkForm formProps={formProps} />
    </Create>
  );
};

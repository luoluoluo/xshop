import { Edit, useForm } from "@refinedev/antd";

import { parse } from "graphql";
import { LINK_QUERY, UPDATE_LINK_MUTATION } from "../../requests/link.graphql";
import { LinkForm } from "./_components/link-form";

export const LinkEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    meta: {
      gqlMutation: parse(UPDATE_LINK_MUTATION),
    },
    queryMeta: {
      gqlQuery: parse(LINK_QUERY),
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <LinkForm formProps={formProps} />
    </Edit>
  );
};

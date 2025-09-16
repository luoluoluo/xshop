import { Edit, useForm } from "@refinedev/antd";

import { parse } from "graphql";
import { ARTICLE_QUERY, UPDATE_ARTICLE_MUTATION } from "../../requests/article";
import { ArticleForm } from "./_components/article-form";

export const ArticleEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    meta: {
      gqlMutation: parse(UPDATE_ARTICLE_MUTATION),
    },
    queryMeta: {
      gqlQuery: parse(ARTICLE_QUERY),
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <ArticleForm formProps={formProps} />
    </Edit>
  );
};

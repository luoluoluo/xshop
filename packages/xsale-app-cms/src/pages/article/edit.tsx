import { Edit, useForm } from "@refinedev/antd";

import { parse } from "graphql";
import { getArticle, updateArticle } from "../../requests/article";
import { ArticleForm } from "./_components/article-form";

export const ArticleEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    meta: {
      gqlMutation: parse(updateArticle),
    },
    queryMeta: {
      gqlQuery: parse(getArticle),
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <ArticleForm formProps={formProps} />
    </Edit>
  );
};

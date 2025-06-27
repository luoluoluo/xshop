import { Edit, useForm } from "@refinedev/antd";

import { parse } from "graphql";
import {
  getArticleCategory,
  updateArticleCategory,
} from "../../requests/article-category";
import { ArticleCategoryForm } from "./_components/article-category-form";

export const ArticleCategoryEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    meta: {
      gqlMutation: parse(updateArticleCategory),
    },
    queryMeta: {
      gqlQuery: parse(getArticleCategory),
    },
  });
  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <ArticleCategoryForm formProps={formProps} />
    </Edit>
  );
};

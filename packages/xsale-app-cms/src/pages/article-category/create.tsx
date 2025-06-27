import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { createArticleCategory } from "../../requests/article-category";
import { ArticleCategoryForm } from "./_components/article-category-form";

export const ArticleCategoryCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(createArticleCategory),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <ArticleCategoryForm formProps={formProps} />
    </Create>
  );
};

import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { CREATE_ARTICLE_MUTATION } from "../../requests/article.graphql";
import { ArticleForm } from "./_components/article-form";

export const ArticleCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(CREATE_ARTICLE_MUTATION),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <ArticleForm formProps={formProps} />
    </Create>
  );
};

import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { createArticle } from "../../requests/article";
import { ArticleForm } from "./_components/article-form";

export const ArticleCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(createArticle),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <ArticleForm formProps={formProps} />
    </Create>
  );
};

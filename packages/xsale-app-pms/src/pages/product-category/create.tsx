import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { createProductCategory } from "../../requests/product-category";
import { ProductCategoryForm } from "./_components/product-category-form";

export const ProductCategoryCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(createProductCategory),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <ProductCategoryForm formProps={formProps} />
    </Create>
  );
};

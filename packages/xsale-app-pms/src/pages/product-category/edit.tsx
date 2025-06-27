import { Edit, useForm } from "@refinedev/antd";

import { parse } from "graphql";
import {
  getProductCategory,
  updateProductCategory,
} from "../../requests/product-category";
import { ProductCategoryForm } from "./_components/product-category-form";

export const ProductCategoryEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    meta: {
      gqlMutation: parse(updateProductCategory),
    },
    queryMeta: {
      gqlQuery: parse(getProductCategory),
    },
  });
  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <ProductCategoryForm formProps={formProps} />
    </Edit>
  );
};

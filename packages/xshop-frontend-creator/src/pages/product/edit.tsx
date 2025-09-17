import { Edit, useForm } from "@refinedev/antd";

import { parse } from "graphql";
import {
  PRODUCT_QUERY,
  UPDATE_PRODUCT_MUTATION,
} from "../../requests/product.graphql";
import { ProductForm } from "./_components/product-form";

export const ProductEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    meta: {
      gqlMutation: parse(UPDATE_PRODUCT_MUTATION),
    },
    queryMeta: {
      gqlQuery: parse(PRODUCT_QUERY),
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <ProductForm formProps={formProps} />
    </Edit>
  );
};

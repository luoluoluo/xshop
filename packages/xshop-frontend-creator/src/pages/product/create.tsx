import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { CREATE_PRODUCT_MUTATION } from "../../requests/product.graphql";
import { ProductForm } from "./_components/product-form";

export const ProductCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(CREATE_PRODUCT_MUTATION),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <ProductForm formProps={formProps} />
    </Create>
  );
};

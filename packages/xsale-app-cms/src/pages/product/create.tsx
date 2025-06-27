import { Create, useForm } from "@refinedev/antd";
import { parse } from "graphql";
import { createProduct } from "../../requests/product";
import { ProductForm } from "./_components/product-form";

export const ProductCreate = () => {
  const { formProps, saveButtonProps } = useForm({
    meta: {
      gqlMutation: parse(createProduct),
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <ProductForm formProps={formProps} />
    </Create>
  );
};

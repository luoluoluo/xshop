import { Edit, useForm } from "@refinedev/antd";

import { parse } from "graphql";
import { getProduct, updateProduct } from "../../requests/product";
import { ProductForm } from "./_components/product-form";
import { ProductCollection } from "../../generated/graphql";

export const ProductEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    meta: {
      gqlMutation: parse(updateProduct),
    },
    queryMeta: {
      gqlQuery: parse(getProduct),
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <ProductForm
        formProps={{
          ...formProps,
          initialValues: {
            ...formProps.initialValues,
            collectionIds: formProps.initialValues?.collections?.map(
              (item: ProductCollection) => item.id,
            ),
          },
        }}
      />
    </Edit>
  );
};

import {
  Product,
  ProductPagination,
  ProductWhereInput,
} from "@/generated/graphql";
import { request } from "../utils/request.client";
import { PRODUCTS_QUERY, PRODUCT_QUERY } from "./product.graphql";

export const getProducts = (variables: {
  where?: ProductWhereInput;
  skip?: number;
  take?: number;
}) => {
  return request<{ products: ProductPagination }>({
    query: PRODUCTS_QUERY,
    variables,
  });
};

export const getProduct = (variables: { id: string }) => {
  return request<{ product: Product }>({
    query: PRODUCT_QUERY,
    variables,
  });
};

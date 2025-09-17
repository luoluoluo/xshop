import {
  CreateProductInput,
  Product,
  ProductPagination,
  ProductWhereInput,
  UpdateProductInput,
} from "../generated/graphql";
import { request } from "../utils/request";
import {
  PRODUCTS_QUERY,
  PRODUCT_QUERY,
  DELETE_PRODUCT_MUTATION,
  CREATE_PRODUCT_MUTATION,
  UPDATE_PRODUCT_MUTATION,
} from "./product.graphql";

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

export const deleteProduct = (variables: { id: string }) => {
  return request<{ product: Product }>({
    query: DELETE_PRODUCT_MUTATION,
    variables,
  });
};

export const createProduct = (variables: { data: CreateProductInput }) => {
  return request<{ product: Product }>({
    query: CREATE_PRODUCT_MUTATION,
    variables,
  });
};

export const updateProduct = (variables: {
  id: string;
  data: UpdateProductInput;
}) => {
  return request<{ product: Product }>({
    query: UPDATE_PRODUCT_MUTATION,
    variables,
  });
};

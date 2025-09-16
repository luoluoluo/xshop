import { request } from "../utils/request.client";
import { User } from "../generated/graphql";
import { USER_QUERY } from "./user.graphql";

export const GET_USER = (id: string) => {
  return request<{ user?: User }>({
    query: USER_QUERY,
    variables: { id },
  });
};

import { request } from "../utils/request.server";
import { User } from "../generated/graphql";
import { USER_QUERY } from "./user.graphql";

export const getUser = async (variables: { id: string }) => {
  return request<{ user?: User }>({
    query: USER_QUERY,
    variables,
  });
};

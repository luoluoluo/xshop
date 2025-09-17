import { AuthToken, LoginInput, User } from "../generated/graphql";
import { request } from "../utils/request";
import { ME_QUERY, LOGIN_MUTATION } from "./auth.graphql";

export const getMe = () => {
  return request<{ me?: User }>({
    query: ME_QUERY,
  });
};

export const login = (variables: { data: LoginInput }) => {
  return request<{ login: AuthToken }>({
    query: LOGIN_MUTATION,
    variables,
  });
};

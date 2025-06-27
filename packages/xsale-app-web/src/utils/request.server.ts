import { GraphQLFormattedError } from "graphql";
import { getToken, logout } from "./auth.server";
import { request as requestClient } from "./request";

export const request = async <T>(
  {
    query,
    variables
  }: {
    query: string;
    variables?: Record<string, any>;
  },
  headers?: Record<string, string>
): Promise<{ data?: T; errors?: GraphQLFormattedError[] }> => {
  const token = getToken();
  if (token) {
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }
  return requestClient<T>({ query, variables }, headers).then(res => {
    if (res.errors?.[0].extensions?.code === "UNAUTHORIZED") {
      logout();
    }
    return res;
  });
};

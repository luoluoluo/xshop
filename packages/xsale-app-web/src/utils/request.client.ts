import { GraphQLFormattedError } from "graphql";
import { getToken, logout } from "./auth.client";
import { request as requestClient } from "./request";

export const request = async <T>(
  {
    query,
    variables
  }: {
    query: string;
    variables?: Record<string, any>;
  },
  headers?: Record<string, string>,
  keepalive?: boolean
): Promise<{ data?: T; errors?: GraphQLFormattedError[] }> => {
  const token = getToken();
  console.log(token, "token111");
  if (token) {
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }
  return requestClient<T>({ query, variables }, headers, keepalive).then(res => {
    if (res.errors?.[0].extensions?.code === "UNAUTHORIZED") {
      logout();
    }
    return res;
  });
};

import { DocumentNode, GraphQLFormattedError, print } from "graphql";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "";

export const request = async <T>(
  {
    query,
    variables
  }: {
    query: string | DocumentNode;
    variables?: Record<string, any>;
  },
  headers?: Record<string, string>,
  keepalive?: boolean
): Promise<{ data?: T; errors?: GraphQLFormattedError[] }> => {
  query = typeof query === "string" ? query : print(query);
  if (headers?.token) {
    headers["Authorization"] = `Bearer ${headers.token}`;
  }
  return fetch(`${baseUrl}/web`, {
    method: "POST",
    // cache: revalidate ? "default" : "no-store",
    next: { revalidate: 0 },
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ query, variables }),
    keepalive
  })
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(async e => {
      if (e.errors) {
        return e;
      } else {
        return {
          errors: [
            {
              message: JSON.stringify(e),
              extensions: {
                code: "INTERNAL"
              }
            }
          ]
        };
      }
    });
};

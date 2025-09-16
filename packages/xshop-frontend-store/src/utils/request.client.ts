import { GraphQLFormattedError } from "graphql";
import { getToken, logout, setToken } from "./auth.client";
import { request as requestClient } from "./request";
import { SIGNED_FILE_URL } from "@/requests/file.client";

export const request = async <T>(
  {
    query,
    variables,
  }: {
    query: string;
    variables?: Record<string, any>;
  },
  headers?: Record<string, string>,
  keepalive?: boolean,
): Promise<{ data?: T; errors?: GraphQLFormattedError[] }> => {
  const token = getToken();
  console.log(token, "token111");
  if (token) {
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }
  return requestClient<T>({ query, variables }, headers, keepalive).then(
    (res) => {
      if (res.errors?.[0].extensions?.code === "UNAUTHENTICATED") {
        setToken(undefined);
      }
      return res;
    },
  );
};

export const upload = async (file: File) => {
  const res = await SIGNED_FILE_URL({
    filename: file.name,
  });
  if (res.errors) {
    return res;
  }

  if (!res.data?.signedFileUrl?.uploadUrl) {
    return {
      errors: [
        {
          message: "Create url failed",
          extensions: {
            code: "INTERNAL",
          },
        },
      ],
    };
  }

  const formData = new FormData();
  formData.append("file", file);

  const uploadRes = await fetch(res.data.signedFileUrl.uploadUrl, {
    method: "POST",
    body: formData,
  });
  if (!uploadRes.ok) {
    return {
      errors: [
        {
          message: "Upload failed",
          extensions: {
            code: "INTERNAL",
          },
        },
      ],
    };
  }
  return res;
};

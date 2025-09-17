import { apiUrl } from "../config";
import { print, DocumentNode, GraphQLFormattedError } from "graphql";
import { TOKEN_KEY } from "../providers/auth";
import i18n from "i18next";
import Cookies from "js-cookie";
import { SignedFileUrl } from "../generated/graphql";
import { getSignedFileUrl } from "../requests/file";

export const request = async <T>({
  query,
  variables,
}: {
  query: string | DocumentNode;
  variables?: Record<string, any>;
}): // headers?: HeadersInit
Promise<{ data?: T; errors?: GraphQLFormattedError[] }> => {
  query = typeof query === "string" ? query : print(query);
  return fetch(`${apiUrl}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Cookies.get(TOKEN_KEY)}`,
      Language: i18n.language,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((e) => {
      if (e.errors) {
        return e;
      }
      return {
        errors: [
          {
            message: JSON.stringify(e),
            extensions: {
              code: "INTERNAL",
            },
          },
        ],
      };
    });
};

export const upload = async (file: File) => {
  const res = await getSignedFileUrl({
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

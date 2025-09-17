import { request } from "../utils/request";
import { SIGNED_FILE_URL_QUERY } from "./file.graphql";

export const getSignedFileUrl = (variables: { filename: string }) => {
  return request<{ signedFileUrl: { uploadUrl: string; downloadUrl: string } }>(
    {
      query: SIGNED_FILE_URL_QUERY,
      variables,
    },
  );
};

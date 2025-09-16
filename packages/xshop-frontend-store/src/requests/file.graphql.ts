export const SIGNED_FILE_URL_QUERY = /* GraphQL */ `
  query signedFileUrl($filename: String!) {
    signedFileUrl(filename: $filename) {
      uploadUrl
      downloadUrl
    }
  }
`;

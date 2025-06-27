export const signedFileUrl = /* GraphQL */ `
  query signedFileUrl($filename: String!) {
    signedFileUrl(filename: $filename) {
      uploadUrl
      downloadUrl
    }
  }
`;

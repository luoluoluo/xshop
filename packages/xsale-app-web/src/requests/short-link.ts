// Get single short link by ID
export const getShortLink = /* GraphQL */ `
  query shortLink($id: String!) {
    shortLink(id: $id) {
      id
      url
    }
  }
`;

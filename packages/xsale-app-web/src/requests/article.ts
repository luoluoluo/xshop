export const getArticles = /* GraphQL */ `
  query articles($skip: Int, $take: Int) {
    articles(skip: $skip, take: $take) {
      data {
        id
        title
        description
        image
        content
        createdAt
        updatedAt
      }
      total
    }
  }
`;

export const getArticle = /* GraphQL */ `
  query article($slug: String!) {
    article(slug: $slug) {
      id
      title
      description
      image
      content
      createdAt
      updatedAt
    }
  }
`;

export const ARTICLES_QUERY = /* GraphQL */ `
  query articles($skip: Int, $take: Int) {
    articles(skip: $skip, take: $take) {
      data {
        id
        title
        description
        image
        content
        isActive
        createdAt
        updatedAt
        slug
      }
      total
    }
  }
`;

export const ARTICLE_QUERY = /* GraphQL */ `
  query article($id: String!) {
    article(id: $id) {
      id
      title
      description
      image
      content
      isActive
      createdAt
      updatedAt
      slug
    }
  }
`;

export const DELETE_ARTICLE_MUTATION = /* GraphQL */ `
  mutation deleteArticle($id: String!) {
    deleteArticle(id: $id)
  }
`;

export const CREATE_ARTICLE_MUTATION = /* GraphQL */ `
  mutation createArticle($data: CreateArticleInput!) {
    createArticle(data: $data) {
      id
    }
  }
`;

export const UPDATE_ARTICLE_MUTATION = /* GraphQL */ `
  mutation updateArticle($id: String!, $data: UpdateArticleInput!) {
    updateArticle(id: $id, data: $data) {
      id
    }
  }
`;

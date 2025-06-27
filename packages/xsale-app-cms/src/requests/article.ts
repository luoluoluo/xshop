export const getArticles = /* GraphQL */ `
  query articles($skip: Int, $take: Int) {
    articles(skip: $skip, take: $take) {
      data {
        id
        title
        description
        image
        content
        isActive
        sort
        createdAt
        updatedAt
        categoryId
        category {
          id
          name
        }
      }
      total
    }
  }
`;

export const getArticle = /* GraphQL */ `
  query article($id: String!) {
    article(id: $id) {
      id
      title
      description
      image
      content
      isActive
      sort
      createdAt
      updatedAt
      categoryId
    }
  }
`;

export const deleteArticle = /* GraphQL */ `
  mutation deleteArticle($id: String!) {
    deleteArticle(id: $id)
  }
`;

export const createArticle = /* GraphQL */ `
  mutation createArticle($data: CreateArticleInput!) {
    createArticle(data: $data) {
      id
    }
  }
`;

export const updateArticle = /* GraphQL */ `
  mutation updateArticle($id: String!, $data: UpdateArticleInput!) {
    updateArticle(id: $id, data: $data) {
      id
    }
  }
`;

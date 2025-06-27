export const getArticleCategories = /* GraphQL */ `
  query articleCategories(
    $where: ArticleCategoryWhereInput
    $skip: Int
    $take: Int
  ) {
    articleCategories(where: $where, skip: $skip, take: $take) {
      data {
        id
        name
        isActive
        sort
        createdAt
        updatedAt
        parent {
          id
          name
          isActive
          parentId
          sort
          createdAt
        }
      }
      total
    }
  }
`;

export const getArticleCategory = /* GraphQL */ `
  query articleCategory($id: String!) {
    articleCategory(id: $id) {
      id
      name
      isActive
      sort
      createdAt
      updatedAt
    }
  }
`;

export const deleteArticleCategory = /* GraphQL */ `
  mutation deleteArticleCategory($id: String!) {
    deleteArticleCategory(id: $id)
  }
`;

export const createArticleCategory = /* GraphQL */ `
  mutation createArticleCategory($data: CreateArticleCategoryInput!) {
    createArticleCategory(data: $data) {
      id
    }
  }
`;

export const updateArticleCategory = /* GraphQL */ `
  mutation updateArticleCategory(
    $id: String!
    $data: UpdateArticleCategoryInput!
  ) {
    updateArticleCategory(id: $id, data: $data) {
      id
    }
  }
`;

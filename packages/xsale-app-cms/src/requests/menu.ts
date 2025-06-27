export const getMenus = /* GraphQL */ `
  query menus($where: MenuWhereInput, $skip: Int, $take: Int) {
    menus(where: $where, skip: $skip, take: $take) {
      data {
        id
        title
        link
        isActive
        parentId
        sort
        type
        createdAt
        parent {
          id
          title
          link
          isActive
          parentId
          sort
          type
          createdAt
        }
      }
      total
    }
  }
`;

export const getMenu = /* GraphQL */ `
  query menu($id: String!) {
    menu(id: $id) {
      id
      title
      link
      isActive
      parentId
      sort
      type
      createdAt
    }
  }
`;

export const deleteMenu = /* GraphQL */ `
  mutation deleteMenu($id: String!) {
    deleteMenu(id: $id)
  }
`;

export const createMenu = /* GraphQL */ `
  mutation createMenu($data: CreateMenuInput!) {
    createMenu(data: $data) {
      id
    }
  }
`;

export const updateMenu = /* GraphQL */ `
  mutation updateMenu($id: String!, $data: UpdateMenuInput!) {
    updateMenu(id: $id, data: $data) {
      id
    }
  }
`;

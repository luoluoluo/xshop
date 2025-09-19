export const USER_QUERY = /* GraphQL */ `
  query user($id: String!) {
    user(id: $id) {
      id
      slug
      name
      title
      phone
      email
      wechatId
      description
      createdAt
      avatar
      backgroundImage
      links {
        id
        userId
        name
        url
        logo
        qrcode
        sort
        createdAt
        updatedAt
      }
      products {
        id
        slug
        userId
        title
        description
        images
        isActive
        createdAt
        price
        commission
        stock
        sort
      }
    }
  }
`;

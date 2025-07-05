import { ResourceProps } from "@refinedev/core";

import {
  UserOutlined,
  TeamOutlined,
  ProductOutlined,
  DashboardOutlined,
  ShopOutlined,
  DollarOutlined,
  GiftOutlined,
  GroupOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
export const getResources = (): ResourceProps[] => {
  return [
    {
      name: "dashboard",
      list: "/",
      meta: {
        icon: <DashboardOutlined />,
      },
    },
    {
      name: "content",
      meta: {
        icon: <FileImageOutlined />,
      },
    },
    {
      name: "article",
      list: "/article",
      create: "/article/new",
      edit: "/article/:id/edit",
      meta: {
        parent: "content",
        icon: <></>,
      },
    },
    // {
    //   name: "orders",
    //   list: "/orders",
    //   show: "/orders/:id",
    //   meta: {
    //     icon: <ShoppingBagOutlinedIcon />,
    //   },
    // },
    // {
    //   name: "customers",
    //   list: "/customers",
    //   show: "/customers/:id",
    //   meta: {
    //     icon: <AccountCircleOutlinedIcon />,
    //   },
    // },

    {
      name: "affiliate",
      list: "/affiliate",
      create: "/affiliate/new",
      edit: "/affiliate/:id/edit",
      meta: {
        icon: <GroupOutlined />,
      },
    },
    {
      name: "merchant",
      list: "/merchant",
      create: "/merchant/new",
      edit: "/merchant/:id/edit",
      meta: {
        icon: <ShopOutlined />,
      },
    },
    {
      name: "product",
      list: "/product",
      create: "/product/new",
      edit: "/product/:id/edit",
      show: "/product/:id",
      meta: {
        icon: <ProductOutlined />,
      },
    },
    {
      name: "order",
      list: "/order",
      show: "/order/:id",
      meta: {
        icon: <GiftOutlined />,
      },
    },
    {
      name: "finance",
      meta: {
        icon: <DollarOutlined />,
      },
    },
    {
      name: "affiliateWithdrawal",
      list: "/affiliate-withdrawal",
      meta: {
        parent: "finance",
        icon: <></>,
      },
    },
    {
      name: "merchantWithdrawal",
      list: "/merchant-withdrawal",
      meta: {
        parent: "finance",
        icon: <></>,
      },
    },
    // {
    //   name: "couriers",
    //   list: "/couriers",
    //   create: "/couriers/new",
    //   edit: "/couriers/:id/edit",
    //   meta: {
    //     icon: <MopedOutlined />,
    //   },
    // },
    {
      name: "user",
      list: "/user",
      show: "/user/:id",
      create: "/user/new",
      edit: "/user/:id/edit",
      meta: {
        icon: <UserOutlined />,
      },
    },
    {
      name: "role",
      list: "/role",
      show: "/role/:id",
      create: "/role/new",
      edit: "/role/:id/edit",
      meta: {
        icon: <TeamOutlined />,
      },
    },
  ];
};

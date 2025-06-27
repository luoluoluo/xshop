import { ResourceProps } from "@refinedev/core";
import i18n from "../i18n";

import {
  UserOutlined,
  TeamOutlined,
  ProductOutlined,
  DashboardOutlined,
  FileAddOutlined,
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
      name: "article-management",
      meta: {
        icon: <FileAddOutlined />,
        label: i18n.t("article.article"),
      },
    },
    {
      name: "article",
      list: "/article",
      create: "/article/new",
      edit: "/article/:id/edit",
      show: "/article/:id",
      meta: {
        parent: "article-management",
        icon: <></>,
      },
    },
    {
      name: "articleCategory",
      list: "/article-category",
      create: "/article-category/new",
      edit: "/article-category/:id/edit",
      meta: {
        parent: "article-management",
        icon: <></>,
      },
    },

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
      name: "banner",
      list: "/banner",
      create: "/banner/new",
      edit: "/banner/:id/edit",
      meta: {
        icon: <FileImageOutlined />,
      },
    },
    {
      name: "product-management",
      meta: {
        icon: <ProductOutlined />,
        label: i18n.t("product.product"),
      },
    },
    {
      name: "product",
      list: "/product",
      create: "/product/new",
      edit: "/product/:id/edit",
      show: "/product/:id",
      meta: {
        parent: "product-management",
        icon: <></>,
      },
    },
    {
      name: "productCategory",
      list: "/product-category",
      create: "/product-category/new",
      edit: "/product-category/:id/edit",
      meta: {
        parent: "product-management",
        icon: <></>,
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

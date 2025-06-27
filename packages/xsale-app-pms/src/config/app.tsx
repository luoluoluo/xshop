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
      name: "merchantWithdrawal",
      list: "/merchant-withdrawal",
      create: "/merchant-withdrawal/new",
      meta: {
        parent: "finance",
        icon: <></>,
      },
    },
  ];
};

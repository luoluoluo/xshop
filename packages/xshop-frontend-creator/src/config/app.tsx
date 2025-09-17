import { ResourceProps } from "@refinedev/core";

import {
  ProductOutlined,
  DashboardOutlined,
  SettingOutlined,
  ShoppingOutlined,
  LinkOutlined,
  DollarOutlined,
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
        icon: <ShoppingOutlined />,
      },
    },
    {
      name: "link",
      list: "/link",
      create: "/link/new",
      edit: "/link/:id/edit",
      show: "/link/:id",
      meta: {
        icon: <LinkOutlined />,
      },
    },
    {
      name: "withdrawal",
      list: "/withdrawal",
      create: "/withdrawal/new",
      show: "/withdrawal/:id",
      meta: {
        icon: <DollarOutlined />,
      },
    },
    {
      name: "setting",
      list: "/setting",
      meta: {
        icon: <SettingOutlined />,
        label: "设置",
      },
    },
  ];
};

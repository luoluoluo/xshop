import { ResourceProps } from "@refinedev/core";

import {
  ProductOutlined,
  DashboardOutlined,
  DollarOutlined,
  GiftOutlined,
  SettingOutlined,
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
      name: "settings",
      list: "/settings",
      meta: {
        icon: <SettingOutlined />,
        label: "设置",
      },
    },
  ];
};

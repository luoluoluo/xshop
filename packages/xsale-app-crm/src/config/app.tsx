import { ResourceProps } from "@refinedev/core";

import {
  ProductOutlined,
  DashboardOutlined,
  DollarOutlined,
  GiftOutlined,
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
      create: "/affiliate-withdrawal/new",
      meta: {
        parent: "finance",
        icon: <></>,
      },
    },
  ];
};

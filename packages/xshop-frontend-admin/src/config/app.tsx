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
    //   name: "finance",
    //   meta: {
    //     icon: <DollarOutlined />,
    //   },
    // },
    {
      name: "withdrawal",
      list: "/withdrawal",
      meta: {
        icon: <DollarOutlined />,
      },
    },
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

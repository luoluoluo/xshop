import { HeaderItem } from "@/types";

export const setting = {
  name: "小驴通",
  title: "小驴通, 手艺人在线主页",
  keywords:
    "手艺人、在线主页、个人品牌，超级个体, 数字名片，聚合链接，分销商店",
  description:
    "3分钟创建一个整合数字名片、聚合链接、分销商店的手艺人在线主页。",
  features: [
    {
      title: "数字名片",
      description: "一键生成数字名片，客户可直接添加好友。",
    },
    {
      title: "聚合链接",
      description: "聚合全网链接，一个链接直达所有平台。",
    },
    {
      title: "分销商店",
      description:
        "分享名片、商品即可帮您分销，让客户成为你的分销商，收入加倍。",
    },
  ],
};

export const headerMenuItems: HeaderItem[] = [
  {
    title: "首页",
    href: "/",
  },
  {
    title: "商家",
    href: "/merchant",
  },
];

export const footerMenuItems = [
  {
    title: "网站条款",
    items: [
      // {
      //   title: "购物说明",
      //   href: "/page/shopping-guide",
      //   external: false
      // },
      {
        title: "隐私协议",
        href: "/article/privacy-agreement",
        external: false,
      },
      {
        title: "服务条款",
        href: "/article/terms-of-service",
        external: false,
      },
    ],
  },
];

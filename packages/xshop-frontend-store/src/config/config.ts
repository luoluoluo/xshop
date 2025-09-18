import { HeaderItem } from "@/types";

export const setting = {
  name: "小驴通",
  title: "小驴通 - 手艺人的专属在线主页",
  keywords: "手艺人,在线主页,个人品牌,超级个体,数字名片,聚合链接,分销商店",
  description:
    "3分钟打造专属数字名片、聚合链接与分销商店，助力手艺人高效展示品牌与拓展业务。",
  features: [
    {
      title: "数字名片",
      description: "一键生成精美数字名片，客户扫码即可添加联系方式。",
    },
    {
      title: "聚合链接",
      description: "一站式整合全网链接，客户一链直达你的所有平台。",
    },
    {
      title: "分销商店",
      description:
        "分享名片或商品即可帮您分销，让客户成为你的分销商，收入加倍。",
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

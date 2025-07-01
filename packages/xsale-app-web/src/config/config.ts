import { HeaderItem } from "@/types";

export const setting = {
  name: "小驴通",
  title: "小驴通 - 分佣推广，就用小驴通",
  slogan: "分佣推广，就用小驴通",
  keywords: "分佣推广，联盟营销，佣金推广，推广者，推广平台",
  description: "小驴通是一个为商家提供分佣推广服务的平台",
  features: [
    {
      title: "零风险",
      description: "成交才付费，无效果不花钱",
    },
    {
      title: "数据透明",
      description: "精准识别推广者，实时计算佣金",
    },
    {
      title: "自动分佣",
      description: "订单完成即时结算，佣金自动到账",
    },
    {
      title: "专属服务",
      description: "专属客户经理全程跟进",
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
        href: "/page/privacy-agreement",
        external: false,
      },
      {
        title: "服务条款",
        href: "/page/terms-of-service",
        external: false,
      },
      {
        title: "关于我们",
        href: "/",
        external: false,
      },
    ],
  },
];

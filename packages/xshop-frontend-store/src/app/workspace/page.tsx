"use client";

import { Button, Card, message } from "antd";
import * as Icons from "@ant-design/icons";
import { Clipboard } from "../../components/clipboard";
import { WechatMerchantStatus } from "../../generated/graphql";
import Link from "next/link";
import { useAuth } from "@/contexts/auth";
import { Loading } from "@/components/loading";

// 导航配置
const navigationItems = [
  {
    href: "/workspace/setting",
    icon: Icons.UserOutlined,
    label: "名片设置",
  },
  {
    href: "/workspace/link",
    icon: Icons.LinkOutlined,
    label: "链接管理",
  },
  {
    href: "/workspace/order",
    icon: Icons.GiftOutlined,
    label: "订单管理",
  },
  {
    href: "/workspace/product",
    icon: Icons.ProductOutlined,
    label: "商品管理",
  },
  {
    href: "/workspace/withdrawal",
    icon: Icons.DollarOutlined,
    label: "提现管理",
  },
];

const Dashboard = () => {
  const { me, loading: authLoading } = useAuth();
  const link = `https://xltzx.com/${me?.slug || ""}`;

  if (authLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card title="我的主页链接">
        <div className="mt-4">
          <div className="flex flex-col gap-2 items-center">
            {me?.slug === me?.id ? (
              <div className="flex items-center gap-2">
                <span className="text-red-500">还未配置名片，请先设置名片</span>
                <Link href="/workspace/setting">去设置</Link>
              </div>
            ) : (
              <div className="flex gap-1">
                <a href={link} target="_blank">
                  {link}
                </a>
                <Clipboard
                  value={link}
                  onSuccess={() => {
                    message.success("复制成功");
                  }}
                  asChild
                >
                  <Button
                    type="link"
                    className=" text-nowrap pl-2 py-0 m-0 !h-auto"
                  >
                    复制
                  </Button>
                </Clipboard>
              </div>
            )}
            {me?.wechatMerchantStatus !== WechatMerchantStatus.Completed && (
              <div className="mt-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-sm text-gray-500 flex flex-col items-center">
                    <span>
                      配置微信支付后，客户支付资金将自动到您的微信商户号,
                      微信支付费率低至0.2%
                    </span>
                    <span className="text-red-500 text-sm">
                      （未配置则由小驴通代收，提现将代扣6%税费）
                    </span>
                    <Link
                      href="/workspace/setting?tab=payment"
                      className="mt-2"
                    >
                      立即配置
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card title="快捷导航">
        <div className="flex flex-wrap gap-2 w-auto">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center w-24 h-24 flex-grow flex-shrink rounded shadow text-gray-700"
              >
                <IconComponent className="text-[32px]" />
                <div className="text-sm mt-1">{item.label}</div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

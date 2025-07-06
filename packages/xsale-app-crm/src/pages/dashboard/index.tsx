import { Avatar, Button, Card, message, Statistic } from "antd";
import * as Icons from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import { Clipboard } from "../../components/clipboard";
import { useGetIdentity } from "@refinedev/core";
import { Affiliate, WechatOAuth } from "../../generated/graphql";
import { useEffect, useState } from "react";
import { updateMeWechatOAuth, getWechatOauthUrl } from "../../requests/auth";
import { request } from "../../utils/request";

const Dashboard = () => {
  const { data: me } = useGetIdentity<Affiliate>();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const [wechatOauthUrl, setWechatOauthUrl] = useState<string>();
  const [wechatOAuth, setWechatOAuth] = useState<WechatOAuth>();
  useEffect(() => {
    if (me?.id) {
      if (me.wechatOAuth) {
        setWechatOAuth(me.wechatOAuth);
      }
      // 微信oauth 回调
      if (code && state && state === "wechat") {
        void request<{
          updateMeWechatOAuth: WechatOAuth;
        }>({
          query: updateMeWechatOAuth,
          variables: {
            code,
          },
        }).then((res) => {
          if (res.errors) {
            message.error(res.errors?.[0]?.message);
            return;
          } else {
            setWechatOAuth(res.data?.updateMeWechatOAuth);
            setWechatOauthUrl(undefined);
            message.success("绑定微信成功");
          }
        });
      } else {
        void request<{ wechatOauthUrl: string }>({
          query: getWechatOauthUrl,
          variables: {
            redirectUrl: window.location.href,
            scope: "snsapi_userinfo",
            state: "wechat",
          },
        }).then((res) => {
          if (res.data?.wechatOauthUrl) {
            setWechatOauthUrl(res.data?.wechatOauthUrl);
            // window.location.href = res.data?.wechatOauthUrl;
          }
        });
      }
    }
  }, [me?.id]);
  return (
    <div className="flex flex-col gap-4 p-4">
      <Card title="我的推广ID">
        <div className="mt-4">
          <div className="flex flex-col gap-2 items-center">
            <div className="flex gap-1">
              <div>{me?.id}</div>
              <Clipboard
                value={me?.id || ""}
                onSuccess={() => {
                  message.success("推广ID复制成功");
                }}
                className=" text-nowrap px-2"
              >
                复制
              </Clipboard>
            </div>
            {!wechatOAuth?.openId ? (
              <div className="mt-4 flex flex-col gap-2">
                <Button type="primary" href={wechatOauthUrl}>
                  绑定微信
                </Button>
                <div className="text-sm text-gray-500">
                  绑定微信后，佣金将自动提现到微信钱包，无需手动提现
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    已与
                    <Avatar src={me?.wechatOAuth?.avatar} size={24} />
                    <span>{me?.wechatOAuth?.nickName}绑定</span>
                    {wechatOauthUrl && (
                      <Button type="link" danger href={wechatOauthUrl}>
                        重新绑定
                      </Button>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    绑定微信后，佣金将自动提现到微信钱包，无需手动提现
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card title="快捷导航">
        <div className="flex flex-wrap gap-8">
          <Link
            to="/order"
            className="flex flex-col items-center justify-center w-24 h-24 rounded shadow text-gray-700"
          >
            <Icons.GiftOutlined className="text-[32px] " />
            <div className="text-sm mt-1">订单列表</div>
          </Link>
          <Link
            to="/product"
            className="flex flex-col items-center justify-center w-24 h-24 rounded shadow text-gray-700"
          >
            <Icons.ProductOutlined className="text-[32px] " />
            <div className="text-sm mt-1">产品列表</div>
          </Link>
        </div>
      </Card>

      <Card title="仪表盘">
        <div className="flex flex-wrap gap-8 mt-8">
          <div className="flex flex-col text-gray-700">
            <Statistic title="余额" value={me?.balance || 0} />
            <Link
              to="/affiliate-withdrawal/new"
              className="mt-4"
              type="primary"
            >
              申请提现
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

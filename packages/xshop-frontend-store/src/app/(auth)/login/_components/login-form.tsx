"use client";

import { Loading } from "@/components/loading";
import { getWechatOauthUrl, wechatLogin } from "@/requests/auth.client";
import { cn } from "@/utils";
import { setToken } from "@/utils/auth.client";
import { getChannel } from "@/utils/index.client";
import { message, QRCode } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icons } from "@/components/icons";

export const LoginForm = ({ className }: { className?: string }) => {
  const [wechatOauthUrl, setWechatOauthUrl] = useState<string | null>(null);

  const [isWechat, setIsWechat] = useState<boolean>();

  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    const channel = getChannel();
    setIsWechat(channel === "wechat");
  }, []);

  useEffect(() => {
    // 还未获取到渠道，不进行请求
    if (isWechat === undefined) return;

    const u = new URL(window.location.href);
    const redirectUrl = decodeURIComponent(
      u.searchParams.get("url") || window.location.origin,
    );
    // 微信登录回调
    if (code && state) {
      wechatLogin({
        data: {
          code,
          state,
        },
      })
        .then((res) => {
          if (res.errors) {
            message.error(res.errors[0].message);
            return;
          }
          if (res.data?.wechatLogin) {
            setToken(res.data.wechatLogin.token);
            window.location.href = redirectUrl;
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      const state = `wechat-state:${crypto.randomUUID()}`;
      getWechatOauthUrl({
        // redirectUrl: "https://xltzx.com",
        redirectUrl,
        state,
      })
        .then((res) => {
          console.log(res);
          if (res.errors) {
            message.error(res.errors[0].message);
            return;
          }
          setWechatOauthUrl(res.data?.wechatOauthUrl || null);
          // // 微信中自动oauth登录
          // if (isWechat) {
          //   window.location.href = res.data?.wechatOauthUrl || "";
          // } else {
          //   setWechatOauthUrl(res.data?.wechatOauthUrl || null);
          // }
        })
        .catch((e) => {
          console.error(e);
        });
      if (!isWechat) {
        // 定时器登录
        const timer = setInterval(() => {
          wechatLogin({
            data: {
              state,
            },
          })
            .then((res) => {
              if (res.data?.wechatLogin) {
                clearInterval(timer);
                setToken(res.data.wechatLogin.token);
                window.location.href = redirectUrl;
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }, 1000);
        return () => {
          clearInterval(timer);
        };
      }
    }
  }, [isWechat]);

  if (!wechatOauthUrl) {
    return <Loading />;
  }

  return (
    <div
      className={cn(
        "w-full flex flex-col justify-center items-center my-20 lg:my-40",
        className,
      )}
    >
      {isWechat ? (
        <>
          <div
            className="bg-green-500 flex gap-2 items-center active:opacity-80 text-white text-sm rounded-sm px-4 py-2 cursor-pointer text-nowrap"
            onClick={() => {
              window.location.href = wechatOauthUrl;
            }}
          >
            <Icons.wechat className="flex-shrink-0 w-4 h-4" />
            <span>微信一键登录</span>
          </div>
        </>
      ) : (
        <>
          <QRCode value={wechatOauthUrl} size={200} />
          <div className="text-center mt-4">使用微信扫码登录</div>
        </>
      )}
    </div>
  );
};

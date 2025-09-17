import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { message } from "antd";
import { WechatOutlined } from "@ant-design/icons";
import QRCode from "qrcode";
import { getWechatOauthUrl, wechatLogin } from "../../requests/auth";
import { getChannel } from "../../utils/index.client";
import { useLogin } from "@refinedev/core";

export const WechatLogin = () => {
  const [wechatOauthUrl, setWechatOauthUrl] = useState<string | null>(null);
  const [wechatOauthUrlForRedirect, setWechatOauthUrlForRedirect] = useState<
    string | null
  >(null);
  const [isWechat, setIsWechat] = useState<boolean>();
  const { mutate: login } = useLogin();

  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    const channel = getChannel();
    setIsWechat(channel === "wechat");
  }, []);

  useEffect(() => {
    // 还未获取到渠道，不进行请求
    if (isWechat === undefined) return;

    const redirectUrl = window.location.origin;

    // 微信登录回调
    if (code && state) {
      login({
        code,
        state,
      });
    } else {
      const state = `wechat-state:${crypto.randomUUID()}`;
      getWechatOauthUrl({
        redirectUrl,
        state,
      })
        .then((res) => {
          if (res.errors) {
            message.error(res.errors[0].message);
            return;
          }
          const oauthUrl = res.data?.wechatOauthUrl;
          if (oauthUrl) {
            setWechatOauthUrlForRedirect(oauthUrl);
            if (!isWechat) {
              void QRCode.toDataURL(oauthUrl).then((url) => {
                setWechatOauthUrl(url);
              });
            }
          }
        })
        .catch((e) => {
          console.error(e);
          message.error("获取微信登录二维码失败");
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
                login({
                  state,
                });
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
  }, [isWechat, code, state, login]);

  if (!wechatOauthUrl && !isWechat) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">正在生成登录二维码...</div>
      </div>
    );
  }

  if (isWechat && !wechatOauthUrlForRedirect) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">正在准备微信登录...</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center items-center my-8">
      {isWechat ? (
        <div
          className="bg-green-500 flex gap-2 items-center active:opacity-80 text-white text-sm rounded-sm px-4 py-2 cursor-pointer text-nowrap"
          onClick={() => {
            if (wechatOauthUrlForRedirect) {
              window.location.href = wechatOauthUrlForRedirect;
            }
          }}
        >
          <WechatOutlined className="flex-shrink-0" />
          <span>微信一键登录</span>
        </div>
      ) : (
        <>
          <img
            src={wechatOauthUrl || ""}
            alt="微信扫码登录"
            className="w-48 h-48"
          />
          <div className="text-center mt-4 text-gray-600">使用微信扫码登录</div>
        </>
      )}
    </div>
  );
};

"use client";
import { useAuth } from "@/contexts/auth";
import { getWechatJsConfig } from "@/requests/wechat.client";
import { AFFILIATE_ID_KEY } from "@/utils";
import { useEffect } from "react";
import wx from "weixin-js-sdk";

export const Wechat = (props: {
  shareConfig?: { title: string; desc?: string; imgUrl?: string };
}) => {
  const { me } = useAuth();
  useEffect(() => {
    void getWechatJsConfig({ where: { url: window.location.href } }).then(
      (res) => {
        if (res.errors) {
          console.log(res.errors);
          return;
        }
        if (!res.data) return;
        wx.config({
          ...res.data.wechatJsConfig,
          // debug: true,
          jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"],
        });
      },
    );
  }, []);
  useEffect(() => {
    let link = window.location.href;
    if (me) {
      const url = new URL(link);
      url.searchParams.set(AFFILIATE_ID_KEY, me.id);
      link = url.toString();
    }
    wx.ready(() => {
      // wx.hideMenuItems({
      //   menuList: ["menuItem:copyUrl"]
      // });
      wx.updateAppMessageShareData({
        title: props.shareConfig?.title || "",
        desc: props.shareConfig?.desc || "",
        link,
        imgUrl: props.shareConfig?.imgUrl || "",
        success: () => {
          console.log("updateAppMessageShareData success");
        },
        fail: (e) => {
          console.log("updateAppMessageShareData error: ", e);
        },
      });
      wx.updateTimelineShareData({
        title: props.shareConfig?.title || "",
        link,
        imgUrl: props.shareConfig?.imgUrl || "",
        success: () => {
          console.log("updateTimelineShareData success");
        },
        fail: (e) => {
          console.log("updateTimelineShareData error: ", e);
        },
      });
    });
  }, [props.shareConfig]);
  return <></>;
};

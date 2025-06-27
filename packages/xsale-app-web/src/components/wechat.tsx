"use client";
import { WechatJsConfig } from "@/generated/graphql";
import { getWechatJsConfig } from "@/requests/wechat";
import { request } from "@/utils/request";
import { useEffect } from "react";
import wx from "weixin-js-sdk";

export const Wechat = (props: { shareConfig?: { title: string; desc?: string; imgUrl?: string } }) => {
  useEffect(() => {
    request<{ wechatJsConfig: WechatJsConfig }>({
      query: getWechatJsConfig,
      variables: { where: { url: window.location.href } }
    }).then(res => {
      if (res.errors) {
        console.log(res.errors);
        return;
      }
      if (!res.data) return;
      wx.config({
        ...res.data!.wechatJsConfig,
        // debug: true,
        jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"]
      });
    });
  }, []);
  useEffect(() => {
    const link = window.location.href;
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
        fail: e => {
          console.log("updateAppMessageShareData error: ", e);
        }
      });
      wx.updateTimelineShareData({
        title: props.shareConfig?.title || "",
        link,
        imgUrl: props.shareConfig?.imgUrl || "",
        success: () => {
          console.log("updateTimelineShareData success");
        },
        fail: e => {
          console.log("updateTimelineShareData error: ", e);
        }
      });
    });
  }, [props.shareConfig]);
  return <></>;
};

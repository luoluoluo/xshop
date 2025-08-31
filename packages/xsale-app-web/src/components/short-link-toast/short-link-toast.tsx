"use client";
import { ShortLink } from "@/generated/graphql";
import { getShortLink } from "@/requests/short-link";
import { request } from "@/utils/request";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export const ShortLinkToast = ({ id }: { id?: string }) => {
  useEffect(() => {
    if (!id) {
      return;
    }
    request<{ shortLink: ShortLink }>({
      query: getShortLink,
      variables: {
        id,
      },
    })
      .then((res) => {
        if (res.errors) {
          console.error(res.errors);
          return;
        }
        if (!res.data?.shortLink.url) {
          console.error("短链接不存在");
          return;
        }
        const url = res.data?.shortLink.url || "";
        const cleanUrl = url ? url.replace(/\?.*$/, "") : url;

        toast({
          title: `网址跳转中...`,
          description: <div className="text-wrap">正在跳转至{cleanUrl}</div>,
          duration: 3000,
        });
        setTimeout(() => {
          window.location.href = url;
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  return null;
};

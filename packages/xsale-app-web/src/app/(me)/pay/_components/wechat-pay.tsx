"use client";

import { AmountFormat } from "@/components/amount";
import { CardMeta } from "@/components/card";
import { Icons } from "@/components/icons";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { OrderStatus, Payment, WechatAccessToken } from "@/generated/graphql";
import { wechatAccessToken, wechatOauthUrl } from "@/requests/auth";
import { createOrderPayment, getOrderStatus } from "@/requests/order";
import { getChannel } from "@/utils/index.client";
import { request } from "@/utils/request.client";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { useCallback, useEffect, useState } from "react";

export const WechatPay = ({
  orderId,
  title,
  amount,
}: {
  orderId: string;
  title: string;
  amount: string;
}) => {
  const searchParams = useSearchParams();
  const state = searchParams.get("state");
  const code = searchParams.get("code");
  const [payQrcode, setPayQrcode] = useState<string>();
  const [openId, setOpenId] = useState<string>();
  const [orderStatus, setOrderStatus] = useState<OrderStatus>();

  // // 跳转到订单页面前更新历史记录
  // const redirectToOrder = (withContact = false) => {
  //   const orderListUrl = `${window.location.origin}/order`;
  //   // 先将当前页面替换为订单列表页
  //   window.history.replaceState(null, "", orderListUrl);
  //   // 然后将订单详情页推入历史记录
  //   const targetUrl = `${orderUrl}${withContact ? "?contact=true" : ""}`;
  //   window.history.pushState(null, "", targetUrl);
  //   // 最后进行跳转
  //   window.location.href = targetUrl;
  // };

  const loadOrderStatus = useCallback(() => {
    void request<{
      orderStatus: OrderStatus;
    }>({
      query: getOrderStatus,
      variables: {
        id: orderId,
      },
    }).then((res) => {
      if (res.errors) {
        console.log(res.errors);
        return;
      }
      setOrderStatus(res.data?.orderStatus);
    });
  }, [orderId]);

  useEffect(() => {
    loadOrderStatus();
    const t = setInterval(() => {
      loadOrderStatus();
    }, 1000);
    return () => {
      clearInterval(t);
    };
  }, [loadOrderStatus]);

  useEffect(() => {
    if (!orderStatus) {
      return;
    }
    const payUrl = `${window.location.href}`;
    const orderUrl = `${window.location.origin}/order/${orderId}`;
    if (orderStatus !== OrderStatus.Created) {
      window.location.href = orderUrl;
      return;
    }
    const channel = getChannel();
    if (channel === "wechat") {
      if (!openId) {
        // 微信oauth 回调
        if (code && state && state === "wechat") {
          void request<{
            wechatAccessToken: WechatAccessToken;
          }>({
            query: wechatAccessToken,
            variables: {
              code,
            },
          }).then((res) => {
            if (res.errors) {
              return toast({
                title: res.errors?.[0]?.message,
                variant: "destructive",
              });
            } else {
              setOpenId(res.data?.wechatAccessToken?.openId);
            }
          });
        } else {
          void request<{ wechatOauthUrl: string }>({
            query: wechatOauthUrl,
            variables: {
              redirectUrl: payUrl,
              scope: "snsapi_base",
              state: "wechat",
            },
          }).then((res) => {
            if (res.data?.wechatOauthUrl) {
              window.location.href = res.data?.wechatOauthUrl;
            }
          });
        }
      } else {
        void request<{ createOrderPayment: Payment }>({
          query: createOrderPayment,
          variables: {
            data: {
              orderId,
              openId,
            },
          },
        }).then((res) => {
          if (res.errors) {
            const error = res.errors[0];
            return toast({ title: error.message, variant: "destructive" });
          }
          if (window?.WeixinJSBridge) {
            window.WeixinJSBridge.invoke(
              "getBrandWCPayRequest",
              res.data?.createOrderPayment,
              (res: any) => {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  window.location.href = `${orderUrl}?contact=true`;
                } else {
                  toast({ title: "支付失败", variant: "destructive" });
                  window.location.href = orderUrl;
                }
              },
            );
          }
        });
      }
    } else {
      QRCode.toDataURL(payUrl, {
        width: 300,
        margin: 0,
      })
        .then((res) => {
          setPayQrcode(res);
        })
        .catch((e) => {
          console.log(e, 111);
        });
      return;
    }
  }, [openId, code, state, orderId, orderStatus]);

  return (
    <>
      <div className="px-4 border border-gray-100 shadow-sm rounded">
        <div className="flex justify-between mt-4 items-center text-black font-bold">
          <div className="text-black font-bold flex items-center gap-2">
            <Icons.order className="w-5 h-5" /> <div>订单信息</div>
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-1 p-2">
          <CardMeta name="编号" value={orderId}></CardMeta>
        </div>

        <div className="text-black font-bold flex items-center gap-2 mt-4">
          <Icons.product className="w-5 h-5" /> <div>产品信息</div>
        </div>
        <div className="mt-2 flex flex-col gap-1 p-2">
          <CardMeta name="产品名称" value={title}></CardMeta>
        </div>
        <div className="flex flex-col gap-2 w-full border-t p-4 mt-4">
          <>
            <div className="flex justify-between items-center ">
              <div className="font-bold">金额</div>
              <AmountFormat value={Number(amount)} />
            </div>
          </>
        </div>
      </div>
      <Dialog
        open={!!payQrcode}
        onOpenChange={() => {
          window.location.href = "/order";
        }}
      >
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <DialogTitle>{title}</DialogTitle>
          <div className="p-4 flex flex-col items-center justify-center mt-8 gap-4">
            {/* <div className="text-2xl font-bold">{title}</div> */}
            <img
              width={256}
              height={256}
              alt=""
              src={payQrcode}
              className="w-64"
            />
            <div className=" text-gray-500">请使用微信扫码支付</div>
            <AmountFormat value={Number(amount)}></AmountFormat>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

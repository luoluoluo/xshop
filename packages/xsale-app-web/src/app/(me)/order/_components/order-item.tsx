"use client";

import { AmountFormat } from "@/components/amount";
import { CardFooter, CardMeta } from "@/components/card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Order, OrderStatus } from "@/generated/graphql";
import { cn } from "@/utils";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

dayjs.extend(timezone);
dayjs.extend(utc);

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Created:
      return "待支付";
    case OrderStatus.Cancelled:
      return "已取消";
    case OrderStatus.Paid:
      return "已支付";
    case OrderStatus.Refunded:
      return "已退款";
    case OrderStatus.Completed:
      return "已完成";
    default:
      return "";
  }
};

export const OrderItem = ({ order, link, className }: { order: Order; link?: boolean; className?: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<"cancel" | "pay" | "refund">();

  const onPay = () => {
    router.push(`/pay?orderId=${order.id}&title=${order.productTitle}&amount=${order.amount}`);
  };

  return (
    <>
      <div
        className={cn(`px-4 border border-gray-100 shadow-sm rounded`, link ? " cursor-pointer" : "", className)}
      // onClick={() => {
      //   if (link) router.push(`/order/${order.id}`);
      // }}
      >
        <div className="flex justify-between mt-4 items-center text-black font-bold">
          <div className="text-black font-bold flex items-center gap-2">
            <Icons.order className="w-5 h-5" /> <div>订单信息</div>
          </div>
          <div>{getStatusText(order.status!)}</div>
        </div>
        <div className="mt-2 flex flex-col gap-1 p-2">
          <CardMeta name="编号" value={order.id!} link={link ? `/order/${order.id}` : undefined}></CardMeta>
          <CardMeta name="下单时间" value={dayjs(order.createdAt).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm")}></CardMeta>
          {order.cancelledAt ? (
            <CardMeta
              name="取消时间"
              value={dayjs(order.cancelledAt).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm")}
            ></CardMeta>
          ) : null}
          {order.paidAt ? (
            <CardMeta
              name="支付时间"
              value={dayjs(order.paidAt).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm")}
            ></CardMeta>
          ) : null}
          {order.refundedAt ? (
            <CardMeta
              name="退款时间"
              value={dayjs(order.refundedAt).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm")}
            ></CardMeta>
          ) : null}
          {order.completedAt ? (
            <CardMeta
              name="完成时间"
              value={dayjs(order.completedAt).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm")}
            ></CardMeta>
          ) : null}
          {order.note ? <CardMeta name="备注" value={order.note || ""}></CardMeta> : null}
        </div>

        <div className="text-black font-bold flex items-center gap-2 mt-4">
          <Icons.product className="w-5 h-5" /> <div>产品信息</div>
        </div>
        <div className="box-border p-4 rounded shadow mt-4">
          <div className="flex flex-col gap-8 w-full box-border">
            <div className="flex box-border w-full min-w-0">
              <Image
                priority
                width={480}
                height={480}
                src={order.productImage || ""}
                alt=""
                className="w-[120px] h-[120px] object-cover object-center border rounded"
              />
              <div className=" pl-4 box-border min-w-0 flex flex-col justify-between">
                <div>
                  <Link
                    prefetch={false}
                    href={`/product/${order.productId}`}
                    className="font-bold w-full leading-6 inline-block overflow-hidden text-muted-foreground"
                  >
                    {order.productTitle}
                  </Link>
                  <AmountFormat value={order.productPrice || 0} size="sm" className="mt-1"></AmountFormat>
                </div>
                <div className="mt-2 flex items-center gap-4">{`x ${order.quantity}`}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full border-t p-4 mt-4">
          {/* <AmountFormat value={order.amount!}></AmountFormat> */}
          <>
            <div className="flex justify-between items-center">
              <div className="text-sm">费用小计</div>
              <AmountFormat size="sm" value={order.amount || 0} />
            </div>

            <div className="flex justify-between items-center ">
              <div className="font-bold">合计</div>
              <AmountFormat value={order.amount || 0} />
            </div>
          </>
        </div>

        <CardFooter
          actions={[
            ...(order.status === OrderStatus.Created
              ? [
                <Button
                  key="pay"
                  size="sm"
                  disabled={loading === "pay"}
                  onClick={async () => {
                    if (loading === "pay") return;
                    setLoading("pay");
                    await onPay();
                    setLoading(undefined);
                  }}
                >
                  立即支付
                </Button>
              ]
              : []),
            ...([OrderStatus.Paid].includes(order.status!)
              ? [
                <Button
                  key="refund"
                  size="sm"
                  disabled={loading === "refund"}
                  variant="destructive"
                  onClick={async () => {
                    toast({
                      title: "订单处理中，请联系商家申请退款",
                      variant: "destructive"
                    });
                    return;
                  }}
                >
                  申请退款
                </Button>
              ]
              : [])
          ]}
        ></CardFooter>
      </div>
    </>
  );
};

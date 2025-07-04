"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthToken, Order, Product } from "@/generated/graphql";
import { login } from "@/requests/auth";
import { createOrder } from "@/requests/order";
import { getLoginUrl, getMe, setToken } from "@/utils/auth.client";
import { getAffiliateId } from "@/utils/index.client";
import { request } from "@/utils/request.client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AmountFormat } from "../amount";
import { toast } from "../ui/use-toast";

const FormSchema = z.object({
  phone: z.string().min(1, {
    message: "请输入手机号",
  }),
  name: z.string().min(1, {
    message: "请输入姓名",
  }),
  note: z.string().optional(),
});

export function CheckoutSheet({
  product,
  children,
  quantity,
}: {
  product: Product;
  quantity: number;
  children: ReactNode;
}) {
  const me = getMe();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  if (!loaded) return <></>;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (loading) return;
    // 如果未登录，调用登录接口

    if (!me) {
      const loginRes = await request<{ login: AuthToken }>({
        query: login,
        variables: {
          data: {
            phone: data.phone,
            name: data.name,
          },
        },
      });
      if (loginRes.errors) {
        return toast({
          title: loginRes.errors[0].message,
          variant: "destructive",
          action: (
            <Button
              variant="link"
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
            >
              去登录
            </Button>
          ),
        });
      }
      if (loginRes.data?.login) {
        setToken(loginRes.data.login);
      }
    }
    setLoading(true);
    const res = await request<{ createOrder: Order }>({
      query: createOrder,
      variables: {
        data: {
          receiverPhone: data.phone,
          receiverName: data.name,
          note: data.note,
          productId: product.id,
          quantity,
          affiliateId: getAffiliateId(),
        },
      },
    });
    setLoading(false);
    if (res.errors) {
      const error = res.errors[0];
      return toast({ title: error.message, variant: "destructive" });
    }
    window.location.href = `/pay?orderId=${res.data?.createOrder.id}&title=${product.title}&amount=${res.data?.createOrder.amount}&quantity=${quantity}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSubmit(onSubmit)(e);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        onInteractOutside={(e) => e.preventDefault()}
        side="right"
        className="px-4 pt-9 pb-4 box-border"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetTitle></SheetTitle>
        <div className="text-black font-bold text-2xl">结账</div>
        <div className="h-[calc(100vh-15rem)] box-border overflow-y-auto">
          <div className="flex flex-col mt-8 gap-2">
            <div className="text-black font-bold flex items-center gap-2">
              <Icons.product className="w-5 h-5" /> <div>产品信息</div>
            </div>
            <div className="box-border">
              <div className="flex flex-col gap-8 w-full box-border">
                <div className="flex box-border w-full min-w-0">
                  <Image
                    priority
                    width={480}
                    height={480}
                    src={`${product.image}?w=960&h=960`}
                    alt=""
                    className="w-[120px] h-[120px] object-cover object-center border rounded"
                  />
                  <div className=" pl-4 box-border min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="font-bold w-full h-12 leading-6 inline-block overflow-hidden">
                        {product.title}
                      </div>
                      <AmountFormat
                        value={product.price!}
                        size="sm"
                        className="mt-1"
                      ></AmountFormat>
                    </div>
                    <div className="mt-2 flex items-center gap-4">{`x ${quantity}`}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <div className="text-black font-bold flex items-center gap-2">
              <Icons.email className="w-5 h-5" /> <div>联系方式</div>
            </div>
            <div className={`w-full flex flex-col gap-2`}>
              <div className="w-full">
                <input
                  placeholder="姓名"
                  defaultValue={me?.name || ""}
                  className={`w-full p-2 box-border outline-none rounded text-black bg-gray-100 border ${errors.name ? "border-red-500" : ""}`}
                  {...register("name")}
                />
                {errors.name ? (
                  <div className=" text-red-500 text-sm">
                    {errors.name.message}
                  </div>
                ) : null}
              </div>
              <div className="w-full">
                <input
                  placeholder="手机号"
                  defaultValue={me?.phone || ""}
                  className={`w-full p-2 box-border outline-none rounded text-black bg-gray-100 border ${errors.phone ? "border-red-500" : ""}`}
                  {...register("phone")}
                />
                {errors.phone ? (
                  <div className=" text-red-500 text-sm">
                    {errors.phone.message}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-8 gap-2">
            <div className="text-black font-bold flex items-center gap-2">
              <Icons.bash className="w-5 h-5" /> <div>备注</div>
            </div>
            <div className="box-border">
              <textarea
                {...register("note")}
                placeholder="备注"
                className={`w-full p-2 box-border outline-none rounded text-black bg-gray-100 border`}
              />
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 flex flex-col gap-2">
          {/* <div className="flex justify-between items-center">
            <div className="text-sm">服务小计</div>
            <AmountFormat size="sm" value={productAmount} />
          </div> */}
          <div className="flex justify-between items-center ">
            <div className="font-bold">合计</div>
            <AmountFormat value={(product.price || 0) * quantity} />
          </div>
        </div>
        <Button
          className="w-full mt-4"
          disabled={loading}
          size="lg"
          onClick={handleFormSubmit}
        >
          结账
        </Button>
      </SheetContent>
    </Sheet>
  );
}

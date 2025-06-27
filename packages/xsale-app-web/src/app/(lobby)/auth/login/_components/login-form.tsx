"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { AuthToken } from "@/generated/graphql";
import { login } from "@/requests/auth";
import { cn } from "@/utils";
import { setToken } from "@/utils/auth.client";
import { request } from "@/utils/request";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "请输入姓名"
  }),
  phone: z.string().min(1, {
    message: "请输入手机号"
  })
});

export const LoginForm = ({ className }: { className?: string }) => {
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: "",
      name: ""
    }
  });

  useEffect(() => {
    const u = new URL(window.location.href);
    setRedirectUrl(decodeURIComponent(u.searchParams.get("url") || window.location.origin));
  }, []);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await request<{ login: AuthToken }>({
      query: login,
      variables: {
        data: {
          name: data.name,
          phone: data.phone
        }
      }
    });
    if (res.errors) {
      toast({
        variant: "destructive",
        title: res.errors[0].message
      });
      return;
    }
    setToken(res.data?.login!);
    setLoading(false);
    window.location.href = redirectUrl;
  }
  return (
    <div className={cn("w-full flex flex-col justify-center items-center", className)}>
      {/* <div className="text-center text-2xl font-bold">登录</div> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className=" flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Username</FormLabel> */}
                  <FormControl>
                    <Input placeholder="姓名" {...field} className="text-black bg-gray-100" />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Username</FormLabel> */}
                  <FormControl>
                    <Input placeholder="手机号" {...field} className="text-black bg-gray-100" />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button disabled={loading} type="submit" className="w-full mt-4" onClick={form.handleSubmit(onSubmit)}>
              登录
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderStatus } from "@/generated/graphql";
import { cn } from "@/utils";

export const OrderStatusTabs = ({
  value,
  className,
}: {
  value?: string;
  className?: string;
}) => {
  const handleChange = (key: string) => {
    const u = new URL(window.location.href);
    if (key === "") {
      u.searchParams.delete("status");
    } else {
      u.searchParams.set("status", key);
    }
    window.location.href = u.toString();
  };
  return (
    <Tabs
      defaultValue={value || ""}
      className={cn("w-full", className)}
      onValueChange={handleChange}
    >
      <TabsList>
        <TabsTrigger value="" asChild>
          <span>全部</span>
        </TabsTrigger>
        <TabsTrigger value={OrderStatus.Created} asChild>
          <span>待支付</span>
        </TabsTrigger>
        <TabsTrigger value={OrderStatus.Paid} asChild>
          <span>已支付</span>
        </TabsTrigger>
        <TabsTrigger value={OrderStatus.Completed} asChild>
          <span>已完成</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

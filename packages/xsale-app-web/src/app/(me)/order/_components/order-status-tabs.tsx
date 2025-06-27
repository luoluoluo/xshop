import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderStatus } from "@/generated/graphql";
import { cn } from "@/utils";
import Link from "next/link";

export const OrderStatusTabs = ({ value, className }: { value?: string; className?: string }) => {
  return (
    <Tabs defaultValue={value || "all"} className={cn("w-full", className)}>
      <TabsList>
        <TabsTrigger value="all" asChild>
          <Link prefetch={false} href={`/order`}>
            全部
          </Link>
        </TabsTrigger>
        <TabsTrigger value="created" asChild>
          <Link prefetch={false} href={`/order?status=${OrderStatus.Created}`}>
            待支付
          </Link>
        </TabsTrigger>
        <TabsTrigger value="paid" asChild>
          <Link prefetch={false} href={`/order?status=${OrderStatus.Paid}`}>
            已支付
          </Link>
        </TabsTrigger>
        <TabsTrigger value="completed" asChild>
          <Link prefetch={false} href={`/order?status=${OrderStatus.Completed}`}>
            已完成
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

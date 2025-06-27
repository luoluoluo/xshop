import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          <Link prefetch={false} href={`/order?state=created`}>
            待支付
          </Link>
        </TabsTrigger>
        <TabsTrigger value="paid" asChild>
          <Link prefetch={false} href={`/order?state=paid`}>
            已支付
          </Link>
        </TabsTrigger>
        {/* <TabsTrigger value="completed" asChild>
          <Link prefetch={false} href={`/seller/${authContext.state.seller?.id}/order?state=completed`}>
            已完成
          </Link>
        </TabsTrigger> */}
      </TabsList>
    </Tabs>
  );
};

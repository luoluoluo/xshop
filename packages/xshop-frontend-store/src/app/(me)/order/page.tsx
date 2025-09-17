import { Empty } from "@/components/empty";
import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import { OrderItem } from "@/components/order/order-item";
import { OrderStatusTabs } from "@/components/order/order-status-tabs";
import { Pagination } from "@/components/ui/pagination";
import { OrderStatus } from "@/generated/graphql";
import { getOrders } from "@/requests/order.server";
import { checkToken } from "@/utils/auth.server";
import { getLogger } from "@/utils/logger";

export function generateMetadata() {
  return {
    title: `我的订单`,
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string; status?: OrderStatus; isAffiliate?: string };
}) {
  const isAffiliate = searchParams.isAffiliate === "true";
  checkToken();
  const page = Number(searchParams.page || "1");

  const skip = (page - 1) * 5;
  const take = 5;

  const orders = await getOrders({
    skip,
    take,
    where: { status: searchParams.status },
  }).then((res) => {
    if (res.errors) {
      getLogger().error(res.errors, "getOrders error");
    }
    return res.data?.orders;
  });
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container  lg:flex lg:gap-8">
        <div className="mt-4 lg:mt-8 w-full">
          <OrderStatusTabs value={searchParams.status} />
          {orders?.data?.length ? (
            <>
              <div className="flex flex-col gap-8 mt-8">
                {orders?.data?.map((v) => (
                  <OrderItem
                    link
                    key={v.id}
                    order={v}
                    isAffiliate={isAffiliate}
                  ></OrderItem>
                ))}
              </div>
              <Pagination
                page={page}
                size={take}
                count={orders?.total}
                className="mt-4"
              ></Pagination>
            </>
          ) : (
            <Empty title="暂无订单" className="min-h-[20rem]"></Empty>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

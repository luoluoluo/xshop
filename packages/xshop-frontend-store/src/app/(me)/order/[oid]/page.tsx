import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import { getOrder } from "@/requests/order.server";
import { checkToken } from "@/utils/auth.server";
import { getLogger } from "@/utils/logger";
import { getUser } from "@/requests/user.server";
import { BusinessCard } from "@/components/business-card/business-card";
import { OrderItem } from "@/components/order/order-item";

export function generateMetadata() {
  return {
    title: `我的订单`,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { oid: string };
  searchParams: { isAffiliate?: string };
}) {
  checkToken();
  const isAffiliate = searchParams.isAffiliate === "true";
  const order = await getOrder({
    id: params.oid,
  }).then((res) => {
    if (res.errors) {
      getLogger().error(res.errors, "getOrder error");
    }
    return res.data?.order;
  });
  if (!order) {
    return <></>;
  }

  const user = await getUser({
    id: order.merchantId!,
  }).then((res) => {
    if (res.errors) {
      getLogger().error(res.errors, "getUser error");
    }
    return res.data?.user;
  });

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader
        logoAttributes={{
          name: user?.name || undefined,
          logo: user?.avatar || undefined,
          link: `/${user?.slug}`,
        }}
      />
      <main className="container lg:flex lg:gap-8">
        <OrderItem
          order={order}
          className="mt-4 lg:mt-8 w-full"
          isAffiliate={isAffiliate}
        ></OrderItem>
        <div className="w-full lg:w-[375px] flex-shrink-0 border-t mt-4 lg:mt-0 lg:border-none">
          <BusinessCard user={user} className="mt-4 lg:mt-8" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

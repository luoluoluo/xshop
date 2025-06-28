import { BusinessCard } from "@/components/business-card/business-card";
import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import { Merchant, Order } from "@/generated/graphql";
import { getMerchant } from "@/requests/merchant";
import { getOrder } from "@/requests/order";
import { checkToken } from "@/utils/auth.server";
import { getAffiliateId } from "@/utils/index.server";
import { getLogger } from "@/utils/logger";
import { request } from "@/utils/request.server";
import { OrderItem } from "../_components/order-item";

export async function generateMetadata() {
  return {
    title: `我的订单`
  };
}

export default async function Page({ params }: { params: { orderId: string } }) {
  checkToken();
  const order = await request<{ order: Order }>({
    query: getOrder,
    variables: {
      id: params.orderId
    }
  }).then(res => {
    if (res.errors) {
      getLogger().error(res.errors, "getOrder error");
    }
    return res.data?.order;
  });
  if (!order) {
    return <></>;
  }

  const merchant = await request<{ merchant: Merchant }>({
    query: getMerchant,
    variables: { id: order?.merchantId, affiliateId: getAffiliateId() }
  }).then(res => {
    if (res.errors) {
      getLogger().error(res.errors, "getMerchant error");
    }
    return res.data?.merchant;
  });

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader logoAttributes={{ name: merchant?.name || undefined, logo: merchant?.logo || undefined, link: "#" }} />
      <main className="container lg:flex lg:gap-8">
        <OrderItem order={order} className="mt-4 lg:mt-8 w-full"></OrderItem>
        <div className="w-full lg:w-[375px] flex-shrink-0 border-t mt-4 lg:mt-0 lg:border-none">
          <BusinessCard merchant={merchant} className="mt-4 lg:mt-8" showAction />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

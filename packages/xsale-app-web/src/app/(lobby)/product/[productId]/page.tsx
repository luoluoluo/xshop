import { BusinessCard } from "@/components/business-card/business-card";
import { BuyCard } from "@/components/checkout/buy-card";
import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import { Wechat } from "@/components/wechat";
import { Merchant, Product } from "@/generated/graphql";
import { getMerchant } from "@/requests/merchant";
import { getProduct } from "@/requests/product";
import { getAffiliateId } from "@/utils/index.server";
import { getLogger } from "@/utils/logger";
import { request } from "@/utils/request.server";
export async function generateMetadata({ params }: { params: { productId: string } }) {
  const product = await request<{ product: Product }>({
    query: getProduct,
    variables: { id: params.productId }
  }).then(res => {
    if (res.errors) {
      getLogger().error(res.errors, "getProduct error");
    }
    return res.data?.product;
  });
  return {
    title: product?.title
  };
}

// { searchParams: { page?: string }
export default async function Page({ params }: { params: { productId: string } }) {
  console.log(params, "pppppp");
  const product = await request<{ product: Product }>({
    query: getProduct,
    variables: { id: params.productId }
  }).then(res => {
    if (res.errors) {
      getLogger().error(res.errors, "getProduct error");
    }
    return res.data?.product;
  });
  if (!product) return null;
  const merchant = await request<{ merchant: Merchant }>({
    query: getMerchant,
    variables: { id: product?.merchantId, affiliateId: getAffiliateId() }
  }).then(res => {
    if (res.errors) {
      getLogger().error(res.errors, "getMerchant error");
    }
    return res.data?.merchant;
  });

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader logoAttributes={{ name: merchant?.name || undefined, logo: merchant?.logo || undefined, link: "#" }} />
      <main className="flex-1">
        <div className="container lg:flex lg:gap-8">
          <div className="w-full mt-4 lg:mt-8 lg:p-4 lg:rounded lg:shadow">
            <div className="mt-4 lg:mt-8 pt-4 lg:pt-8 wysiwyg" dangerouslySetInnerHTML={{ __html: product.content || "" }}></div>
            <BuyCard product={product} />
          </div>
          <div className="w-full lg:w-[375px] flex-shrink-0 border-t mt-4 lg:mt-0 lg:border-none">
            <BusinessCard merchant={merchant} className="mt-4 lg:mt-8" showAction />
          </div>
        </div>
      </main>
      <SiteFooter className="mb-24" />
      <Wechat
        shareConfig={{
          title: product?.title || "",
          desc: product.content || "",
          imgUrl: `${product.image}?w=960&h=960`
        }}
      />
    </div>
  );
}

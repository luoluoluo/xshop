import { MerchantBusinessCard } from "@/components/merchant/merchant-business-card";
import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import { Wechat } from "@/components/wechat";
import { Merchant, ProductPagination } from "@/generated/graphql";
import { getMerchant } from "@/requests/merchant";
import { getProducts } from "@/requests/product";
import { getAffiliateId } from "@/utils/index.server";
import { getLogger } from "@/utils/logger";
import { request } from "@/utils/request.server";
import { ProductItem } from "@/components/product/product-item";

export async function generateMetadata({
  params,
}: {
  params: { merchantId: string };
}) {
  const merchant = await request<{ merchant: Merchant }>({
    query: getMerchant,
    variables: { id: params.merchantId },
  }).then((res) => {
    if (res.errors) {
      getLogger().error(res.errors, "getMerchant error");
    }
    return res.data?.merchant;
  });

  const title = merchant?.name || "";
  const description = merchant?.address || "";
  const keywords = merchant?.businessScope || "";
  const imageUrl = merchant?.logo ? `${merchant.logo}?w=960&h=960` : undefined;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 960,
              height: 960,
              alt: title,
            },
          ]
        : undefined,
    },
  };
}

// { searchParams: { page?: string }
export default async function Page({
  params,
}: {
  params: { merchantId: string };
}) {
  console.log(params, "pppppp");
  const products = await request<{ products: ProductPagination }>({
    query: getProducts,
    variables: { where: { merchantId: params.merchantId } },
  }).then((res) => {
    if (res.errors) {
      getLogger().error(res.errors, "getProducts error");
    }
    return res.data?.products.data;
  });
  if (!products) return null;
  const merchant = await request<{ merchant: Merchant }>({
    query: getMerchant,
    variables: { id: params.merchantId, affiliateId: getAffiliateId() },
  }).then((res) => {
    if (res.errors) {
      getLogger().error(res.errors, "getMerchant error");
    }
    return res.data?.merchant;
  });

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* 给企业微信分享看的 */}
      <img src={`${merchant?.logo}?w=960&h=960`} className="hidden" />
      <SiteHeader
        logoAttributes={{
          link: `/merchant/${params.merchantId}`,
          name: merchant?.name || undefined,
          logo: merchant?.logo || undefined,
        }}
      />
      <main>
        <div className="lg:flex lg:gap-8 container">
          <div className="w-full grid grid-cols-2 gap-4 mt-4 lg:mt-8 h-fit">
            {products.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
          <div className="w-full lg:w-[375px] flex-shrink-0 border-t mt-4 lg:mt-0 lg:border-none">
            <MerchantBusinessCard
              merchant={merchant}
              className="mt-4 lg:mt-8"
            />
          </div>
        </div>
      </main>
      <SiteFooter className="pb-20" />
      <Wechat
        shareConfig={{
          title: merchant?.name || "",
          desc: merchant?.address || "",
          imgUrl: `${merchant?.logo}?w=960&h=960`,
        }}
      />
    </div>
  );
}

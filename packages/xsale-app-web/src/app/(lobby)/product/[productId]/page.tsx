import { AmountFormat } from "@/components/amount";
import { MerchantBusinessCard } from "@/components/merchant/merchant-business-card";
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
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: { productId: string };
}) {
  const product = await request<{ product: Product }>({
    query: getProduct,
    variables: { id: params.productId },
  }).then((res) => {
    if (res.errors) {
      getLogger().error(res.errors, "getProduct error");
    }
    return res.data?.product;
  });

  const merchant = await request<{ merchant: Merchant }>({
    query: getMerchant,
    variables: { id: product?.merchantId },
  }).then((res) => {
    if (res.errors) {
      getLogger().error(res.errors, "getMerchant error");
    }
    return res.data?.merchant;
  });

  const title = product?.title || "";
  const description = product?.description || merchant?.name || "";
  const keywords = merchant?.businessScope || "";
  const imageUrl = product?.image ? `${product.image}?w=960&h=960` : undefined;

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
  params: { productId: string };
}) {
  console.log(params, "pppppp");
  const product = await request<{ product: Product }>({
    query: getProduct,
    variables: { id: params.productId },
  }).then((res) => {
    if (res.errors) {
      getLogger().error(res.errors, "getProduct error");
    }
    return res.data?.product;
  });
  if (!product) return null;
  const merchant = await request<{ merchant: Merchant }>({
    query: getMerchant,
    variables: { id: product?.merchantId, affiliateId: getAffiliateId() },
  }).then((res) => {
    if (res.errors) {
      getLogger().error(res.errors, "getMerchant error");
    }
    return res.data?.merchant;
  });

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* 给企业微信分享看的 */}
      <img src={`${product?.image}?w=960&h=960`} className="hidden" />
      <SiteHeader
        theme="product"
        logoAttributes={{
          link: `/merchant/${product.merchantId}`,
          name: merchant?.name || undefined,
          logo: merchant?.logo || undefined,
        }}
      />
      <main>
        <Image
          priority
          width={960}
          height={960}
          src={`${product?.image}?w=960&h=960`}
          alt=""
          className="w-full h-auto lg:hidden object-cover object-center mb-4"
        />
        <div className="lg:flex lg:gap-8 container">
          <div className="w-full lg:mt-8 lg:p-4 lg:rounded lg:shadow">
            <div className="flex flex-col lg:flex-row gap-4">
              <Image
                priority
                width={960}
                height={960}
                src={`${product?.image}?w=960&h=960`}
                alt=""
                className="w-32 h-auto hidden lg:block lg:rounded object-cover object-center"
              />
              <div className="flex flex-col gap-4">
                <div className="text-2xl font-bold lg:mt-0">
                  {/* <span className=" px-2 rounded border  inline-block mr-2">{product.category?.name}</span> */}
                  {product.title}
                </div>
                <AmountFormat value={product.price!} size="lg"></AmountFormat>
              </div>
            </div>
            <div
              className="mt-4 lg:mt-8 pt-4 lg:pt-8 wysiwyg border-t"
              dangerouslySetInnerHTML={{ __html: product.content || "" }}
            ></div>
            <BuyCard product={product} />
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
          title: product?.title || "",
          desc: product?.description || merchant?.name || "",
          imgUrl: `${product.image}?w=960&h=960`,
        }}
      />
    </div>
  );
}

import { AmountFormat } from "@/components/amount";
import { BuyCard } from "@/components/checkout/buy-card";
import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import { Wechat } from "@/components/wechat";
import { getProduct } from "@/requests/product.server";
import { getLogger } from "@/utils/logger";
import { getUser } from "@/requests/user.server";
import { BusinessCard } from "@/components/business-card/business-card";
import { ProductImages } from "@/components/product/product-images";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { pid: string };
}) {
  const product = await getProduct({ id: params.pid }).then((res) => {
    if (res.errors) {
      getLogger().error(res.errors, "getProduct error");
    }
    return res.data?.product;
  });

  const title = product?.title || "";
  const description = product?.description || "";
  const imageUrl = product?.images?.[0]
    ? `${product.images[0]}?w=960&h=960`
    : undefined;

  return {
    title,
    description,
    // keywords,
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
export default async function Page({ params }: { params: { pid: string } }) {
  const product = await getProduct({ id: params.pid }).then((res) => {
    if (res.errors) {
      getLogger().error(res.errors, "getProduct error");
    }
    return res.data?.product;
  });
  if (!product) return notFound();
  const user = await getUser({ id: product.userId! }).then((res) => {
    if (res.errors) {
      getLogger().error(res.errors, "getUser error");
    }
    return res.data?.user;
  });
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* 给企业微信分享看的 */}
      <img src={`${product?.images?.[0]}?w=960&h=960`} className="hidden" />
      <SiteHeader
        theme="product"
        logoAttributes={{
          link: `/${user?.slug}`,
          name: user?.name || undefined,
          logo: user?.avatar || undefined,
        }}
      />
      <main>
        <ProductImages
          data={product.images || []}
          className="w-full h-auto lg:hidden object-cover object-center mb-4"
        />
        <div className="lg:flex lg:gap-8 container">
          <div className="w-full lg:mt-8 lg:p-4 lg:rounded lg:shadow">
            <div className="flex flex-col lg:flex-row gap-4">
              <ProductImages
                data={product.images || []}
                className="flex-shrink-0 w-56 h-56 hidden lg:block lg:rounded object-cover object-center rounded-sm overflow-hidden"
              />
              <div className="flex flex-col gap-4">
                <div className="text-2xl font-bold lg:mt-0">
                  {/* <span className=" px-2 rounded border  inline-block mr-2">{product.category?.name}</span> */}
                  {product.title}
                </div>
                <AmountFormat value={product.price!} size="lg"></AmountFormat>
              </div>
            </div>
            <div className="mt-4 lg:mt-8 pt-4 lg:pt-8 border-t whitespace-pre-wrap">
              {product.description}
            </div>
            <BuyCard product={product} />
          </div>
          <div className="w-full lg:w-[375px] flex-shrink-0 border-t mt-4 lg:mt-0 lg:border-none">
            <BusinessCard user={user} className="mt-4 lg:mt-8" />
          </div>
        </div>
      </main>
      <SiteFooter className="pb-20" />
      <Wechat
        shareConfig={{
          title: product?.title || "",
          desc: product?.description || "",
          imgUrl: `${product.images?.[0]}?w=960&h=960`,
        }}
      />
    </div>
  );
}

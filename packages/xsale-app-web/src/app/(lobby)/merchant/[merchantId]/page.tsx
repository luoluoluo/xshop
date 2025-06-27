import { BannerSwiper } from "@/components/banner/banner-swiper";
import { BusinessCard } from "@/components/business-card/business-card";
import { Contact } from "@/components/contact/contact";
import { Empty } from "@/components/empty";
import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import { ProductItem } from "@/components/product/product-item";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wechat } from "@/components/wechat";
import { BannerPagination, Merchant, ProductCategoryPagination, ProductPagination } from "@/generated/graphql";
import { getBanners } from "@/requests/banner";
import { getMerchant } from "@/requests/merchant";
import { getProducts } from "@/requests/product";
import { getProductCategories } from "@/requests/product-category";
import { cn } from "@/utils";
import { getAffiliateId } from "@/utils/index.server";
import { getLogger } from "@/utils/logger";
import { request } from "@/utils/request.server";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { merchantId: string } }): Promise<Metadata> {
  const merchant = await request<{ merchant: Merchant }>({
    query: getMerchant,
    variables: {
      id: params.merchantId
    }
  }).then(res => {
    if (res.errors) {
      getLogger().error(res.errors, "getMerchant error");
    }
    return res.data?.merchant;
  });
  return {
    title: `${merchant?.name}`,
    description: merchant?.description
    // icons: {
    //   icon: download(merchant?.photo || "", { w: 240, h: 240 })
    // }
  };
}
export default async function Page({
  searchParams,
  params
}: {
  searchParams?: { categoryId?: string };
  params: { merchantId: string };
}) {
  const merchant = await request<{ merchant: Merchant }>({
    query: getMerchant,
    variables: {
      id: params.merchantId,
      affiliateId: getAffiliateId()
    }
  }).then(res => {
    if (res.errors) {
      getLogger().error(res.errors, "getMerchant error");
    }
    return res.data?.merchant;
  });
  const categories = await request<{ productCategories: ProductCategoryPagination }>({
    query: getProductCategories,
    variables: {
      where: {
        merchantId: merchant?.id
      }
    }
  }).then(res => {
    if (res.errors) {
      getLogger().error(res.errors, "getCategories error");
    }
    return res.data?.productCategories.data;
  });
  const products = await request<{ products: ProductPagination }>({
    query: getProducts,
    variables: {
      where: {
        merchantId: merchant?.id,
        categoryId: searchParams?.categoryId
      }
    }
  }).then(res => {
    if (res.errors) {
      getLogger().error(res.errors, "getProducts error");
    }
    return res.data?.products.data;
  });
  const banners = await request<{ banners: BannerPagination }>({
    query: getBanners,
    variables: {
      where: { merchantId: merchant?.id }
    }
  }).then(res => {
    if (res.errors) {
      getLogger().error(res.errors, "getBanners error");
    }
    return res.data?.banners.data;
    // return items?.length ? items : [{ id: "default", image: "/images/banner.jpeg", link: "/" }];
  });
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex overflow-hidden">
        <div className="container lg:flex lg:gap-8">
          <div className="w-full lg:w-[375px] flex-shrink-0 ">
            <BusinessCard merchant={merchant} className="mt-4 lg:mt-8" showAction />
          </div>
          <div className=" w-full flex-shrink-1">
            <BannerSwiper data={banners || []} className="rounded overflow-hidden mt-4 lg:mt-8" />
            <div className="mt-4 lg:mt-8">
              <Tabs defaultValue={searchParams?.categoryId || "all"} className={cn("w-full overflow-x-auto")}>
                <TabsList>
                  <TabsTrigger value="all" asChild>
                    <Link prefetch={false} href={`/merchant/${merchant?.id}`}>
                      全部产品
                    </Link>
                  </TabsTrigger>
                  {categories?.map(v => {
                    return (
                      <TabsTrigger key={v.id} value={v.id || ""} asChild>
                        <Link prefetch={false} href={`/merchant/${merchant?.id}?categoryId=${v.id}`}>
                          {v.name}
                        </Link>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
              {products?.length ? (
                <div className="my-4">
                  <div className="w-full grid flex-1 grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(vv => {
                      return <ProductItem key={vv.id} product={vv} />;
                    })}
                  </div>
                </div>
              ) : (
                <Empty title="暂无产品" className="min-h-[20rem]"></Empty>
              )}
            </div>
          </div>
        </div>
      </main>
      <Contact merchant={merchant!} />
      <SiteFooter />
      <Wechat
        shareConfig={{
          title: `${merchant?.name}`,
          desc: merchant?.description || "",
          imgUrl: `${merchant?.logo}?w=800&h=800`
        }}
      />
    </div>
  );
}

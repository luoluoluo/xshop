import { BusinessCard } from "@/components/business-card/business-card";
import { Empty } from "@/components/empty";
import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import { SectionTitle } from "@/components/section-title";
import { Wechat } from "@/components/wechat";
import { setting } from "@/config/config";
import { MerchantPagination } from "@/generated/graphql";
import { getMerchants } from "@/requests/merchant";
import { getUrl } from "@/utils/index.server";
import { getLogger } from "@/utils/logger";
import { request } from "@/utils/request.server";
import Link from "next/link";

export default async function Page() {
  const url = getUrl();
  const u = new URL(url);
  const merchants = await request<{ merchants: MerchantPagination }>({
    query: getMerchants
  }).then(res => {
    if (res.errors) {
      getLogger().error(res, "getMerchants error");
    }
    return res.data?.merchants.data;
  });
  // const merchant = merchants ? merchants[0] : undefined;

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container">
        <section className="space-y-6 pt-14 lg:pt-24" id="merchants">
          <SectionTitle title="全部商家" />
          {merchants?.length ? (
            <div
              className="grid animate-fade-up grid-cols-1 gap-4 lg:grid-cols-3 pb-16"
              style={{ animationDelay: "0.5s", animationFillMode: "both" }}
            >
              {merchants?.map((v, k) => {
                if (!v.name) return null;
                return (
                  <Link prefetch={false} key={k} href={`/merchant/${v.id}`}>
                    <BusinessCard key={k} merchant={v}></BusinessCard>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Empty title="暂无商家" className="min-h-[20rem]"></Empty>
          )}
        </section>
      </main>

      <SiteFooter className="mt-16 lg:lg-24" />
      <Wechat
        shareConfig={{
          title: setting.title,
          desc: setting.description,
          imgUrl: `${u.origin}/images/logo.png`
        }}
      />
    </div>
  );
}

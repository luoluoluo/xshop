import { BusinessCard } from "@/components/business-card/business-card";
import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import { ContentTabs } from "@/components/tabs/content-tabs";
import { Wechat } from "@/components/wechat";
import { setting } from "@/config/config";
import { GET_USER } from "@/requests/user.server";
import { getUrl } from "@/utils/index.server";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const url = getUrl();
  const u = new URL(url);
  const user = await GET_USER({ id: params.slug }).then(
    (res) => res.data?.user,
  );
  if (!user) {
    return notFound();
  }
  return {
    title: `${user.name} - ${user.title}`,
    description: user.description,
    openGraph: {
      title: `${user.name} - ${user.title}`,
      description: user.description,
      images: [user.avatar || `${u.origin}/images/logo.png`],
    },
  };
}

export default async function Page({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const url = getUrl();
  const u = new URL(url);
  const user = await GET_USER({ id: params.slug }).then(
    (res) => res.data?.user,
  );
  if (!user) {
    return notFound();
  }
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader
        logoAttributes={{
          name: user?.name || undefined,
          logo: user?.avatar || undefined,
          link: `/${params.slug}`,
        }}
      />
      <main className="flex overflow-hidden">
        <div className="container lg:flex lg:gap-8">
          <div className="w-full lg:w-[375px] flex-shrink-0 ">
            <BusinessCard user={user} className="mt-4 lg:mt-8" />
          </div>
          <div className=" w-full flex-shrink-1">
            <ContentTabs
              products={user.products || []}
              links={user.links || []}
            />
          </div>
        </div>
      </main>

      <SiteFooter className="mt-16 lg:lg-24" />
      <Wechat
        shareConfig={{
          title: `${user.title} - ${user.title}`,
          desc: user.description || setting.description,
          imgUrl: user.avatar || `${u.origin}/images/logo.png`,
        }}
      />
    </div>
  );
}

import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import { Wechat } from "@/components/wechat";
import { Article } from "@/generated/graphql";
import { getArticle } from "@/requests/article";
import { getLogger } from "@/utils/logger";
import { request } from "@/utils/request";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const article = await request<{ article: Article }>({
    query: getArticle,
    variables: { slug: params.slug },
  }).then((res) => {
    if (res.errors) {
      getLogger();
      return;
    }
    return res.data?.article;
  });
  return {
    title: article?.title || "",
    description: article?.description || "",
    openGraph: {
      title: article?.title || "",
      description: article?.description || "",
      images: article?.image
        ? [
            {
              url: article?.image,
              width: 960,
              height: 960,
              alt: article?.title || "",
            },
          ]
        : undefined,
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const article = await request<{ article: Article }>({
    query: getArticle,
    variables: { slug: params.slug },
  }).then((res) => {
    if (res.errors) {
      getLogger();
      return;
    }
    return res.data?.article;
  });
  return (
    <div className="relative flex min-h-screen flex-col">
      <img src={`${article?.image}?w=960&h=960`} className="hidden" />
      <SiteHeader />
      <main className="flex-1">
        <div className="container">
          <div className="mt-8 p-4 text-center font-bold text-xl">
            {article?.title}
          </div>
          <div
            className="mt-8 wysiwyg"
            dangerouslySetInnerHTML={{ __html: article?.content || "" }}
          ></div>
        </div>
      </main>
      <SiteFooter />
      <Wechat
        shareConfig={{
          title: article?.title || "",
          desc: article?.description || "",
          imgUrl: `${article?.image}?w=960&h=960`,
        }}
      />
    </div>
  );
}

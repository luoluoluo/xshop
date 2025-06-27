import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import { Wechat } from "@/components/wechat";
import { setting } from "@/config/config";
import { getUrl } from "@/utils/index.server";

export default async function Page() {
  const url = getUrl();
  console.log(url, "xxxurl");
  const u = new URL(url);

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container">
        <section className="flex max-w-full flex-col px-4 py-16 lg:py-24 mx-auto items-center gap-2 text-center">
          <h1
            className="font-bold tracking-tighter lg:leading-[1.1] text-2xl lg:text-5xl animate-fade-up"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            {setting.slogan}
          </h1>
          <p
            className="mt-4 text-balance text-muted-foreground text-base lg:text-lg max-w-full animate-fade-up"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            {setting.description}
          </p>
          <div
            className="flex w-full items-center justify-center space-x-4 py-4 animate-fade-up"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            <a
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              href={`/seller/1725463741028`}
            >
              我是商家
            </a>
            <a
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              href={`/seller/1725463741028`}
            >
              我是推广者
            </a>
          </div>
        </section>
        <section
          className="grid animate-fade-up grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-4"
          style={{ animationDelay: "0.5s", animationFillMode: "both" }}
        >
          {setting.features.map((v, k) => {
            return (
              <a href="/" key={k}>
                <div className="border bg-card text-card-foreground shadow h-full rounded-lg transition-colors hover:bg-muted/25">
                  <div className="flex flex-col space-y-1.5 p-6 flex-1">
                    <h3 className="font-semibold leading-tight tracking-tight capitalize">{v.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 text-balance">{v.description}</p>
                  </div>
                </div>
              </a>
            );
          })}
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

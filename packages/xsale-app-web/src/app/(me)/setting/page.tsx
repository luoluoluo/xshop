import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";

import { SettingForm } from "./_components/setting-form";

export function generateMetadata() {
  return {
    title: `设置`,
  };
}

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container my-20 lg:my-40 flex flex-col items-center gap-8">
        <div className="text-center text-2xl font-bold">设置</div>
        <SettingForm className="w-full lg:max-w-md" />
      </main>
      <SiteFooter />
    </div>
  );
}

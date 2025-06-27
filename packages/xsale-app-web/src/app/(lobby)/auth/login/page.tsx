import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";

import { LoginForm } from "./_components/login-form";
export async function generateMetadata() {
  return {
    title: `登录`
  };
}

export default async function Page() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container my-20 lg:my-40 flex flex-col items-center gap-8">
        <div className="text-center text-2xl font-bold">登录</div>
        <LoginForm className="w-full lg:max-w-md" />
      </main>
      <SiteFooter />
    </div>
  );
}

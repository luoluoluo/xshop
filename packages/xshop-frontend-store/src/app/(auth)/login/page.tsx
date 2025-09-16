import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";

import { LoginForm } from "./_components/login-form";

export function generateMetadata() {
  return {
    title: `登录`,
  };
}

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <LoginForm className="w-full lg:max-w-md" />
      <SiteFooter />
    </div>
  );
}

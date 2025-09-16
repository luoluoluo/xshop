import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";
import { checkToken } from "@/utils/auth.server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "小驴通 - 工作台",
  description: "小驴通 - 工作台",
};
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  checkToken();
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="container my-4">{children}</main>
      <SiteFooter />
    </div>
  );
}

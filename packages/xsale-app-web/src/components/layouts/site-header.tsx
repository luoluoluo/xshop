import { headerMenuItems, setting } from "@/config/config";
import Image from "next/image";
import Link from "next/link";
import { AuthDropdown } from "./auth-dropdown";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

export const Logo = async ({ className }: { className?: string }) => {
  return (
    <Link prefetch={false} href={"/"} className={`flex items-center flex-nowrap space-x-2 ${className}`}>
      <Image priority alt="" src={"/images/logo.png"} height="240" width="240" className="rounded object-cover w-6 h-6"></Image>
      <span className="whitespace-nowrap text-primary font-bold max-w-[50vw] lg:max-w-xs overflow-hidden text-ellipsis">
        {setting.name}
      </span>
      <span className="sr-only">Home</span>
    </Link>
  );
};
export async function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 w-full bg-background border-b">
      <div className="container flex h-14 lg:h-16 items-center justify-between w-full box-border">
        <div className="flex items-center">
          <MobileNav items={headerMenuItems} />
          <Logo className="flex justify-center lg:justify-start" />
          <MainNav items={headerMenuItems} />
        </div>
        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <AuthDropdown className="p-0" />
          </nav>
        </div>
      </div>
    </header>
  );
}

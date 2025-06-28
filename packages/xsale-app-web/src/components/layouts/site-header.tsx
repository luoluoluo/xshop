import { setting } from "@/config/config";
import Image from "next/image";
import Link from "next/link";
import { AuthDropdown } from "./auth-dropdown";

export const Logo = async ({ name, logo, className }: { name?: string; logo?: string; className?: string }) => {
  return (
    <Link prefetch={false} href={"/"} className={`flex items-center flex-nowrap space-x-2 ${className}`}>
      <img src={logo || "/images/logo.png"} className="rounded object-cover h-6 w-auto" />
      <span className="whitespace-nowrap text-primary font-bold max-w-[50vw] lg:max-w-xs overflow-hidden text-ellipsis">
        {name || setting.name}
      </span>
      <span className="sr-only">Home</span>
    </Link>
  );
};
export async function SiteHeader({ name, logo }: { name?: string; logo?: string }) {
  return (
    <header className="sticky top-0 z-20 w-full bg-background border-b">
      <div className="container flex h-14 lg:h-16 items-center justify-between w-full box-border">
        <div className="flex items-center">
          <Logo name={name} logo={logo} className="flex justify-center lg:justify-start" />
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

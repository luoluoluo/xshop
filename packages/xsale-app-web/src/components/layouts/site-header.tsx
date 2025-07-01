import { setting } from "@/config/config";
import { cn } from "@/utils";
import Link from "next/link";
import { AuthDropdown } from "./auth-dropdown";

export const Logo = ({
  link,
  name,
  logo,
  className,
}: {
  link?: string;
  name?: string;
  logo?: string;
  className?: string;
}) => {
  return (
    <Link
      prefetch={false}
      href={link || "/"}
      className={cn(
        "flex items-center flex-nowrap space-x-2 text-primary",
        className,
      )}
    >
      <img
        src={logo || "/images/logo.png"}
        className="rounded object-cover h-6 w-auto"
      />
      <span className="whitespace-nowrap font-bold max-w-[50vw] lg:max-w-xs overflow-hidden text-ellipsis">
        {name || setting.name}
      </span>
    </Link>
  );
};
export function SiteHeader({
  logoAttributes,
  theme = "default",
}: {
  logoAttributes?: { link?: string; name?: string; logo?: string };
  theme?: "default" | "product";
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 w-full border-b bg-background",
        theme === "product"
          ? "max-lg:bg-black/10 max-lg:fixed  max-lg:border-none"
          : "",
      )}
    >
      <div className="container flex h-14 lg:h-16 items-center justify-between w-full box-border">
        <div className="flex items-center">
          <Logo
            link={logoAttributes?.link}
            name={logoAttributes?.name}
            logo={logoAttributes?.logo}
            className={cn(
              "flex justify-center lg:justify-start",
              theme === "product" ? "max-lg:text-white" : "",
            )}
          />
        </div>
        <div className="flex items-center justify-end space-x-4">
          <AuthDropdown
            className={cn(theme === "product" ? "bg-transparent" : "")}
          />
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";

import { Shell } from "@/components/shell";
import { footerMenuItems, setting } from "@/config/config";

import { cn } from "@/utils";
import Image from "next/image";

export function SiteFooter({
  className,
  theme = "default",
}: {
  className?: string;
  theme?: "default" | "home";
}) {
  return (
    <footer
      className={cn(
        "w-full bg-background mt-8",
        theme === "home" ? "border-t" : "",
        className,
      )}
    >
      {theme === "home" ? (
        <Shell>
          <div
            id="footer-links"
            aria-labelledby="footer-links-heading"
            className="grid flex-1 grid-cols-1 gap-10 lg:grid-cols-3"
          >
            <div className="space-y-3">
              <Link
                prefetch={false}
                href={`/`}
                className="flex flex-nowrap space-x-2"
              >
                <Image
                  priority
                  alt=""
                  src="/images/logo.png"
                  height="24"
                  width="24"
                  className="rounded object-cover w-6 h-6"
                ></Image>
                <span className="whitespace-nowrap text-primary font-bold max-w-[50vw] lg:max-w-xs overflow-hidden text-ellipsis">
                  {setting.name}
                </span>
                <span className="sr-only">Home</span>
              </Link>
              <div className="text-balance text-muted-foreground">
                {setting.slogan}
              </div>
            </div>
            {footerMenuItems.map((item) => (
              <div key={item.title} className="space-y-3">
                <h4 className="text-base font-medium">{item.title}</h4>
                <ul className="space-y-2.5">
                  {item.items.map((link) => (
                    <li key={link.title}>
                      <Link
                        prefetch={false}
                        href={link.href}
                        rel={link?.external ? "noreferrer" : undefined}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.title}
                        <span className="sr-only">{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="space-y-3">
              <h4 className="text-base font-medium">微信公众号</h4>
              <Image
                priority
                width={200}
                height={200}
                src="/images/qrcode-mp.jpg"
                alt="微信公众号"
                className="w-40 h-40 border"
              />
            </div>
          </div>
        </Shell>
      ) : null}
      <div className="flex flex-col lg:flex-row p-4 box-border w-full justify-center text-gray-400 text-sm gap-2">
        <div className="text-center">
          沪ICP备19045011号-1 Copyright © 2024 xltzx.com
        </div>
      </div>
    </footer>
  );
}

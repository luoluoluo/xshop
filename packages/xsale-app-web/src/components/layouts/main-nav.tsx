"use client";

import type { HeaderItem } from "@/types";
import Link from "next/link";
import * as React from "react";

import { Icons } from "@/components/icons";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/utils";

interface MainNavProps {
  items?: HeaderItem[];
}

export function MainNav({ items }: MainNavProps) {
  return (
    <>
      <div className="hidden flex-1 lg:flex justify-center items-center gap-6 ml-12">
        {items?.map((v, k) => (
          <div key={k} className="group relative">
            <div className=" relative cursor-pointer">
              <div className="flex items-center gap-1 flex-nowrap">
                <Link href={v.href || "/"} className=" whitespace-nowrap">
                  {v.title}
                </Link>
                {v.items && v.items.length ? (
                  <Icons.arrow className="w-2 group-hover:rotate-180 transition-transform ease-in-out duration-200" />
                ) : null}
              </div>
              <div className=" absolute h-[2px] w-0 group-hover:w-[100%] bg-white mt-1 transition-[width] ease-in-out duration-200"></div>
            </div>
            {v.items && v.items.length ? (
              <div className="absolute -left-2 top-[1.5rem] hidden opacity-0 group-hover:opacity-100  group-hover:block bg-transparent text-gray-500 translate-y-4 group-hover:translate-y-0 transition-all ease-in-out duration-300">
                <div
                  className="flex flex-col p-4 mt-[1.25rem] bg-white min-w-[200px]"
                  style={{ boxShadow: "0 5px 15px #00000012" }}
                >
                  {v.items.map((vv, kk) => (
                    <Link
                      href={vv.href || "/"}
                      key={kk}
                      className=" cursor-pointer p-2 flex-shrink-0 whitespace-nowrap hover:bg-slate-100"
                    >
                      {vv.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={String(href)}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

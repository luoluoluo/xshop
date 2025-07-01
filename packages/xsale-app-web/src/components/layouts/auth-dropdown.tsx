"use client";
import { DashboardIcon, ExitIcon, GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils";
import { getLoginUrl, getMe, logout } from "@/utils/auth.client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const MeButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <Icons.person className=" w-5 h-5" />
    </Button>
  );
};

export function AuthDropdown({ className }: { className?: string }) {
  const me = getMe();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  const router = useRouter();
  if (!loaded) return null;
  return (
    <div>
      {me ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={cn("flex-shrink-0", className)}>
              <MeButton />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <p className="font-medium leading-none overflow-hidden text-ellipsis whitespace-nowrap">
                你好，{me.name || me.phone}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link prefetch={false} href={`/order`}>
                  <DashboardIcon className="mr-2 w-4" aria-hidden="true" />
                  我的订单
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link prefetch={false} href={`/setting`}>
                  <GearIcon className="mr-2 size-4" aria-hidden="true" />
                  设置
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                prefetch={false}
                href="#"
                onClick={() => {
                  logout();
                }}
              >
                <ExitIcon className="mr-2 size-4" aria-hidden="true" />
                退出
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <MeButton
          onClick={() => {
            router.push(getLoginUrl());
          }}
        />
      )}
    </div>
  );
}

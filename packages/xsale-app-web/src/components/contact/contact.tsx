"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Merchant } from "@/generated/graphql";
import { cn } from "@/utils";
import { DialogDescription } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useState } from "react";
import { Clipboard } from "../clipboard";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

export const Contact = ({
  merchant,
  children,
  className
}: {
  merchant: Merchant;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open ? <div className=" fixed inset-0 bg-black/50 z-20" onClick={() => setOpen(false)}></div> : null}
      <Dialog modal={false} open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children ? (
            children
          ) : (
            <div
              className={cn(
                " fixed right-4 lg:right-12 bottom-24 flex flex-col justify-center items-center z-10  cursor-pointer",
                className
              )}
            >
              <Image
                src={merchant.logo ? merchant.logo : "/images/logo.png"}
                alt={merchant.name || ""}
                width={200}
                height={200}
                className="w-12 h-12 object-cover rounded-full bg-white border shadow"
              />
              <Button variant="outline" className="h-auto px-2 py-1 -mt-[2px] shadow text-xs">
                立即联系
              </Button>
            </div>
          )}
        </DialogTrigger>
        <DialogContent onInteractOutside={e => e.preventDefault()} onOpenAutoFocus={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>联系方式</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-end pt-2 mt-2 text-gray-700 gap-2 border-t">
            {merchant.affiliate?.phone ? (
              <Clipboard
                value={merchant.affiliate?.phone}
                onSuccess={() => {
                  toast({ title: "手机号复制成功" });
                }}
              >
                <div className="flex items-center">
                  <Icons.phone className="w-4 h-4" /> <div className="ml-1">{merchant.affiliate?.phone}</div>
                  <div className="px-1 py-[1px] text-xs bg-primary text-white rounded ml-2 h-auto">复制</div>
                </div>
              </Clipboard>
            ) : null}
            {merchant?.address ? (
              <Clipboard
                value={merchant.address}
                onSuccess={() => {
                  toast({ title: "地址复制成功" });
                }}
              >
                <div className="flex items-center">
                  <Icons.location className="w-4 h-4" /> <div className="ml-1">{merchant.address}</div>
                  <div className="px-1 py-[1px] text-xs bg-primary text-white rounded ml-2 h-auto">复制</div>
                </div>
              </Clipboard>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

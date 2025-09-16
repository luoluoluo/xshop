"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/generated/graphql";
import { cn } from "@/utils";
import { getChannel } from "@/utils/index.client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Clipboard } from "../clipboard";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

export const Contact = ({
  user,
  children,
  className,
  initialOpen,
}: {
  user?: User;
  children?: React.ReactNode;
  className?: string;
  initialOpen?: boolean;
}) => {
  const [channel, setChannel] = useState("");
  const [open, setOpen] = useState(initialOpen ?? false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChannel(getChannel());
  }, []);

  // 初始化位置为右下角
  useEffect(() => {
    if (position === null) {
      const updatePosition = () => {
        const rightOffset = window.innerWidth < 1024 ? 16 : 48; // right-4 lg:right-12
        const bottomOffset = 96; // bottom-24 (24 * 4px = 96px)
        setPosition({
          x: window.innerWidth - rightOffset - 60, // 60px 是按钮的大致宽度
          y: window.innerHeight - bottomOffset - 60, // 60px 是按钮的大致高度
        });
      };

      updatePosition();
      window.addEventListener("resize", updatePosition);
      return () => window.removeEventListener("resize", updatePosition);
    }
  }, [position]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!dragRef.current || !position) return;

    const rect = dragRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;

    e.preventDefault(); // 防止页面滚动
    const touch = e.touches[0];
    const newX = touch.clientX - dragOffset.x;
    const newY = touch.clientY - dragOffset.y;

    // 限制在视窗范围内
    const maxX = window.innerWidth - 60; // 60px 是按钮宽度
    const maxY = window.innerHeight - 60; // 60px 是按钮高度

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 添加全局触摸事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, dragOffset]);

  if (!position) {
    return null;
  }

  return (
    <>
      {open ? (
        <div
          className=" fixed inset-0 bg-black/50 z-20"
          onClick={() => setOpen(false)}
        ></div>
      ) : null}
      <Dialog modal={false} open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children ? (
            children
          ) : (
            <div
              ref={dragRef}
              onTouchStart={handleTouchStart}
              className={cn(
                "fixed flex flex-col justify-center items-center z-10 select-none",
                className,
              )}
              style={{
                left: position?.x ?? 0,
                top: position?.y ?? 0,
              }}
            >
              <Image
                src={user?.avatar ? user.avatar : "/images/logo.png"}
                alt={user?.name || ""}
                width={200}
                height={200}
                className="w-12 h-12 object-contain rounded-full bg-white border shadow"
              />
              <Button
                variant="outline"
                className="h-auto px-2 py-1 -mt-[2px] shadow text-xs"
              >
                立即联系
              </Button>
            </div>
          )}
        </DialogTrigger>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>联系方式</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col justify-end pt-2 mt-2 text-gray-700 gap-2 border-t">
            {user?.phone ? (
              <Clipboard
                value={user?.phone}
                onSuccess={() => {
                  toast({ title: "手机号复制成功" });
                }}
              >
                <div className="flex items-baseline">
                  <Icons.phone className="w-4 h-4" />{" "}
                  <div className="ml-1 text-left">{user?.phone}</div>
                  <div className="px-1 py-[1px] text-xs bg-primary text-white rounded ml-2 h-auto">
                    复制
                  </div>
                </div>
              </Clipboard>
            ) : null}
            {user?.email ? (
              <Clipboard
                value={user?.email}
                onSuccess={() => {
                  toast({ title: "邮箱复制成功" });
                }}
              >
                <div className="flex items-baseline">
                  <Icons.email className="w-4 h-4" />{" "}
                  <div className="ml-1 text-left">{user?.email}</div>
                  <div className="px-1 py-[1px] text-xs bg-primary text-white rounded ml-2 h-auto">
                    复制
                  </div>
                </div>
              </Clipboard>
            ) : null}
            {user?.wechatId ? (
              <Clipboard
                value={user?.wechatId}
                onSuccess={() => {
                  toast({ title: "微信号复制成功" });
                }}
              >
                <div className="flex items-baseline">
                  <Icons.wechat className="w-4 h-4" />{" "}
                  <div className="ml-1 text-left">{user?.wechatId}</div>
                  <div className="px-1 py-[1px] text-xs bg-primary text-white rounded ml-2 h-auto">
                    复制
                  </div>
                </div>
              </Clipboard>
            ) : null}
            {user?.slug ? (
              <Clipboard
                value={`https://xltzx.com/${user?.slug}`}
                onSuccess={() => {
                  toast({ title: "网址复制成功" });
                }}
              >
                <div className="flex items-baseline">
                  <Icons.externalLink className="w-4 h-4" />{" "}
                  <div className="ml-1 text-left">{user?.slug}</div>
                  <div className="px-1 py-[1px] text-xs bg-primary text-white rounded ml-2 h-auto">
                    复制
                  </div>
                </div>
              </Clipboard>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

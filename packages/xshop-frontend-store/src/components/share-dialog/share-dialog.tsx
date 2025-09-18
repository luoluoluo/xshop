"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import NextImage from "next/image";
import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { getLoginUrl } from "@/utils/auth.client";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posterUrl?: string;
  userName?: string;
  posterTitle?: string;
  commission?: number;
}

export const ShareDialog = ({
  open,
  onOpenChange,
  posterUrl,
  posterTitle,
  userName,
  commission,
}: ShareDialogProps) => {
  const { me } = useAuth();
  const [shareType, setShareType] = useState<
    "friend" | "moments" | "poster" | null
  >(null);

  const handleShareToFriend = () => {
    setShareType("friend");
  };

  const handleShareToMoments = () => {
    setShareType("moments");
  };

  const handleSharePoster = () => {
    setShareType("poster");
  };

  const handleClose = () => {
    setShareType(null);
    onOpenChange(false);
  };

  const renderShareOptions = () => (
    <div className="space-y-4">
      <div className="text-center text-lg font-medium">分享名片</div>
      <div className="grid grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-20"
          onClick={handleShareToFriend}
        >
          <Icons.messageCircle className="w-6 h-6" />
          <span className="text-sm">好友</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-20"
          onClick={handleShareToMoments}
        >
          <Icons.users className="w-6 h-6" />
          <span className="text-sm">朋友圈</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-20"
          onClick={handleSharePoster}
        >
          <Icons.image className="w-6 h-6" />
          <span className="text-sm">{posterTitle || "海报"}</span>
        </Button>
      </div>
    </div>
  );

  const renderShareGuide = () => (
    <div className="space-y-4 text-center">
      <div className="text-lg font-medium">
        {shareType === "friend" ? "分享给好友" : "分享到朋友圈"}
      </div>
      <div className="space-y-2">
        <div className="text-sm text-gray-600">
          请点击右上角 <span className="font-bold">...</span> 按钮
        </div>
        <div className="text-sm text-gray-600">
          选择 {shareType === "friend" ? "发送给朋友" : "分享到朋友圈"}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icons.moreHorizontal className="w-8 h-8 text-gray-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">...</span>
          </div>
        </div>
      </div>
      <Button onClick={() => setShareType(null)} className="w-full">
        返回
      </Button>
    </div>
  );

  const renderPoster = () => (
    <div className="space-y-4">
      <div className="text-center text-lg font-medium">长按保存名片</div>
      {posterUrl ? (
        <div className="relative">
          <NextImage
            src={posterUrl}
            width={400}
            height={400}
            alt={`${userName}的名片`}
            className="w-full h-auto rounded-lg"
          />
        </div>
      ) : (
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">名片生成中...</span>
        </div>
      )}
      <Button onClick={() => setShareType(null)} className="w-full">
        返回
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">分享名片</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {!shareType && renderShareOptions()}
          {shareType === "friend" && renderShareGuide()}
          {shareType === "moments" && renderShareGuide()}
          {shareType === "poster" && renderPoster()}
        </div>
        <div className="text-sm text-gray-500">
          {!me?.id ? (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = getLoginUrl();
              }}
              className="text-blue-500 underline"
              target="_blank"
            >
              登录后，
            </a>
          ) : null}
          <span>通过您分享的链接产生的订单，您均可获得</span>
          <span className="font-bold text-red-500 mx-1 text-base">
            {commission ? `¥${commission}` : "5%~30%"}
          </span>
          <span>的佣金，佣金将在订单完成后自动转入您的微信零钱。</span>
          <span>
            查看
            <a href={`/order?type=aff`} className="text-blue-500 underline">
              推广订单
            </a>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

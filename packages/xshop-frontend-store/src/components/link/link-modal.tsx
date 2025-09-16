"use client";

import { Link as LinkType } from "@/generated/graphql";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clipboard } from "@/components/clipboard";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";

interface LinkModalProps {
  link: LinkType;
  isOpen: boolean;
  onClose: () => void;
}

export const LinkModal = ({ link, isOpen, onClose }: LinkModalProps) => {
  const handleVisitLink = () => {
    if (link.url) {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {link.name || "链接详情"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          {link.logo && (
            <div className="w-20 h-20 flex items-center justify-center">
              <Image
                width={80}
                height={80}
                src={link.logo}
                alt={link.name || "链接"}
                className="w-full h-full object-cover object-center rounded-lg"
              />
            </div>
          )}

          {/* QR Code */}
          {link.qrcode && (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-48 h-48 flex items-center justify-center bg-white border rounded-lg p-4">
                <Image
                  width={192}
                  height={192}
                  src={link.qrcode}
                  alt="二维码"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-sm text-gray-600 text-center">长按保存图片</p>
            </div>
          )}

          {/* URL Display */}
          {link.url && (
            <div className="w-full">
              <div className="text-sm text-gray-600 mb-2">链接地址：</div>
              <div className="bg-gray-50 p-3 rounded-lg break-all text-sm">
                {link.url}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            {link.url && (
              <Clipboard
                asChild
                value={link.url}
                onSuccess={() => {
                  toast({ title: "链接复制成功" });
                }}
              >
                <Button variant="outline" className="flex-1">
                  <Icons.copy className="w-4 h-4 mr-2" />
                  复制链接
                </Button>
              </Clipboard>
            )}

            {link.url && (
              <Button onClick={handleVisitLink} className="flex-1">
                <Icons.externalLink className="w-4 h-4 mr-2" />
                访问链接
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

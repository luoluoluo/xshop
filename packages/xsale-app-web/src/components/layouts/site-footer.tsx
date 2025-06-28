import { cn } from "@/utils";

export async function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("w-full border-t bg-background mt-8", className)}>
      <div className="flex flex-col lg:flex-row p-4 box-border w-full justify-center text-gray-400 text-sm gap-2">
        <div className="text-center">沪ICP备19045011号-1 Copyright © 2024 xltzx.com</div>
      </div>
    </footer>
  );
}

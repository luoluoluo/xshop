import { cn } from "@/utils";
import { Loader } from "lucide-react";
export function Loading({ className }: { className?: string }) {
  return (
    <div className={cn(`w-full h-[100vh] flex justify-center items-center`, className)}>
      <Loader className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
}

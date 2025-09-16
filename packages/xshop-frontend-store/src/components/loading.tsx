import { cn } from "@/utils";
import { Loader } from "lucide-react";
export function Loading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        `w-full h-[100vh] flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-black/20 z-50`,
        className,
      )}
    >
      <Loader className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
}

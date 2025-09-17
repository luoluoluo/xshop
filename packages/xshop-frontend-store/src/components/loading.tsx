import { cn } from "@/utils";
import { Loader } from "lucide-react";
export function Loading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        `flex justify-center items-center min-h-[50vh] w-full`,
        className,
      )}
    >
      <Loader className="w-10 h-10 animate-spin" />
    </div>
  );
}

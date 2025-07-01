import { cn } from "@/utils";
import { Icons } from "./icons";

export const Empty = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col py-4 justify-center items-center min-h-[4rem] text-gray-500",
        className,
      )}
    >
      <Icons.empty className="w-16"></Icons.empty>
      <div className="mt-4">{title}</div>
    </div>
  );
};

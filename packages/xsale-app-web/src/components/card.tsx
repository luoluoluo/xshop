"use client";
import { cn } from "@/utils";
import { useRouter } from "next/navigation";

export const CardMeta = ({
  name,
  value,
  children,
  onClick,
  link
}: {
  name: string;
  value?: string | React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  link?: string;
}) => {
  const router = useRouter();
  return (
    <div className="flex cursor-pointer" onClick={onClick}>
      <div className="w-20 flex-shrink-0 text-gray-500">{name}</div>
      <div
        className={cn("select-text whitespace-pre-wrap", link ? "text-muted-foreground" : "")}
        onClick={() => {
          link && router.push(link);
        }}
      >
        {value}
      </div>
      {children}
    </div>
  );
};

export const CardFooter = ({ actions }: { actions: React.ReactNode[] }) => {
  if (!actions.length) return null;
  return (
    <div className="flex w-full gap-4 border-t justify-end items-center py-4">
      {actions.map((v, k) => (
        <div key={k}>{v}</div>
      ))}
    </div>
  );
};

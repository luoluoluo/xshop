"use client";
import { cn } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

const GROUP_MAX = 2;
const half = Math.ceil(GROUP_MAX / 2);

export const Pagination = (props: { page: number; size: number; count: number; className?: string }) => {
  const { page, size, count } = props;

  const totalPage = Math.ceil(count / size);

  const onChange = (page: number) => {
    const u = new URL(window.location.href);
    u.searchParams.set("page", `${page}`);
    window.location.href = u.toString();
  };

  const getButton = (current: number) => (
    <Button key={current} variant={`${page === current ? "secondary" : "ghost"}`} onClick={() => onChange(current)}>
      {current}
    </Button>
  );

  return (
    <div className={cn("mx-auto w-full flex flex-row justify-center gap-2", props.className)}>
      {totalPage > 1 && (
        <Button variant="ghost" disabled={page === 1} onClick={() => page > 1 && onChange(page - 1)}>
          <ChevronLeft />
        </Button>
      )}

      {totalPage <= GROUP_MAX + 2 ? (
        Array(totalPage)
          .fill(0)
          .map((_, index) => getButton(index + 1))
      ) : (
        <>
          {getButton(1)}
          {page > 1 + half && <span className=" leading-10">...</span>}
          {Array(GROUP_MAX)
            .fill(0)
            .map((_, index) => {
              const p = page - half + index + 1;
              return p > 1 && p < totalPage ? getButton(p) : "";
            })}
          {page < totalPage - half && <span className=" leading-10">...</span>}
          {getButton(totalPage)}
        </>
      )}

      {totalPage > 1 && (
        <Button variant="ghost" disabled={page === totalPage} onClick={() => page < totalPage && onChange(page + 1)}>
          <ChevronRight />
        </Button>
      )}
    </div>
  );
};

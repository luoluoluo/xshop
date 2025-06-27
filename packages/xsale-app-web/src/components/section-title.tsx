import { cn } from "@/utils";

export const SectionTitle = ({ title, className }: { title: string; className?: string }) => {
  return (
    <div className={cn("w-full flex items-center justify-center relative h-[2.5rem]", className)}>
      <div className=" -z-10 absolute bg-primary h-[2px] w-full" />
      <div className=" absolute flex items-center justify-center text-white font-bold bg-primary w-[40%] lg:w-[30%] h-[2.5rem] rounded">
        {title}
      </div>
    </div>
  );
};

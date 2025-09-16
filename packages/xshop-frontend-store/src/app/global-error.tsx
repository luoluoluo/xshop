"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="p-4 flex flex-col items-center w-full box-border">
      <div className="text-lg">加载错误</div>
      <div className="p-4">{`layout error: ${error.message}`}</div>
      <Button
        className="mt-8"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        重试
      </Button>
    </div>
  );
}

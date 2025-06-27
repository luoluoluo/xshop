"use client";

import { cn } from "@/utils";
import ClipboardJS from "clipboard";
import React, { useEffect, useRef } from "react";

const Clipboard = React.forwardRef(
  (
    {
      value,
      children,
      className,
      style,
      onSuccess,
      asChild
    }: {
      value: string;
      children: React.ReactNode;
      className?: string;
      style?: React.CSSProperties;
      onSuccess?: () => void;
      asChild?: boolean;
    },
    ref
  ) => {
    const copyRef = useRef<any>(ref);
    useEffect(() => {
      let clipboard: any;
      if (copyRef.current) {
        clipboard = new ClipboardJS(copyRef.current, {
          text: () => value,
          container: document.body
        });
        clipboard.on("success", function () {
          onSuccess && onSuccess();
        });
      }
      return () => clipboard?.destroy && clipboard.destroy();
    }, [copyRef, value, onSuccess]);

    return (
      <>
        {asChild ? (
          React.cloneElement(children as React.ReactElement, {
            ref: copyRef,
            "data-clipboard-text": value
          })
        ) : (
          <button className={cn("p-0 m-0 cursor-pointer", className)} style={style} ref={copyRef} data-clipboard-text={value}>
            {children}
          </button>
        )}
      </>
    );
  }
);
Clipboard.displayName = "Clipboard";
export { Clipboard };

"use client";

import { useAuth } from "@/contexts/auth";
import { useState, useEffect } from "react";

export const CreatorButton = () => {
  const { me } = useAuth();
  const [buttonText, setButtonText] = useState<string>();
  useEffect(() => {
    if (me && me.id !== me.slug) {
      setButtonText("管理我的主页");
    } else {
      setButtonText("创建我的主页");
    }
  }, [me]);

  if (!buttonText) {
    return null;
  }

  return (
    <a
      href="/creator"
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
    >
      {buttonText}
    </a>
  );
};

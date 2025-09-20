"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import { trackView } from "@/requests/analytics.client";
import { getLogger } from "@/utils/logger";

export function PageTracker() {
  const pathname = usePathname();
  const { me } = useAuth();
  const logger = getLogger();

  useEffect(() => {
    const trackPageView = () => {
      void (async () => {
        try {
          // 构建完整的页面 URL
          const pageUrl = `${window.location.origin}${pathname}`;

          // 准备跟踪数据
          const trackData = {
            pageUrl,
            userId: me?.id, // 如果用户已登录，传递用户 ID
          };

          logger.debug("Tracking page view:", { pageUrl, userId: me?.id });

          // 调用跟踪接口
          await trackView(trackData);

          logger.debug("Page view tracked successfully");
        } catch (error) {
          // 静默处理错误，不影响用户体验
          logger.error("Failed to track page view:", error);
        }
      })();
    };

    // 延迟执行，确保页面完全加载
    const timeoutId = setTimeout(trackPageView, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname, me?.id, logger]);

  // 这个组件不渲染任何内容
  return null;
}

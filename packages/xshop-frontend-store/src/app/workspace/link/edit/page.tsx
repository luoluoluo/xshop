"use client";

import React, { useState, useEffect } from "react";
import { message, Spin, Breadcrumb } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { LinkForm } from "../_components/link-form";
import { getLink } from "@/requests/link.client";
import { Link as LinkType } from "@/generated/graphql";
import Link from "next/link";

export default function LinkEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const linkId = searchParams.get("id");

  const [link, setLink] = useState<LinkType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (linkId) {
      fetchLink();
    } else {
      message.error("缺少链接ID参数");
      router.push("/workspace/link");
    }
  }, [linkId]);

  const fetchLink = async () => {
    if (!linkId) return;

    setLoading(true);
    try {
      const response = await getLink({ id: linkId });
      if (response.data?.link) {
        setLink(response.data.link);
      } else {
        message.error("链接不存在");
        router.push("/workspace/link");
      }
    } catch (error) {
      message.error("获取链接信息失败");
      console.error("Error fetching link:", error);
      router.push("/workspace/link");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    message.success("链接更新成功");
    router.push("/workspace/link");
  };

  const handleCancel = () => {
    router.push("/workspace/link");
  };

  return (
    <Spin spinning={loading || !link}>
      <Breadcrumb className="!mb-4">
        <Breadcrumb.Item>
          <Link href="/workspace">工作台</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/workspace/link">链接列表</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>编辑链接</Breadcrumb.Item>
      </Breadcrumb>
      <LinkForm link={link} onSuccess={handleSuccess} onCancel={handleCancel} />
    </Spin>
  );
}

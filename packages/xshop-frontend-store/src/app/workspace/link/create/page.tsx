"use client";

import React from "react";
import { message, Breadcrumb } from "antd";
import { useRouter } from "next/navigation";
import { LinkForm } from "../_components/link-form";
import Link from "next/link";

export default function LinkCreatePage() {
  const router = useRouter();

  const handleSuccess = () => {
    message.success("链接创建成功");
    router.push("/workspace/link");
  };

  const handleCancel = () => {
    router.push("/workspace/link");
  };

  return (
    <>
      <Breadcrumb className="!mb-4">
        <Breadcrumb.Item>
          <Link href="/workspace">工作台</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/workspace/link">链接列表</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>新增链接</Breadcrumb.Item>
      </Breadcrumb>
      <LinkForm link={null} onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
}

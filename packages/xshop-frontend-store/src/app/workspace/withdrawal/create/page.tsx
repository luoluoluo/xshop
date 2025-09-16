"use client";

import React from "react";
import { message, Breadcrumb } from "antd";
import { useRouter } from "next/navigation";
import { WithdrawalForm } from "../_components/withdrawal-form";
import Link from "next/link";

export default function WithdrawalCreatePage() {
  const router = useRouter();

  const handleSuccess = () => {
    message.success("提现申请已提交");
    router.push("/workspace/withdrawal");
  };

  const handleCancel = () => {
    router.push("/workspace/withdrawal");
  };

  return (
    <>
      <Breadcrumb className="!mb-4">
        <Breadcrumb.Item>
          <Link href="/workspace">工作台</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/workspace/withdrawal">提现管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>申请提现</Breadcrumb.Item>
      </Breadcrumb>
      <WithdrawalForm
        withdrawal={null}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </>
  );
}

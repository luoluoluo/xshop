"use client";

import React from "react";
import { message, Breadcrumb } from "antd";
import { useRouter } from "next/navigation";
import { ProductForm } from "../_components/product-form";
import Link from "next/link";

export default function ProductCreatePage() {
  const router = useRouter();

  const handleSuccess = () => {
    message.success("商品创建成功");
    router.push("/workspace/product");
  };

  const handleCancel = () => {
    router.push("/workspace/product");
  };

  return (
    <>
      <Breadcrumb className="!mb-4">
        <Breadcrumb.Item>
          <Link href="/workspace">工作台</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/workspace/product">商品列表</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>新增商品</Breadcrumb.Item>
      </Breadcrumb>
      <ProductForm
        product={null}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </>
  );
}

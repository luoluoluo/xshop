"use client";

import React, { useState, useEffect } from "react";
import { message, Spin, Breadcrumb } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductForm } from "../_components/product-form";
import { getProduct } from "@/requests/product.client";
import { Product } from "@/generated/graphql";
import Link from "next/link";

export default function ProductEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      message.error("缺少产品ID参数");
      router.push("/workspace/product");
    }
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;

    setLoading(true);
    try {
      const response = await getProduct({ id: productId });
      if (response.data?.product) {
        setProduct(response.data.product);
      } else {
        message.error("产品不存在");
        router.push("/workspace/product");
      }
    } catch (error) {
      message.error("获取产品信息失败");
      console.error("Error fetching product:", error);
      router.push("/workspace/product");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    message.success("商品更新成功");
    router.push("/workspace/product");
  };

  const handleCancel = () => {
    router.push("/workspace/product");
  };

  return (
    <Spin spinning={loading || !product}>
      <Breadcrumb className="!mb-4">
        <Breadcrumb.Item>
          <Link href="/workspace">工作台</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/workspace/product">商品列表</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>编辑商品</Breadcrumb.Item>
      </Breadcrumb>
      <ProductForm
        product={product}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Spin>
  );
}

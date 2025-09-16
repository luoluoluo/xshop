"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  message,
  Spin,
  Descriptions,
  Tag,
  Image,
  Space,
  Row,
  Col,
  Breadcrumb,
} from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { getProduct } from "@/requests/product.client";
import { Product } from "@/generated/graphql";
import dayjs from "dayjs";
import { Loading } from "@/components/loading";
import Link from "next/link";

interface ProductResponse {
  product: Product;
}

export default function ProductShowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      void fetchProduct();
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
      if (response.data) {
        const data = response.data as ProductResponse;
        setProduct(data.product);
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

  if (!product) {
    return <div>产品不存在</div>;
  }

  return (
    <div>
      <Breadcrumb className="!mb-4">
        <Breadcrumb.Item>
          <Link href="/workspace">工作台</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/workspace/product">商品列表</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>商品详情</Breadcrumb.Item>
      </Breadcrumb>
      <Card title="商品信息" size="small" loading={loading}>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="商品图片">
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                <Image.PreviewGroup>
                  {product.images.map((image, index) => (
                    <Image key={index} src={image} width={100} height={100} />
                  ))}
                </Image.PreviewGroup>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">暂无图片</div>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="商品ID">{product.id}</Descriptions.Item>
          <Descriptions.Item label="商品标题">
            {product.title}
          </Descriptions.Item>
          <Descriptions.Item label="商品描述">
            {product.description || "暂无描述"}
          </Descriptions.Item>
          <Descriptions.Item label="价格">¥{product.price}</Descriptions.Item>
          <Descriptions.Item label="佣金">
            ¥{product.commission}
          </Descriptions.Item>
          <Descriptions.Item label="库存">{product.stock}</Descriptions.Item>
          <Descriptions.Item label="排序">
            {product.sort || 0}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={product.isActive ? "green" : "red"}>
              {product.isActive ? "上架" : "下架"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {dayjs(product.createdAt as string).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}

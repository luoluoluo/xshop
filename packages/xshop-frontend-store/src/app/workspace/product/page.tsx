"use client";

import React, { useState, useEffect } from "react";
import { List, Card, Button, Tag, Popconfirm, message, Breadcrumb } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { getProducts, deleteProduct } from "@/requests/product.client";
import {
  Product,
  ProductPagination,
  ProductWhereInput,
} from "@/generated/graphql";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [productPagination, setProductPagination] =
    useState<ProductPagination>();

  const [productVariables, setProductVariables] = useState<{
    where?: ProductWhereInput;
    skip?: number;
    take?: number;
  }>({
    skip: 0,
    take: 10,
  });

  // 获取产品列表
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts(productVariables);

      if (response.data) {
        setProductPagination(response.data.products);
      }
    } catch (error) {
      message.error("获取产品列表失败");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    void fetchProducts();
  }, [productVariables]);

  // 删除产品
  const handleDelete = async (id: string) => {
    try {
      await deleteProduct({ id });
      void fetchProducts();
      message.success("删除成功");
    } catch (error) {
      message.error("删除失败");
      console.error("Error deleting product:", error);
    }
  };

  // 新增产品
  const handleAdd = () => {
    router.push("/workspace/product/create");
  };

  // 编辑产品
  const handleEdit = (product: Product) => {
    router.push(`/workspace/product/edit?id=${product.id}`);
  };

  const handleView = (product: Product) => {
    router.push(`/workspace/product/show?id=${product.id}`);
  };

  return (
    <>
      <Breadcrumb className="!mb-4">
        <Breadcrumb.Item>
          <Link href="/workspace">工作台</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>商品列表</Breadcrumb.Item>
      </Breadcrumb>
      <Button
        className="w-full"
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
      >
        新增商品
      </Button>
      <List
        loading={loading || !productPagination}
        className="!mt-4"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          total: productPagination?.total,
          pageSize: productVariables.take ?? 10,
          current:
            (productVariables.skip ?? 0) / (productVariables.take ?? 10) + 1,
          onChange: (page, pageSize) => {
            setProductVariables({
              ...productVariables,
              skip: (page - 1) * pageSize,
              take: pageSize,
            });
          },
        }}
        dataSource={productPagination?.data}
        renderItem={(product) => (
          <List.Item>
            <Card
              key={product.id}
              actions={[
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  color="green"
                  onClick={() => handleView(product)}
                >
                  详情
                </Button>,
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(product)}
                >
                  编辑
                </Button>,
                <Popconfirm
                  title="确定删除吗？"
                  onConfirm={() => void handleDelete(product.id)}
                >
                  <Button danger type="link" icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>,
              ]}
            >
              <Card.Meta
                title={
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium truncate">
                      {product.title}
                    </span>
                    <Tag color={product.isActive ? "green" : "red"}>
                      {product.isActive ? "上架" : "下架"}
                    </Tag>
                  </div>
                }
                description={
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">
                      价格: ¥{product.price}
                    </div>
                    <div className="text-xs text-gray-500">
                      库存: {product.stock}
                    </div>
                    <div className="text-xs text-gray-500">
                      佣金: ¥{product.commission}
                    </div>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
}

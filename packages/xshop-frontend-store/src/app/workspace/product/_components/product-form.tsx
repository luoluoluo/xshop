"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Space,
  message,
  Row,
  Col,
} from "antd";
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "@/generated/graphql";
import { createProduct, updateProduct } from "@/requests/product.client";
import { CustomUpload } from "@/components/custom-upload";

const { TextArea } = Input;

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  }, [product, form]);

  const handleSubmit = async (
    values: CreateProductInput | UpdateProductInput,
  ) => {
    setLoading(true);
    try {
      if (isEdit) {
        const res = await updateProduct({
          id: product.id,
          data: values as UpdateProductInput,
        });
        if (res.errors) {
          message.error(res.errors[0].message);
          return;
        }
        message.success("更新成功");
      } else {
        const res = await createProduct({
          data: values as CreateProductInput,
        });
        if (res.errors) {
          message.error(res.errors[0].message);
          return;
        }
        message.success("创建成功");
      }

      onSuccess();
    } catch (error) {
      message.error(isEdit ? "更新失败" : "创建失败");
      console.error("Error submitting product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        handleSubmit(values);
      }}
      initialValues={{
        isActive: true,
        sort: 0,
      }}
    >
      <Form.Item label="商品图片" name="images">
        <CustomUpload max={99} />
      </Form.Item>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="title"
            label="商品标题"
            rules={[{ required: true, message: "请输入商品标题" }]}
          >
            <Input placeholder="请输入商品标题" maxLength={80} showCount />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="description" label="商品描述">
            <TextArea
              rows={4}
              placeholder="请输入商品描述"
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: "请输入价格" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请输入价格"
              min={0}
              precision={2}
              addonBefore="¥"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="commission"
            label="佣金"
            rules={[{ required: true, message: "请输入佣金" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请输入佣金"
              min={0}
              precision={2}
              addonBefore="¥"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="stock"
            label="库存"
            rules={[{ required: true, message: "请输入库存" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请输入库存"
              min={0}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="sort" label="排序" extra="排序越小越靠前">
            <InputNumber style={{ width: "100%" }} placeholder="请输入排序" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="isActive" label="是否上架" valuePropName="checked">
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item className="mb-0">
        <div className="w-full flex gap-2">
          <Button onClick={onCancel} className="w-full">
            取消
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            {isEdit ? "更新" : "创建"}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}

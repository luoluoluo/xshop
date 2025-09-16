"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Row,
  Col,
  Select,
} from "antd";
import {
  Link as LinkType,
  CreateLinkInput,
  UpdateLinkInput,
} from "@/generated/graphql";
import { createLink, updateLink } from "@/requests/link.client";
import { CustomUpload } from "@/components/custom-upload";

interface LinkFormProps {
  link?: LinkType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const PlatformLabel = ({ icon, text }: { icon: string; text: string }) => {
  return (
    <div className="flex items-center gap-2">
      <img
        src={`/images/brands/${icon}.png`}
        alt={text}
        className="h-6 w-auto"
      />
      <span>{text}</span>
    </div>
  );
};

const platformOptions = [
  {
    label: "其他（自定义平台）",
    value: "other",
  },
  {
    label: "抖音",
    value: "douyin",
  },
  {
    label: "小红书",
    value: "xiaohongshu",
  },
  {
    label: "公众号",
    value: "gongzhonghao",
  },
  {
    label: "视频号",
    value: "shipinhao",
  },
  {
    label: "知乎",
    value: "zhihu",
  },
  {
    label: "哔哩哔哩",
    value: "bilibili",
  },
  {
    label: "快手",
    value: "kuaishou",
  },
  {
    label: "火山小视频",
    value: "huoshanxiaoshipin",
  },
  {
    label: "豆瓣网",
    value: "doubanwang",
  },
  {
    label: "百度贴吧",
    value: "baidutieba",
  },
  {
    label: "新浪",
    value: "xinlang",
  },
  {
    label: "喜马拉雅",
    value: "ximalaya",
  },
  {
    label: "花瓣网",
    value: "huabanwang",
  },
  {
    label: "YouTube",
    value: "youtube",
  },
  {
    label: "Instagram",
    value: "instagram",
  },
  {
    label: "Facebook",
    value: "facebook",
  },
  {
    label: "Twitter/X",
    value: "TwitterX",
  },
  {
    label: "LinkedIn",
    value: "linkedin",
  },
  {
    label: "Pinterest",
    value: "pinterestST",
  },
  {
    label: "TikTok",
    value: "tiktok",
  },
];

export function LinkForm({ link, onSuccess, onCancel }: LinkFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [platform, setPlatform] = useState<string>("other");

  const isEdit = !!link;

  useEffect(() => {
    if (link) {
      form.setFieldsValue(link);
    } else {
      form.resetFields();
    }
  }, [link, form]);

  const handleSubmit = async (values: CreateLinkInput | UpdateLinkInput) => {
    setLoading(true);
    try {
      if (isEdit) {
        const res = await updateLink({
          id: link.id,
          data: values as UpdateLinkInput,
        });
        if (res.errors) {
          message.error(res.errors[0].message);
          return;
        }
        message.success("更新成功");
      } else {
        const res = await createLink({
          data: values as CreateLinkInput,
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
      console.error("Error submitting link:", error);
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
        sort: 0,
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="选择平台"
            rules={[{ required: true, message: "请选择平台" }]}
          >
            <Select
              defaultValue={platform}
              options={platformOptions.map((p) => ({
                label: <PlatformLabel icon={p.value} text={p.label} />,
                value: p.value,
              }))}
              onChange={(value) => {
                setPlatform(value);
                if (value === "other") {
                  form.setFieldsValue({
                    name: "",
                    logo: "",
                  });
                } else {
                  const logo = `${window.location.origin}/images/brands/${value}.png`;
                  form.setFieldsValue({
                    name: platformOptions.find((p) => p.value === value)?.label,
                    logo,
                  });
                }
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="平台名称"
            rules={[{ required: true, message: "请输入平台名称" }]}
          >
            <Input placeholder="请输入平台名称" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="logo" label="平台Logo">
            <CustomUpload max={1} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="url"
            label="我的主页链接地址/账号"
            rules={[{ required: true, message: "请输入链接地址/账号" }]}
          >
            <Input placeholder="请输入链接地址/账号" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="qrcode" label="我的主页二维码">
            <CustomUpload max={1} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="sort" label="排序" extra="排序越小越靠前">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请输入排序"
              min={0}
            />
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

import { Form, FormProps, Input, InputNumber, Select } from "antd";
import { CustomUpload } from "../../../components/custom-upload";
import { CreateLinkInput, UpdateLinkInput } from "../../../generated/graphql";
import { useTranslate } from "@refinedev/core";
import { useState } from "react";
import { storeUrl } from "../../../config";

const PlatformLabel = ({ icon, text }: { icon: string; text: string }) => {
  return (
    <div className="flex items-center gap-2">
      <img
        src={`${storeUrl}/images/brands/${icon}.png`}
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

export const LinkForm = ({ formProps }: { formProps: FormProps }) => {
  const t = useTranslate();
  const [platform, setPlatform] = useState<string>("other");

  const onFinish = (values: CreateLinkInput | UpdateLinkInput) => {
    values.sort = Number(values?.sort || 0);

    if (formProps.onFinish) {
      formProps.onFinish(values);
    }
  };

  return (
    <Form {...{ ...formProps, onFinish }} layout="vertical">
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
              formProps.form?.setFieldsValue({
                name: "",
                logo: "",
              });
            } else {
              const logo = `${storeUrl}/images/brands/${value}.png`;
              formProps.form?.setFieldsValue({
                name: platformOptions.find((p) => p.value === value)?.label,
                logo,
              });
            }
          }}
        />
      </Form.Item>
      <Form.Item
        label={t("link.fields.logo")}
        name={["logo"]}
        extra="建议上传正方形图片"
      >
        <CustomUpload max={1} />
      </Form.Item>
      <Form.Item
        label={t("link.fields.name")}
        name={["name"]}
        rules={[{ required: true, message: "请输入平台名称" }]}
      >
        <Input maxLength={80} showCount placeholder="请输入平台名称" />
      </Form.Item>

      <Form.Item label={t("link.fields.url")} name={["url"]}>
        <Input maxLength={200} showCount placeholder="请输入主页地址/ID" />
      </Form.Item>

      <Form.Item label={t("link.fields.qrcode")} name={["qrcode"]}>
        <CustomUpload max={1} />
      </Form.Item>

      <Form.Item
        label={t("fields.sort")}
        name={["sort"]}
        extra="排序越小越靠前"
        initialValue={0}
      >
        <InputNumber min={0} placeholder="请输入排序值" />
      </Form.Item>
    </Form>
  );
};

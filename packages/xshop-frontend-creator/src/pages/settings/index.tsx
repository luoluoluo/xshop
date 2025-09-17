"use client";
import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Spin,
  Alert,
  Tabs,
  Breadcrumb,
} from "antd";
import {
  ShopOutlined,
  BankOutlined,
  PhoneOutlined,
  MailOutlined,
  WechatOutlined,
  LinkOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { updateMe, createUserWechatMerchant } from "../../requests/auth";
import { CustomUpload } from "../../components/custom-upload";
import {
  CreateUserWechatMerchantInput,
  UpdateMeInput,
  User,
  WechatMerchantStatus,
} from "../../generated/graphql";
import { useSearchParams } from "react-router";
import { useGetIdentity } from "@refinedev/core";

const BasicSetting = ({
  me,
  loading,
  onFinish,
}: {
  me?: User;
  loading: boolean;
  onFinish: (values: UpdateMeInput) => void;
}) => {
  const [form] = Form.useForm();

  console.log(me);

  useEffect(() => {
    form.setFieldsValue(me);
  }, [me]);

  return (
    <Form
      form={form}
      name="settings"
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="slug"
        label="主页链接"
        rules={[{ required: true, message: "请输入主页链接" }]}
      >
        <Input
          prefix={
            <div className="flex items-center gap-1 text-gray-500">
              <LinkOutlined />
              <span>https://xltzx.com/</span>
            </div>
          }
          placeholder="请输入主页链接"
        />
      </Form.Item>
      <Form.Item
        name="avatar"
        label="头像"
        extra="建议尺寸：正方形"
        rules={[{ required: true, message: "请上传头像" }]}
      >
        <CustomUpload />
      </Form.Item>
      <Form.Item
        name="name"
        label="姓名"
        rules={[{ required: true, message: "请输入姓名" }]}
      >
        <Input
          prefix={<ShopOutlined />}
          placeholder="请输入姓名"
          maxLength={10}
          showCount
        />
      </Form.Item>

      <Form.Item
        name="title"
        label="一句话介绍自己"
        rules={[{ required: true, message: "请输入一句话介绍自己" }]}
      >
        <Input
          prefix={<InfoCircleOutlined />}
          placeholder="请输入一句话介绍自己"
          maxLength={20}
          showCount
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="个人介绍"
        rules={[{ required: true, message: "请输入个人介绍" }]}
      >
        <Input.TextArea rows={6} maxLength={500} showCount />
      </Form.Item>

      <Form.Item
        name="backgroundImage"
        label="背景图"
        extra="建议尺寸：1920*1080"
      >
        <CustomUpload />
      </Form.Item>

      <Form.Item name="phone" label="手机号">
        <Input
          prefix={<PhoneOutlined />}
          placeholder="请输入手机号"
          maxLength={20}
          showCount
        />
      </Form.Item>

      <Form.Item name="email" label="邮箱">
        <Input
          prefix={<MailOutlined />}
          placeholder="请输入邮箱"
          maxLength={40}
          showCount
        />
      </Form.Item>

      <Form.Item name="wechatId" label="微信号">
        <Input
          prefix={<WechatOutlined />}
          placeholder="请输入微信号"
          maxLength={40}
          showCount
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ width: "100%", height: 40 }}
        >
          保存设置
        </Button>
      </Form.Item>
    </Form>
  );
};

const PaymentSetting = ({
  me,
  applyLoading,
  onApply,
}: {
  me?: User;
  applyLoading: boolean;
  onApply: (values: CreateUserWechatMerchantInput) => void;
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: CreateUserWechatMerchantInput) => {
    onApply(values);
  };

  const isEditable =
    me?.wechatMerchantStatus !== WechatMerchantStatus.Completed;

  const getStatusAlert = () => {
    switch (me?.wechatMerchantStatus) {
      case WechatMerchantStatus.Created:
        return (
          <Alert
            message="微信支付配置审核中"
            description="我们会尽快审核您的申请，请耐心等待"
            type="info"
            style={{ marginBottom: 24 }}
          />
        );
      case WechatMerchantStatus.Completed:
        return (
          <Alert
            message="已完成配置"
            description={`商户号：${me.wechatMerchantId}`}
            type="success"
            style={{ marginBottom: 24 }}
          />
        );
      default:
        return (
          <Alert
            message="您还未配置微信支付"
            description="配置微信支付后，可以接收微信支付收款"
            type="info"
            style={{ marginBottom: 24 }}
          />
        );
    }
  };

  useEffect(() => {
    if (me) {
      form.setFieldsValue({
        idCardFrontPhoto: me.idCardFrontPhoto,
        idCardBackPhoto: me.idCardBackPhoto,
        businessLicensePhoto: me.businessLicensePhoto,
        bankAccountName: me.bankAccountName,
        bankAccountNumber: me.bankAccountNumber,
      });
    }
  }, [me]);

  return (
    <div>
      {getStatusAlert()}
      <Form form={form} onFinish={handleFinish} layout="vertical" size="large">
        <Form.Item
          name="businessLicensePhoto"
          label="营业执照照片"
          rules={
            isEditable
              ? [{ required: true, message: "请上传营业执照照片" }]
              : undefined
          }
          extra="请上传清晰的营业执照照片"
        >
          {isEditable ? (
            <CustomUpload />
          ) : (
            <img
              src={me.businessLicensePhoto || ""}
              alt="营业执照"
              style={{ maxWidth: 300 }}
            />
          )}
        </Form.Item>
        <Form.Item
          name="idCardFrontPhoto"
          label="法人身份证正面照片"
          rules={
            isEditable
              ? [{ required: true, message: "请上传法人身份证正面照片" }]
              : undefined
          }
          extra="请上传清晰的法人身份证正面照片"
        >
          {isEditable ? (
            <CustomUpload />
          ) : (
            <img
              src={me.idCardFrontPhoto || ""}
              alt="法人身份证正面"
              style={{ maxWidth: 300 }}
            />
          )}
        </Form.Item>

        <Form.Item
          name="idCardBackPhoto"
          label="法人身份证背面照片"
          rules={
            isEditable
              ? [{ required: true, message: "请上传法人身份证背面照片" }]
              : undefined
          }
          extra="请上传清晰的法人身份证背面照片"
        >
          {isEditable ? (
            <CustomUpload />
          ) : (
            <img
              src={me.idCardBackPhoto || ""}
              alt="法人身份证背面"
              style={{ maxWidth: 300 }}
            />
          )}
        </Form.Item>

        <Form.Item
          name="bankCardPhoto"
          label="对公银行卡号"
          rules={
            isEditable
              ? [{ required: true, message: "请输入对公银行卡号" }]
              : undefined
          }
          extra="请输入对公银行卡号或法人银行卡号（个体工商户）"
        >
          <Input
            prefix={<BankOutlined />}
            placeholder="请输入对公银行卡号"
            readOnly={!isEditable}
          />
        </Form.Item>

        {isEditable && (
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={applyLoading}
              style={{ width: "100%" }}
            >
              提交
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default function Setting() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const { data: me } = useGetIdentity<User>();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "basic",
  );

  const handleApplyWechatUser = (values: CreateUserWechatMerchantInput) => {
    setApplyLoading(true);
    createUserWechatMerchant({ data: values })
      .then((res) => {
        if (res.errors) {
          console.error("Apply error:", res.errors);
          message.error(res.errors[0]?.message || "申请失败");
          return;
        }
        message.success("申请成功");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Apply error:", err);
        message.error("申请失败");
      })
      .finally(() => {
        setApplyLoading(false);
      });
  };

  const onFinish = (values: UpdateMeInput) => {
    setLoading(true);
    updateMe({ data: values })
      .then((res) => {
        if (res.errors) {
          console.error("Update error:", res.errors);
          message.error(res.errors[0]?.message || "更新失败");
          return;
        }

        message.success("更新成功");
      })
      .catch((err) => {
        console.error("Update error:", err);
        message.error("更新失败");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const items = [
    {
      key: "basic",
      label: "名片设置",
      children: <BasicSetting me={me} loading={loading} onFinish={onFinish} />,
    },
    {
      key: "payment",
      label: "支付设置",
      children: (
        <PaymentSetting
          me={me}
          applyLoading={applyLoading}
          onApply={handleApplyWechatUser}
        />
      ),
    },
  ];

  return (
    <>
      <Breadcrumb
        className="!mb-4"
        items={[
          { title: "仪表盘", href: "/" },
          {
            title: items.find((item) => item.key === activeTab)?.label,
          },
        ]}
      />
      <Card>
        <Tabs
          defaultActiveKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
          }}
          items={items}
          size="large"
        />
      </Card>
    </>
  );
}

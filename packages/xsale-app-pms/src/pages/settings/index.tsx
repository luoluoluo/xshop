import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Spin,
  Alert,
  QRCode,
  Descriptions,
  Tabs,
} from "antd";
import {
  EnvironmentOutlined,
  ShopOutlined,
  FileTextOutlined,
  LockOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import { request } from "../../utils/request";
import { updateMe, applyWechatMerchant } from "../../requests/auth";
import { CustomEditor } from "../../components/custom-editor";
import { CustomUpload } from "../../components/custom-upload";
import { useGetIdentity } from "@refinedev/core";
import { Merchant, WechatMerchantStatus } from "../../generated/graphql";

const { Text } = Typography;

const BasicSettings = ({
  me,
  loading,
  onFinish,
}: {
  me: Merchant;
  loading: boolean;
  onFinish: any;
}) => {
  const [form] = Form.useForm();

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
        name="name"
        label="商户名称"
        rules={[
          { required: true, message: "请输入商户名称" },
          { min: 2, message: "商户名称至少2个字符" },
        ]}
      >
        <Input prefix={<ShopOutlined />} placeholder="请输入商户名称" />
      </Form.Item>

      <Form.Item
        name="businessScope"
        label="经营范围"
        rules={[{ required: true, message: "请输入经营范围" }]}
      >
        <Input prefix={<FileTextOutlined />} placeholder="请输入经营范围" />
      </Form.Item>

      <Form.Item
        name="address"
        label="地址"
        rules={[{ required: true, message: "请输入地址" }]}
      >
        <Input prefix={<EnvironmentOutlined />} placeholder="请输入地址" />
      </Form.Item>

      <Form.Item
        name="description"
        label="商户简介"
        rules={[{ required: true, message: "请输入商户简介" }]}
      >
        <CustomEditor />
      </Form.Item>

      <Form.Item
        name="logo"
        label="商户Logo"
        rules={[{ required: true, message: "请上传商户Logo" }]}
        extra="建议尺寸：正方形，宽高比为1:1"
      >
        <CustomUpload />
      </Form.Item>

      <Form.Item name="images" label="商户相册">
        <CustomUpload max={20} />
      </Form.Item>

      <Form.Item
        name="wechatQrcode"
        label="微信二维码"
        rules={[{ required: true, message: "请上传微信二维码" }]}
      >
        <CustomUpload />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        extra={"非必填，填写后会修改密码"}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
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

const PaymentSettings = ({
  me,
  applyLoading,
  onApply,
}: {
  me: Merchant;
  applyLoading: boolean;
  onApply: (values: {
    idCardFrontPhoto: string;
    idCardBackPhoto: string;
    businessLicensePhoto: string;
    bankCardPhoto: string;
  }) => void;
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: {
    idCardFrontPhoto: string;
    idCardBackPhoto: string;
    businessLicensePhoto: string;
    bankCardPhoto: string;
  }) => {
    onApply(values);
  };

  const isEditable =
    !me.wechatMerchantStatus ||
    me.wechatMerchantStatus === WechatMerchantStatus.Rejected;

  const getStatusAlert = () => {
    switch (me.wechatMerchantStatus) {
      case WechatMerchantStatus.Applied:
        return (
          <>
            <Alert
              message="请使用微信扫描下方二维码完成微信支付配置"
              type="info"
              style={{ marginBottom: 24 }}
            />
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <QRCode value={me.wechatMerchantSignUrl || ""} size={200} />
            </div>
          </>
        );
      case WechatMerchantStatus.Rejected:
        return (
          <Alert
            message="微信支付配置申请被拒绝"
            description={me.wechatMerchantNote}
            type="error"
            style={{ marginBottom: 24 }}
          />
        );
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
            description="配置微信支付后，可以接收微信支付订单"
            type="info"
            style={{ marginBottom: 24 }}
          />
        );
    }
  };

  return (
    <div>
      {getStatusAlert()}
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        size="large"
        initialValues={{
          idCardFrontPhoto: me.idCardFrontPhoto,
          idCardBackPhoto: me.idCardBackPhoto,
          businessLicensePhoto: me.businessLicensePhoto,
          bankCardPhoto: me.bankCardPhoto,
        }}
      >
        <Form.Item
          name="idCardFrontPhoto"
          label="身份证正面照片"
          rules={
            isEditable
              ? [{ required: true, message: "请上传身份证正面照片" }]
              : undefined
          }
          extra="请上传清晰的身份证正面照片"
        >
          {isEditable ? (
            <CustomUpload />
          ) : (
            <img
              src={me.idCardFrontPhoto || ""}
              alt="身份证正面"
              style={{ maxWidth: 300 }}
            />
          )}
        </Form.Item>

        <Form.Item
          name="idCardBackPhoto"
          label="身份证背面照片"
          rules={
            isEditable
              ? [{ required: true, message: "请上传身份证背面照片" }]
              : undefined
          }
          extra="请上传清晰的身份证背面照片"
        >
          {isEditable ? (
            <CustomUpload />
          ) : (
            <img
              src={me.idCardBackPhoto || ""}
              alt="身份证背面"
              style={{ maxWidth: 300 }}
            />
          )}
        </Form.Item>

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
          name="bankCardPhoto"
          label="银行卡照片"
          rules={
            isEditable
              ? [{ required: true, message: "请上传银行卡照片" }]
              : undefined
          }
          extra="请上传清晰的银行卡照片"
        >
          {isEditable ? (
            <CustomUpload />
          ) : (
            <img
              src={me.bankCardPhoto || ""}
              alt="银行卡"
              style={{ maxWidth: 300 }}
            />
          )}
        </Form.Item>

        {isEditable && (
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={applyLoading}
              style={{ width: "100%" }}
            >
              {me.wechatMerchantStatus === WechatMerchantStatus.Rejected
                ? "重新申请"
                : "提交"}
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const { data: me, refetch } = useGetIdentity<Merchant>();

  if (!me) {
    return <Spin />;
  }

  const handleApplyWechatMerchant = (values: {
    idCardFrontPhoto: string;
    idCardBackPhoto: string;
    businessLicensePhoto: string;
    bankCardPhoto: string;
  }) => {
    setApplyLoading(true);
    request({
      query: applyWechatMerchant,
      variables: { data: values },
    })
      .then((res) => {
        if (res.errors) {
          console.error("Apply error:", res.errors);
          message.error(res.errors[0]?.message || "申请失败");
          return;
        }
        message.success("申请成功");
        refetch(); // 刷新用户信息
      })
      .catch((err) => {
        console.error("Apply error:", err);
        message.error("申请失败");
      })
      .finally(() => {
        setApplyLoading(false);
      });
  };

  const onFinish = (values: {
    name?: string;
    address?: string;
    businessScope?: string;
    description?: string;
    logo?: string;
    wechatQrcode?: string;
  }) => {
    setLoading(true);

    // Remove undefined values
    const updateData = Object.fromEntries(
      Object.entries(values).filter(
        ([_, value]) => value !== undefined && value !== "",
      ),
    );

    request({
      query: updateMe,
      variables: { data: updateData },
    })
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
      label: "基本配置",
      children: <BasicSettings me={me} loading={loading} onFinish={onFinish} />,
    },
    {
      key: "payment",
      label: "支付配置",
      children: (
        <PaymentSettings
          me={me}
          applyLoading={applyLoading}
          onApply={handleApplyWechatMerchant}
        />
      ),
    },
  ];

  return (
    <Card>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Typography.Title level={3}>个人设置</Typography.Title>
        <Text type="secondary">修改您的商户信息</Text>
      </div>

      <Tabs defaultActiveKey="basic" items={items} size="large" />
    </Card>
  );
};

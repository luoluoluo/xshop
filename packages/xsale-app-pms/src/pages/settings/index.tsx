import { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography, message, Spin } from "antd";
import {
  EnvironmentOutlined,
  ShopOutlined,
  FileTextOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { request } from "../../utils/request";
import { updateMe } from "../../requests/auth";
import { CustomEditor } from "../../components/custom-editor";
import { CustomUpload } from "../../components/custom-upload";
import { useGetIdentity } from "@refinedev/core";
import { Merchant } from "../../generated/graphql";

const { Text } = Typography;

export const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { data: me } = useGetIdentity<Merchant>();

  useEffect(() => {
    form.setFieldsValue(me);
    console.log(me, 22222);
  }, [me]);

  if (!me) {
    return <Spin />;
  }

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

  return (
    <Card>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Typography.Title level={3}>个人设置</Typography.Title>
        <Text type="secondary">修改您的商户信息</Text>
      </div>

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
        >
          <CustomUpload />
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
    </Card>
  );
};

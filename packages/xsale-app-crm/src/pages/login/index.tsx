import { useState } from "react";
import { useLogin } from "@refinedev/core";
import { Form, Input, Button, Card, Typography } from "antd";
import { LockOutlined, MobileOutlined } from "@ant-design/icons";
import { Title } from "../../components/title";

const { Text } = Typography;

export const Login = () => {
  const { mutate: login } = useLogin();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: { phone: string; password: string }) => {
    setLoading(true);
    login(values, {
      onSuccess: () => {
        setLoading(false);
      },
      onError: (error) => {
        console.error("Login error:", error);
        setLoading(false);
      },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <Title />
      </div>

      <Card
        style={{
          width: 400,
          padding: "24px 0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Typography.Title level={3}>登录</Typography.Title>
          <Text type="secondary">请输入您的手机号和密码</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "请输入手机号" },
              { pattern: /^1\d{10}$/, message: "请输入有效的手机号" },
            ]}
          >
            <Input
              prefix={<MobileOutlined />}
              placeholder="手机号"
              maxLength={11}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码长度至少为6位" },
            ]}
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
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

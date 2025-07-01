import { useState } from "react";
import { useLogin } from "@refinedev/core";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { LockOutlined, MobileOutlined } from "@ant-design/icons";
import { Title } from "../../components/title";
import { request } from "../../utils/request";
import { sendSmsCode } from "../../requests/auth";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export const Login = () => {
  const { mutate: login } = useLogin();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onSendSmsCode = async () => {
    try {
      const phone = form.getFieldValue("phone");
      if (!phone) {
        message.error("请先输入手机号");
        return;
      }

      const res = await request({
        query: sendSmsCode,
        variables: { data: { phone, type: "LOGIN" } },
      });

      if (res.errors) {
        console.error("Send SMS error:", res.errors);
        message.error(res.errors[0].message || "发送验证码失败");
        return;
      }

      message.success("验证码已发送");
      setCountdown(60);

      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Send SMS error:", error);
      message.error("发送验证码失败");
    }
  };

  const onFinish = (values: { phone: string; smsCode: string }) => {
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

      <Card className="w-full lg:w-[500px]">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Typography.Title level={3}>登录</Typography.Title>
          <Text type="secondary">请输入您的手机号和验证码</Text>
        </div>

        <Form
          form={form}
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
            name="smsCode"
            rules={[
              { required: true, message: "请输入验证码" },
              { len: 4, message: "验证码为4位数字" },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              placeholder="验证码"
              maxLength={4}
              suffix={
                <Button
                  type="link"
                  size="small"
                  disabled={countdown > 0}
                  onClick={() => void onSendSmsCode()}
                  style={{ padding: 0 }}
                >
                  {countdown > 0 ? `${countdown}s` : "发送验证码"}
                </Button>
              }
            />
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

          <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
            <Text type="secondary">
              还没有账号？{" "}
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => navigate("/register")}
              >
                立即注册
              </Button>
            </Text>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

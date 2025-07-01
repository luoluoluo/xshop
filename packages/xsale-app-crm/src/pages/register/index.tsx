import { useState } from "react";
import { useRegister } from "@refinedev/core";
import { Form, Input, Button, Card, Typography, message } from "antd";
import {
  LockOutlined,
  MobileOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Title } from "../../components/title";
import { request } from "../../utils/request";
import { sendSmsCode } from "../../requests/auth";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export const Register = () => {
  const { mutate: register } = useRegister();
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
        variables: { data: { phone, type: "REGISTER" } },
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

  const onFinish = (values: {
    name: string;
    phone: string;
    smsCode: string;
  }) => {
    setLoading(true);
    // Remove undefined values
    const registerData = Object.fromEntries(
      Object.entries(values).filter(
        ([_, value]) => value !== undefined && value !== "",
      ),
    );

    register(registerData, {
      onSuccess: () => {
        setLoading(false);
        message.success("注册成功");
      },
      onError: (error) => {
        console.error("Register error:", error);
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
        padding: "20px 0",
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <Title />
      </div>

      <Card className="w-full lg:w-[500px]">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Typography.Title level={3}>推广员注册</Typography.Title>
          <Text type="secondary">请填写您的个人信息</Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: "请输入姓名" },
              { min: 2, message: "姓名至少2个字符" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
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
            label="验证码"
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
              注册
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: "center", marginBottom: 0 }}>
            <Text type="secondary">
              已有账号？{" "}
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => navigate("/login")}
              >
                立即登录
              </Button>
            </Text>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

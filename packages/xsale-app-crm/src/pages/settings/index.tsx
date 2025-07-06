import { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { request } from "../../utils/request";
import { updateMe } from "../../requests/auth";
import { useGetIdentity } from "@refinedev/core";
import { Affiliate } from "../../generated/graphql";

const { Text } = Typography;

export const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { data: me } = useGetIdentity<Affiliate>();

  useEffect(() => {
    form.setFieldsValue(me);
  }, [me]);

  const onFinish = (values: { name?: string; phone?: string }) => {
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

  if (!me) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Typography.Title level={3}>个人设置</Typography.Title>
        <Text type="secondary">修改您的个人信息</Text>
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
          label="姓名"
          rules={[
            { required: true, message: "请输入姓名" },
            { min: 2, message: "姓名至少2个字符" },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
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

"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  message,
  Card,
  Typography,
  Divider,
  Alert,
} from "antd";
import { Withdrawal, CreateWithdrawalInput } from "@/generated/graphql";
import { createWithdrawal } from "@/requests/withdrawal.client";
import { useAuth } from "@/contexts/auth";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface WithdrawalFormProps {
  withdrawal?: Withdrawal | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function WithdrawalForm({ onSuccess, onCancel }: WithdrawalFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { me } = useAuth();

  const handleSubmit = async (values: CreateWithdrawalInput) => {
    setLoading(true);
    try {
      const res = await createWithdrawal({ data: values });
      if (res.errors) {
        message.error(res.errors[0].message);
        return;
      }
      onSuccess();
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      message.error("提现申请失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="mb-6">
          <Title level={4} className="!mb-2">
            申请提现
          </Title>
          <Text type="secondary">填写提现申请信息，系统将自动计算税费</Text>
        </div>

        <Alert
          message="提现说明"
          description={
            <div className="space-y-2">
              <div>• 提现申请提交后，系统将自动扣除6%税费</div>
              <div>• 银行账户信息必须与上次提现账户一致</div>
              <div>• 如有未完成的提现申请，需等待完成后方可再次申请</div>
              <div>• 当前余额：¥{me?.balance || 0}</div>
            </div>
          }
          type="info"
          showIcon
          className="mb-6"
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            void handleSubmit(values);
          }}
          autoComplete="off"
          disabled={loading}
        >
          <Form.Item
            label="提现金额"
            name="amount"
            rules={[
              { required: true, message: "请输入提现金额" },
              { type: "number", min: 1, message: "提现金额必须大于0" },
              {
                validator: (_, value) => {
                  if (value && me?.balance && value > me.balance) {
                    return Promise.reject(
                      new Error("提现金额不能超过当前余额"),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              placeholder="请输入提现金额"
              style={{ width: "100%" }}
              precision={2}
              addonBefore="¥"
            />
          </Form.Item>

          <Form.Item
            label="银行账户名"
            name="bankAccountName"
            rules={[
              { required: true, message: "请输入银行账户名" },
              { max: 50, message: "银行账户名不能超过50个字符" },
            ]}
          >
            <Input placeholder="请输入银行账户名" />
          </Form.Item>

          <Form.Item
            label="银行账户号"
            name="bankAccountNumber"
            rules={[
              { required: true, message: "请输入银行账户号" },
              { max: 100, message: "银行账户号不能超过100个字符" },
            ]}
          >
            <Input placeholder="请输入银行账户号" />
          </Form.Item>

          <Form.Item
            label="备注"
            name="note"
            rules={[{ max: 200, message: "备注不能超过200个字符" }]}
          >
            <TextArea placeholder="请输入备注信息（可选）" rows={3} />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={onCancel} disabled={loading}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交申请
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

import {
  Form,
  FormProps,
  Input,
  InputNumber,
  Alert,
  Card,
  Typography,
} from "antd";
import { CreateWithdrawalInput, User } from "../../../generated/graphql";
import { useTranslate, useGetIdentity } from "@refinedev/core";

const { TextArea } = Input;
const { Title, Text } = Typography;

export const WithdrawalForm = ({ formProps }: { formProps: FormProps }) => {
  const t = useTranslate();
  const { data: me } = useGetIdentity<User>();

  const onFinish = (values: CreateWithdrawalInput) => {
    values.amount = Number(values?.amount || 0);

    if (formProps.onFinish) {
      formProps.onFinish(values);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="mb-6">
          <Title level={4} className="!mb-2">
            {t("withdrawal.titles.create")}
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

        <Form {...{ ...formProps, onFinish }} layout="vertical">
          <Form.Item
            label={t("withdrawal.fields.amount")}
            name={["amount"]}
            rules={[
              { required: true, message: "请输入提现金额" },
              { type: "number", min: 1, message: "提现金额必须大于0" },
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
            label={t("withdrawal.fields.bankAccountName")}
            name={["bankAccountName"]}
            rules={[
              { required: true, message: "请输入银行账户名" },
              { max: 50, message: "银行账户名不能超过50个字符" },
            ]}
          >
            <Input placeholder="请输入银行账户名" />
          </Form.Item>

          <Form.Item
            label={t("withdrawal.fields.bankAccountNumber")}
            name={["bankAccountNumber"]}
            rules={[
              { required: true, message: "请输入银行账户号" },
              { max: 100, message: "银行账户号不能超过100个字符" },
            ]}
          >
            <Input placeholder="请输入银行账户号" />
          </Form.Item>

          <Form.Item
            label={t("withdrawal.fields.note")}
            name={["note"]}
            rules={[{ max: 200, message: "备注不能超过200个字符" }]}
          >
            <TextArea placeholder="请输入备注信息（可选）" rows={3} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

import { Form, FormProps, Input, InputNumber } from "antd";
import { useTranslate } from "@refinedev/core";

export const MerchantWithdrawalForm = ({
  formProps,
}: {
  formProps: FormProps;
}) => {
  const t = useTranslate();

  const onFinish = (values: any) => {
    if (formProps.onFinish) {
      formProps.onFinish(values);
    }
  };

  return (
    <Form {...{ ...formProps, onFinish }} layout="vertical">
      <Form.Item
        label={t("merchantWithdrawal.fields.amount")}
        name={["amount"]}
        rules={[
          {
            required: true,
          },
          {
            type: "number",
            min: 0.01,
          },
        ]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={0.01}
          step={0.01}
          precision={2}
          placeholder={t("merchantWithdrawal.fields.amount")}
        />
      </Form.Item>

      <Form.Item
        label={t("merchantWithdrawal.fields.bankName")}
        name={["bankName"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder={t("merchantWithdrawal.fields.bankName")} />
      </Form.Item>

      <Form.Item
        label={t("merchantWithdrawal.fields.bankAccount")}
        name={["bankAccount"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder={t("merchantWithdrawal.fields.bankAccount")} />
      </Form.Item>

      <Form.Item
        label={t("merchantWithdrawal.fields.accountName")}
        name={["accountName"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder={t("merchantWithdrawal.fields.accountName")} />
      </Form.Item>

      <Form.Item label={t("merchantWithdrawal.fields.note")} name={["note"]}>
        <Input.TextArea
          rows={4}
          placeholder={t("merchantWithdrawal.fields.note")}
        />
      </Form.Item>
    </Form>
  );
};

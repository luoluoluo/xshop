import { Form, FormProps, Input, InputNumber } from "antd";
import { useTranslate } from "@refinedev/core";

export const AffiliateWithdrawalForm = ({
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
        label={t("affiliateWithdrawal.fields.amount")}
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
          placeholder={t("affiliateWithdrawal.fields.amount")}
        />
      </Form.Item>

      <Form.Item
        label={t("affiliateWithdrawal.fields.bankName")}
        name={["bankName"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder={t("affiliateWithdrawal.fields.bankName")} />
      </Form.Item>

      <Form.Item
        label={t("affiliateWithdrawal.fields.bankAccount")}
        name={["bankAccount"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder={t("affiliateWithdrawal.fields.bankAccount")} />
      </Form.Item>

      <Form.Item
        label={t("affiliateWithdrawal.fields.accountName")}
        name={["accountName"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder={t("affiliateWithdrawal.fields.accountName")} />
      </Form.Item>

      <Form.Item label={t("affiliateWithdrawal.fields.note")} name={["note"]}>
        <Input.TextArea
          rows={4}
          placeholder={t("affiliateWithdrawal.fields.note")}
        />
      </Form.Item>
    </Form>
  );
};

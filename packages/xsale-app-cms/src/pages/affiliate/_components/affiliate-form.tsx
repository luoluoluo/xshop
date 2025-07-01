import { Form, FormProps, Input, Switch } from "antd";
import { useTranslate } from "@refinedev/core";

export const AffiliateForm = ({ formProps }: { formProps: FormProps }) => {
  const t = useTranslate();

  const onFinish = (values: any) => {
    if (formProps.onFinish) {
      formProps.onFinish(values);
    }
  };

  return (
    <Form {...{ ...formProps, onFinish }} layout="vertical">
      <Form.Item
        label={t("affiliate.fields.name")}
        name={["name"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("affiliate.fields.phone")}
        name={["phone"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label={t("affiliate.fields.bankName")} name={["bankName"]}>
        <Input />
      </Form.Item>
      <Form.Item
        label={t("affiliate.fields.accountName")}
        name={["accountName"]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t("affiliate.fields.bankAccount")}
        name={["bankAccount"]}
      >
        <Input />
      </Form.Item>

      <Form.Item label={t("fields.isActive.label")} name={["isActive"]}>
        <Switch />
      </Form.Item>
    </Form>
  );
};

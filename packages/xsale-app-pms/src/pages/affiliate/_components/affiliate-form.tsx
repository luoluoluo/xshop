import { Form, FormProps, Input } from "antd";
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
    </Form>
  );
};

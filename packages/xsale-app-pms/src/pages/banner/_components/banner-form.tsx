import { useTranslate } from "@refinedev/core";
import { Form, FormProps, Input, Switch } from "antd";
import { CustomUpload } from "../../../components/custom-upload";

export const BannerForm = ({ formProps }: { formProps: FormProps }) => {
  const t = useTranslate();

  const onFinish = (values: any) => {
    values.sort = Number(values?.sort || 0);
    if (formProps.onFinish) {
      formProps.onFinish(values);
    }
  };

  return (
    <Form {...{ ...formProps, onFinish }} layout="vertical">
      <Form.Item
        label={t("banner.fields.image")}
        name={["image"]}
        rules={[{ required: true }]}
      >
        <CustomUpload />
      </Form.Item>
      <Form.Item
        label={t("banner.fields.title")}
        name={["title"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={t("banner.fields.link")} name={["link"]}>
        <Input />
      </Form.Item>
      <Form.Item
        label={t("fields.sort")}
        name={["sort"]}
        rules={[{ required: true }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item label={t("fields.isActive.label")} name={["isActive"]}>
        <Switch />
      </Form.Item>
    </Form>
  );
};

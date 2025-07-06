import { Form, FormProps, Input, Switch } from "antd";
import { CustomUpload } from "../../../components/custom-upload";
import { CustomEditor } from "../../../components/custom-editor";
import { useTranslate } from "@refinedev/core";

export const ArticleForm = ({ formProps }: { formProps: FormProps }) => {
  const t = useTranslate();

  const onFinish = (values: any) => {
    if (formProps.onFinish) {
      formProps.onFinish(values);
    }
  };
  return (
    <Form {...{ ...formProps, onFinish }} layout="vertical">
      <Form.Item
        label={t("article.fields.slug")}
        name={["slug"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={t("article.fields.image")} name={["image"]}>
        <CustomUpload />
      </Form.Item>
      <Form.Item
        label={t("article.fields.title")}
        name={["title"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label={t("article.fields.description")} name={["description"]}>
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label={t("article.fields.content")}
        name={["content"]}
        rules={[{ required: true }]}
      >
        <CustomEditor />
      </Form.Item>

      <Form.Item label={t("fields.isActive.label")} name={["isActive"]}>
        <Switch />
      </Form.Item>
    </Form>
  );
};

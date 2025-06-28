import { Form, FormProps, Input, Switch } from "antd";
import { CustomUpload } from "../../../components/custom-upload";
import { CustomEditor } from "../../../components/custom-editor";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../../../generated/graphql";
import { useTranslate } from "@refinedev/core";

export const ProductForm = ({ formProps }: { formProps: FormProps }) => {
  const t = useTranslate();

  const price = Form.useWatch<number>("price", formProps.form);
  const commission = Form.useWatch<number>("commission", formProps.form);

  const onFinish = (values: CreateProductInput | UpdateProductInput) => {
    values.sort = Number(values?.sort || 0);
    values.commission = Number(values?.commission || 0);
    values.price = Number(values?.price || 0);
    values.stock = Number(values?.stock || 0);

    if (formProps.onFinish) {
      formProps.onFinish(values);
    }
  };
  return (
    <Form {...{ ...formProps, onFinish }} layout="vertical">
      <Form.Item
        label={t("product.fields.image")}
        name={["image"]}
        rules={[{ required: true }]}
      >
        <CustomUpload />
      </Form.Item>

      <Form.Item
        label={t("product.fields.title")}
        name={["title"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("product.fields.price")}
        name={["price"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("product.fields.commission")}
        name={["commission"]}
        rules={[
          { required: true },
          {
            validator: (_, value) => {
              value = Number(value);
              if (value && value > price) {
                return Promise.reject(new Error("佣金不能大于价格"));
              }
              if (value && value < price * 0.05) {
                return Promise.reject(new Error("佣金不能小于价格的5%"));
              }
              return Promise.resolve();
            },
          },
        ]}
        extra={`
          ${commission && price
            ? `佣金比例：${((commission / price) * 100).toFixed(2)}%`
            : ""
          }（包含平台服务费1%，商家客户经理1%）`}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("product.fields.stock")}
        name={["stock"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("product.fields.content")}
        name={["content"]}
        rules={[{ required: true }]}
      >
        <CustomEditor />
      </Form.Item>
      <Form.Item
        label={t("fields.sort")}
        name={["sort"]}
        rules={[{ required: true }]}
        initialValue={0}
      >
        <Input />
      </Form.Item>
      <Form.Item label={t("fields.isActive.label")} name={["isActive"]}>
        <Switch />
      </Form.Item>
    </Form>
  );
};

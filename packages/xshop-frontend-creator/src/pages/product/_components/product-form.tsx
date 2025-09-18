import { Form, FormProps, Input, Switch, InputNumber } from "antd";
import { CustomUpload } from "../../../components/custom-upload";
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
        label={t("product.fields.images")}
        name={["images"]}
        rules={[{ required: true }]}
      >
        <CustomUpload max={20} />
      </Form.Item>

      <Form.Item
        label={t("product.fields.title")}
        name={["title"]}
        rules={[{ required: true }]}
      >
        <Input maxLength={80} showCount />
      </Form.Item>

      <Form.Item label={t("product.fields.description")} name={["description"]}>
        <Input.TextArea maxLength={500} showCount />
      </Form.Item>

      <Form.Item
        label={t("product.fields.price")}
        name={["price"]}
        rules={[{ required: true }]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        label={t("product.fields.commission")}
        name={["commission"]}
        extra={`佣金比例不能大于30%，不能小于5%, 佣金比例为: ${(
          ((commission ?? 0) / (price ?? 0)) *
          100
        ).toFixed(2)}%`}
        rules={[
          { required: true },
          {
            validator: (_, value) => {
              const rate = (value / price) * 100;
              if (rate && rate > 30) {
                return Promise.reject(new Error("佣金比例不能大于30%"));
              }
              if (rate && rate < 5) {
                return Promise.reject(new Error("佣金比例不能小于5%"));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        label={t("product.fields.stock")}
        name={["stock"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("fields.sort")}
        name={["sort"]}
        extra="排序越小越靠前"
        initialValue={0}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item label={t("fields.isActive.label")} name={["isActive"]}>
        <Switch />
      </Form.Item>
    </Form>
  );
};

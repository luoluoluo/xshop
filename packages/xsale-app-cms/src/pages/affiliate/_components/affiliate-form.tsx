import { Form, FormProps, Input, Switch, Select } from "antd";
import { useTranslate } from "@refinedev/core";
import { useSelect } from "@refinedev/antd";
import { parse } from "graphql";
import { getMerchants } from "../../../requests/merchant";
import { useEffect } from "react";

export const AffiliateForm = ({ formProps }: { formProps: FormProps }) => {
  const t = useTranslate();

  const { selectProps: merchantSelectProps } = useSelect({
    resource: "merchants",
    meta: {
      gqlQuery: parse(getMerchants),
    },
    optionLabel: "name",
    optionValue: "id",
  });

  // 处理初始值，将merchantAffiliates转换为merchantIds
  useEffect(() => {
    if (formProps.initialValues?.merchantAffiliates) {
      const merchantIds = formProps.initialValues.merchantAffiliates.map(
        (item: any) => item.merchant.id,
      );
      formProps.form?.setFieldsValue({
        merchantIds: merchantIds,
      });
    }
  }, [formProps.initialValues, formProps.form]);

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

      <Form.Item
        label={t("merchant.fields.password")}
        name={["password"]}
        extra={formProps.initialValues?.id ? "非必填，填写后会修改密码" : ""}
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

      <Form.Item
        label="关联商家"
        name={["merchantIds"]}
        extra="可选择多个商家，非必填"
      >
        <Select
          mode="multiple"
          placeholder="请选择关联的商家"
          allowClear
          {...merchantSelectProps}
        />
      </Form.Item>

      <Form.Item label={t("fields.isActive.label")} name={["isActive"]}>
        <Switch />
      </Form.Item>
    </Form>
  );
};
